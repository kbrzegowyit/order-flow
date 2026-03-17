export class OrderItem {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly quantity: number,
        public readonly price: number
    ) {
        if (quantity <= 0) {
            throw new Error("Quantity must be greater than 0");
        }
        if (price < 0) {
            throw new Error("Price cannot be negative");
        }
        if (!name) {
            throw new Error("Name cannot be empty");
        }
    }

    public subtotal(): number {
        return this.quantity * this.price;
    }
}