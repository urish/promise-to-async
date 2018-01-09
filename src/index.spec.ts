import { transform } from './index';

describe('async-to-promise', () => {
    describe('async keyword insertion', () => {
        it('should insert the `async` keyword before function declarations', () => {
            expect(transform('/* awesome */ function foo() { }').trim())
                .toBe('/* awesome */ async function foo() { }');
        });

        it('should insert the `async` keyword before arrow functions', () => {
            expect(transform('const foo = () => 0').trim())
                .toBe('const foo = async () => 0');
        });

        it('should properly apply multiple insertions', () => {
            expect(transform('const foo = () => 0, bar = () => 1').trim())
                .toBe('const foo = async () => 0, bar = async () => 1');
        });

        it('should insert the `async` keyword before private class methods', () => {
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
                        bar.then(console.log);
                    }
                }
            `;
            expect(transform(input)).toBe(output);
        });

        it('should not modify a function which is already async', () => {
            expect(transform('/* awesome */ async function foo() { }').trim())
                .toBe('/* awesome */ async function foo() { }');
        });
    });
});
