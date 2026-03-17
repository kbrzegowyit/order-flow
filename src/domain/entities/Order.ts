import { OrderItem } from "./OrderItem.js";

export class Order {
  constructor(
    public readonly id: string,
    public readonly items: OrderItem[],
    public readonly createdAt: Date,
  ) {
    if (items.length === 0) {
      throw new Error("Order must have at least one item");
    }
  }

  public totalPrice(): number {
    return this.items.reduce((total, item) => total + item.subtotal(), 0);
  }
}