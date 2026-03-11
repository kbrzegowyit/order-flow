import { randomUUID } from "node:crypto";
import { CreateOrder } from "./application/usecases/CreateOrder.js";
import { OrderItem } from "./domain/entities/OrderItem.js";
import { FileOrderRepository } from "./infrastructure/repositories/FileOrderRepository.js";
import { ConsoleNotificationService } from "./infrastructure/notifications/ConsoleNotificationService.js";
import { PriceCalculator } from "./domain/services/PriceCalculator.js";

const priceCalculator = new PriceCalculator();
const fileOrderRepository = new FileOrderRepository();
const consoleNotification = new ConsoleNotificationService();

const orderItem = new OrderItem(randomUUID(), "item1", 2, 10);
const orderItem2 = new OrderItem(randomUUID(), "item2", 1, 20);

const createOrder = new CreateOrder(priceCalculator, fileOrderRepository, consoleNotification);
createOrder.execute([orderItem, orderItem2])
    .then((createdOrder) => {
        console.log("Order created:", createdOrder);
    })
    .catch((error) => {
        console.error("Error creating order:", error);
    });