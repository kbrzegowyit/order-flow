import { writeFile } from "node:fs/promises";
import { OrderRepository } from "../../domain/repositories/OrderRepository.js";
import { Order } from "../../domain/entities/Order.js";

export class FileOrderRepository implements OrderRepository {
    async save(order: Order): Promise<void> {
        try {
            if (!order) {
                throw new Error("Order cannot be null or undefined");
            }
            const filePath = `orders/${order.id}.json`;
            await writeFile(filePath, JSON.stringify(order, null, 2), "utf-8");
        } catch (error) {
            console.error("Error saving order:", error);
            throw error;
        }
    }
}