import * as ts from 'typescript';

export function transform(source: string) {
    const sourceFile = ts.createSourceFile('test.ts', source, ts.ScriptTarget.Latest, true);
    const printer = ts.createPrinter({ removeComments: false });
    return printer.printFile(sourceFile);
}
