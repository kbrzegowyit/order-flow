import { OrderItem } from "./OrderItem.js";

export class Order {
  constructor(
    public id: string,
    public items: OrderItem[],
    public totalPrice: number,
    public createdAt: Date,
  ) {}
}