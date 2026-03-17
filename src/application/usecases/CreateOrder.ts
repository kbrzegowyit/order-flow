import { randomUUID } from "node:crypto";
import { Order } from "../../domain/entities/Order";
import { OrderItem } from "../../domain/entities/OrderItem";
import { OrderRepository } from "../../domain/repositories/OrderRepository";
import { NotificationService } from "../ports/NotificationService";
import { PriceCalculator } from "../../domain/services/PriceCalculator";
import { CreateOrderDTO } from "../dtos/CreateOrderDTO";
import { PaymentProcessorRegistry } from "../ports/PaymentProcessorRegistry";

export class CreateOrder {
    constructor(
        private readonly paymentProcessorRegistry: PaymentProcessorRegistry,
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
        const order = new Order(
            randomUUID(),
            items,
            new Date()
        );

        const paymentProcessor = this.paymentProcessorRegistry.getPaymentProcessor(input.paymentMethod);
        await paymentProcessor.pay(order.totalPrice());

        await this.orderRepository.save(order);

        await this.notificationService.send(order.id);

        return order;
    }
}