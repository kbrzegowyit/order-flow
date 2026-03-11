export class PriceCalculator {
    calculateTotalPrice(items: { price: number; quantity: number }[]): number {
        return items.reduce((total, item) => total + item.price * item.quantity, 0);
    }
}