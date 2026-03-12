import { randomUUID } from "node:crypto";
import { Order } from "../../domain/entities/Order.js";
import { OrderItem } from "../../domain/entities/OrderItem.js";
import { OrderRepository } from "../../domain/repositories/OrderRepository.js";
import { NotificationService } from "../ports/NotificationService.js";
import { PriceCalculator } from "../../domain/services/PriceCalculator.js";
import { PaymentProcessor } from "../ports/PaymentProcessor.js";
import { PaymentProcessorResolver } from "../services/PaymentProcessorResolver.js";
import { CreateOrderDTO } from "../dtos/CreateOrderDTO.js";

export class CreateOrder {
    constructor(
        private readonly priceCalculator: PriceCalculator,
        private readonly paymentProcessorResolver: PaymentProcessorResolver,
        private readonly orderRepository: OrderRepository,
        private readonly notificationService: NotificationService,
    ) {}

    async execute(input: CreateOrderDTO): Promise<Order> {
        const items = input.items.map(item => new OrderItem(
            item.productId,
            item.name,
            item.quantity,
            item.price
        ));
        const totalPrice = this.priceCalculator.calculateTotalPrice(input.items);
        const order = new Order(
            randomUUID(),
            items,
            totalPrice,
            new Date()
        );

        const paymentProcessor = this.paymentProcessorResolver.resolve(input.paymentMethod);
        await paymentProcessor.pay(totalPrice);

        await this.orderRepository.save(order);

        await this.notificationService.send(order.id);

        return order;
    }
}