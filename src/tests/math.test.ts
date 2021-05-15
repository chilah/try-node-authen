import { calculateTips } from '../math';

test('calculate total with tips', () => {
    const total = calculateTips(2, 5);
    expect(total).toBe(10);
});
