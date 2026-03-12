import { PaymentProcessor } from "../../application/ports/PaymentProcessor.js";

export class BlikPaymentProcessor implements PaymentProcessor {
    async pay(amount: number): Promise<void> {
        console.log(`[BLIK] Processing BLIK payment of $${amount.toFixed(2)}...`);
    }
}