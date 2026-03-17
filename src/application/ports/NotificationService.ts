export interface NotificationService {
    send(orderId: string): Promise<void>;
}