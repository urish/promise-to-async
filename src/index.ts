import * as ts from 'typescript';

import { applyReplacements, Replacement } from './replacement';

function isAsync(node: ts.Node) {
    if (!node.modifiers) {
        return false;
    }
    return node.modifiers.some((modifier) => modifier.kind === ts.SyntaxKind.AsyncKeyword);
}

function asyncInsertionPos(node: ts.FunctionLikeDeclarationBase) {
    if (node.modifiers && node.modifiers[0]) {
        return node.modifiers[0].getEnd() + 1;
    }
    return node.getStart();
}

function rewriteFunctionBody(body: ts.ConciseBody, replacements: Replacement[]) {
    let found = false;
    function visitChild(node: ts.Node) {
        if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)
            && ts.isIdentifier(node.expression.name)
            && ['then'].indexOf(node.expression.name.text) >= 0) {
            if (node.arguments.length === 1) {
                const arg = node.arguments[0];
                if ((ts.isArrowFunction(arg) || ts.isFunctionDeclaration(arg) || ts.isFunctionDeclaration(arg))
                    && arg.body) {
                    const prefix = `const ${arg.parameters[0].getText()} = await `;
                    replacements.push(Replacement.insert(node.getStart(), prefix));
                    replacements.push(Replacement.delete(node.expression.expression.getEnd(), node.getEnd()));
                    replacements.push(Replacement.insert(node.getEnd(), ';\n' + arg.body.getText()));
                    found = true;
                } else {
                    replacements.push(Replacement.insert(node.getStart(), arg.getText() + '(await '));
                    replacements.push(Replacement.delete(node.expression.expression.getEnd(), node.getEnd()));
                    replacements.push(Replacement.insert(node.getEnd(), ')'));
                    found = true;
                }
            }
        }
        node.forEachChild(visitChild);
    }
    visitChild(body);
    return found;
}

function visit(node: ts.Node, replacements: Replacement[]) {
    if ((ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node) || ts.isArrowFunction(node))
        && node.body) {
        const rewritten = rewriteFunctionBody(node.body, replacements);
        if (rewritten && !isAsync(node)) {
            const insertionPos = asyncInsertionPos(node);
            replacements.push(Replacement.insert(insertionPos, 'async '));
        }
    }
    node.forEachChild((child) => visit(child, replacements));
}

export function transform(source: string) {
    const sourceFile = ts.createSourceFile('test.ts', source, ts.ScriptTarget.Latest, true);
    const replacements = [] as Replacement[];
    visit(sourceFile, replacements);
    return applyReplacements(source, replacements);
}
