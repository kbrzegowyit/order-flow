import { PaymentMethod } from "../../domain/value-objects/PaymentMethod.js";
import { CreateOrderItemDTO } from "./CreateOrderItemDTO.js";

export interface CreateOrderDTO {
    items: CreateOrderItemDTO[];
    paymentMethod: PaymentMethod;
}