import { PaymentProcessor } from "../../application/ports/PaymentProcessor.js";
import { PaymentProcessorRegistry } from "../../application/ports/PaymentProcessorRegistry.js";
import { PaymentMethod } from "../../domain/value-objects/PaymentMethod.js";

export class PaymentProcessorResolver implements PaymentProcessorRegistry {
    constructor(private readonly processors: Record<PaymentMethod, PaymentProcessor>) {}

    public getPaymentProcessor(method: PaymentMethod): PaymentProcessor {
        const processor = this.processors[method];
        if (!processor) {
            throw new Error(`Payment processor for method ${method} not found`);
        }
        return processor;
    }
}