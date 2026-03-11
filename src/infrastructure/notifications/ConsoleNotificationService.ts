import { NotificationService } from "../../application/ports/NotificationService.js";

export class ConsoleNotificationService implements NotificationService {
    async send(orderId: string): Promise<void> {
        console.log(`Order created with ID: ${orderId}`);
    }
}