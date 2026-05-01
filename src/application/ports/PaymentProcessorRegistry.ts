import { PaymentProcessor } from "./PaymentProcessor";

export interface PaymentProcessorRegistry {
    getPaymentProcessor(name: string): PaymentProcessor;
}