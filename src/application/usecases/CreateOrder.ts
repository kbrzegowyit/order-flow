import { randomUUID } from "node:crypto";
import { Order } from "../../domain/entities/Order.js";
import { OrderItem } from "../../domain/entities/OrderItem.js";
import { OrderRepository } from "../../domain/repositories/OrderRepository.js";
import { NotificationService } from "../ports/NotificationService.js";
import { PriceCalculator } from "../../domain/services/PriceCalculator.js";

export class CreateOrder {
    constructor(
        private readonly priceCalculator: PriceCalculator,
        private readonly orderRepository: OrderRepository,
        private readonly notificationService: NotificationService,
    ) {}

    async execute(items: OrderItem[]): Promise<Order> {
        const totalPrice = this.priceCalculator.calculateTotalPrice(items);
        const order = new Order(
            randomUUID(),
            items,
            totalPrice,
            new Date()
        );

        await this.orderRepository.save(order);

        await this.notificationService.send(order.id);

        return order;
    }
}