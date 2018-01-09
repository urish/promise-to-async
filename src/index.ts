import * as ts from 'typescript';

class Replacement {
    constructor(readonly start: number, readonly end: number, readonly text = '') {
    }
}

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

function visit(node: ts.Node, replacements: Replacement[]) {
    if ((ts.isFunctionDeclaration(node) || ts.isMethodDeclaration(node) || ts.isArrowFunction(node)) &&
        !isAsync(node)) {
        const insertionPos = asyncInsertionPos(node);
        replacements.push(new Replacement(insertionPos, insertionPos, 'async '));
    }
    node.forEachChild((child) => visit(child, replacements));
}

function applyReplacements(source: string, replacements: Replacement[]) {
    replacements = replacements.sort((r1, r2) => r2.end - r1.end);
    for (const replacement of replacements) {
        source = source.slice(0, replacement.start) + replacement.text + source.slice(replacement.end);
    }
    return source;
}

export function transform(source: string) {
    const sourceFile = ts.createSourceFile('test.ts', source, ts.ScriptTarget.Latest, true);
    const replacements = [] as Replacement[];
    visit(sourceFile, replacements);
    return applyReplacements(source, replacements);
}
