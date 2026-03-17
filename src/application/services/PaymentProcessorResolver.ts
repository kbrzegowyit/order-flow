import { PaymentMethod } from "../../domain/value-objects/PaymentMethod.js";
import { BlikPaymentProcessor } from "../../infrastructure/payments/BlikPaymentProcessor.js";
import { PayPalPaymentProcessor } from "../../infrastructure/payments/PayPalPaymentProcessor.js";
import { PaymentProcessor } from "../ports/PaymentProcessor.js";

export class PaymentProcessorResolver {
    private processors: Record<PaymentMethod, PaymentProcessor>

    constructor(
        paypalPaymentProcessor: PayPalPaymentProcessor,
        blikPaymentProcessor: BlikPaymentProcessor,
    ) {
        this.processors = {
            PayPal: paypalPaymentProcessor,
            BLIK: blikPaymentProcessor,
        };
    }

    public resolve(method: PaymentMethod): PaymentProcessor {
        const processor = this.processors[method];
        if (!processor) {
            throw new Error(`Payment processor for method ${method} not found`);
        }
        return processor;
    }
}