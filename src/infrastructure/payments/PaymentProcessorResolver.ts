import { PaymentProcessor } from "../../application/ports/PaymentProcessor.js";
import { PaymentProcessorRegistry } from "../../application/ports/PaymentProcessorRegistry.js";
import { PaymentMethod } from "../../domain/value-objects/PaymentMethod.js";
import { BlikPaymentProcessor } from "./BlikPaymentProcessor.js";
import { PayPalPaymentProcessor } from "./PayPalPaymentProcessor.js";

export class PaymentProcessorResolver implements PaymentProcessorRegistry {
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

    public getPaymentProcessor(method: PaymentMethod): PaymentProcessor {
        const processor = this.processors[method];
        if (!processor) {
            throw new Error(`Payment processor for method ${method} not found`);
        }
        return processor;
    }
}