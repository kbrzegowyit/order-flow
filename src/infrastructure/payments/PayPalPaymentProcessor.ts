import { PaymentProcessor } from "../../application/ports/PaymentProcessor.js";

export class PayPalPaymentProcessor implements PaymentProcessor {
    async pay(amount: number): Promise<void> {
        console.log(`[PayPal] Processing PayPal payment of $${amount.toFixed(2)}...`);
    }
}