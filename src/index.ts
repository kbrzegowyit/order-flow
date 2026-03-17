import { randomUUID } from "node:crypto";
import { CreateOrder } from "./application/usecases/CreateOrder.js";
import { OrderItem } from "./domain/entities/OrderItem.js";
import { FileOrderRepository } from "./infrastructure/repositories/FileOrderRepository.js";
import { ConsoleNotificationService } from "./infrastructure/notifications/ConsoleNotificationService.js";
import { PriceCalculator } from "./domain/services/PriceCalculator.js";
import { PayPalPaymentProcessor } from "./infrastructure/payments/PayPalPaymentProcessor.js";
import { PaymentProcessorResolver } from "./application/services/PaymentProcessorResolver.js";
import { PaymentMethod } from "./domain/value-objects/PaymentMethod.js";
import { PaymentProcessor } from "./application/ports/PaymentProcessor.js";
import { BlikPaymentProcessor } from "./infrastructure/payments/BlikPaymentProcessor.js";
import { CreateOrderItemDTO } from "./application/dtos/CreateOrderItemDTO.js";
import { CreateOrderDTO } from "./application/dtos/CreateOrderDTO.js";

const paypalPaymentProcessor = new PayPalPaymentProcessor();
const blikPaymentProcessor = new BlikPaymentProcessor();

const priceCalculator = new PriceCalculator();
const paymentProcessorResolver = new PaymentProcessorResolver(paypalPaymentProcessor, blikPaymentProcessor);
const fileOrderRepository = new FileOrderRepository();
const consoleNotification = new ConsoleNotificationService();

const orderItemDto1: CreateOrderItemDTO =  {
    productId: randomUUID(),
    name: "item1",
    quantity: 2,
    price: 10
};
const orderItemDto2: CreateOrderItemDTO = {
    productId: randomUUID(),
    name: "item2",
    quantity: 1,
    price: 20
};
const orderDto: CreateOrderDTO = {
    items: [orderItemDto1, orderItemDto2],
    paymentMethod: 'BLIK',
};

const createOrder = new CreateOrder(priceCalculator, paymentProcessorResolver, fileOrderRepository, consoleNotification);

createOrder.execute(orderDto)
    .then((createdOrder) => {
        console.log("Order created:", createdOrder.id);
    })
    .catch((error) => {
        console.error("Error creating order:", error);
    });