import { PriceCalculator } from "../PriceCalculator";

describe('PriceCalculator', () => {
    let priceCalculator: PriceCalculator;

    beforeEach(() => {
        priceCalculator = new PriceCalculator();
    });

    it('should calculate total price correctly', () => {
        const items = [
            { price: 10, quantity: 2 },
            { price: 5, quantity: 3 },
            { price: 20, quantity: 1 }
        ];
        const totalPrice = priceCalculator.calculateTotalPrice(items);
        expect(totalPrice).toBe(10 * 2 + 5 * 3 + 20 * 1);
    });

    it('should return 0 for an empty list of items', () => {
        const items: { price: number; quantity: number }[] = [];
        const totalPrice = priceCalculator.calculateTotalPrice(items);
        expect(totalPrice).toBe(0);
    });

    it('should handle items with zero quantity', () => {
        const items = [
            { price: 10, quantity: 0 },
            { price: 5, quantity: 3 }
        ];
        const totalPrice = priceCalculator.calculateTotalPrice(items);
        expect(totalPrice).toBe(5 * 3);
    });

    it('should handle items with zero price', () => {
        const items = [
            { price: 0, quantity: 2 },
            { price: 5, quantity: 3 }
        ];
        const totalPrice = priceCalculator.calculateTotalPrice(items);
        expect(totalPrice).toBe(5 * 3);
    });
});