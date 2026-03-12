import { PaymentMethod } from "../../domain/value-objects/PaymentMethod.js";
import { PaymentProcessor } from "../ports/PaymentProcessor.js";

export class PaymentProcessorResolver {
    constructor(private processors: Record<PaymentMethod, PaymentProcessor>) {}

    resolve(method: PaymentMethod): PaymentProcessor {
        const processor = this.processors[method];
        if (!processor) {
            throw new Error(`Payment processor for method ${method} not found`);
        }
        return processor;
    }
}