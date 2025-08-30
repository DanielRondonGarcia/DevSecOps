const sum = require('../src/index');

describe('sum', () => {
    it('should return 3 when given 1 and 2', () => {
        expect(sum(1, 2)).toBe(3);
    });
});