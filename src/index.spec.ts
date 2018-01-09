import { transform } from './index';

describe('async-to-promise', () => {
    it('should preserve comments in the source code', () => {
        expect(transform('/* awesome */ function foo() { }').trim())
            .toBe('/* awesome */ function foo() { }');
    });
});
