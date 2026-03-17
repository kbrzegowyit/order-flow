import { randomUUID } from "node:crypto";
import { Order } from "../../domain/entities/Order";
import { OrderItem } from "../../domain/entities/OrderItem";
import { OrderRepository } from "../../domain/repositories/OrderRepository";
import { NotificationService } from "../ports/NotificationService";
import { PriceCalculator } from "../../domain/services/PriceCalculator";
import { PaymentProcessorResolver } from "../services/PaymentProcessorResolver";
import { CreateOrderDTO } from "../dtos/CreateOrderDTO";

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