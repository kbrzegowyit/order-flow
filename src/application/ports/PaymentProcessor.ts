export interface PaymentProcessor {
    pay(amount: number): Promise<void>;
}