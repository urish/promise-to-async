import { transform } from './index';

describe('async-to-promise', () => {
    describe('transforming then() with function name', () => {
        it('should transform standard functions', () => {
            expect(transform('/* awesome */ function foo() { Promise.resolve(1).then(console.log);}').trim())
                .toBe('/* awesome */ async function foo() { console.log(await Promise.resolve(1));}');
        });

        it('should transform arrow functions', () => {
            expect(transform('const foo = (p) => p.then(bar)').trim())
                .toBe('const foo = async (p) => bar(await p)');
        });

        it('should transform class methods', () => {
            const input = `
                class Test {
                    private foo(bar) {
                        bar.then(console.log);
                    }
                }
            `;
            const output = `
                class Test {
                    private async foo(bar) {
                        console.log(await bar);
                    }
                }
            `;
            expect(transform(input)).toBe(output);
        });

        it("should not add `async` keyword if it's already there", () => {
            expect(transform('async function foo() { Promise.resolve(1).then(console.log);}').trim())
                .toBe('async function foo() { console.log(await Promise.resolve(1));}');
        });

        it('should not modify a function without `then` calls', () => {
            expect(transform('function foo() { console.log(5) }').trim())
                .toBe('function foo() { console.log(5) }');
        });
    });
});
