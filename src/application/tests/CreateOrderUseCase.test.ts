import { OrderRepository } from "../../domain/repositories/OrderRepository";
import { CreateOrderDTO } from "../dtos/CreateOrderDTO";
import { NotificationService } from "../ports/NotificationService";
import { PaymentProcessor } from "../ports/PaymentProcessor";
import { PaymentProcessorRegistry } from "../ports/PaymentProcessorRegistry";
import { CreateOrder } from "../usecases/CreateOrder";

describe('CreateOrderUseCase', () => {
  let paymentProcessorRegistryMock: jest.Mocked<PaymentProcessorRegistry>;
  let paymentProcessorMock: jest.Mocked<PaymentProcessor>;
  let orderRepositoryMock: jest.Mocked<OrderRepository>;
  let notificationServiceMock: jest.Mocked<NotificationService>;
  let createOrderUseCase: CreateOrder;

  const validInput: CreateOrderDTO = {
    items: [
      { productId: 'prod-1', name: 'Product 1', quantity: 2, price: 10 },
      { productId: 'prod-2', name: 'Product 2', quantity: 1, price: 20 }
    ],
    paymentMethod: 'PayPal'
  };

  beforeEach(() => {
    paymentProcessorMock = {
      pay: jest.fn().mockResolvedValue(undefined),
    } as jest.Mocked<PaymentProcessor>;

    paymentProcessorRegistryMock = {
      getPaymentProcessor: jest.fn().mockReturnValue(paymentProcessorMock),
    } as jest.Mocked<PaymentProcessorRegistry>;

    orderRepositoryMock = {
      save: jest.fn(),
    } as jest.Mocked<OrderRepository>;

    notificationServiceMock = {
      send: jest.fn(),
    } as jest.Mocked<NotificationService>;

    createOrderUseCase = new CreateOrder(
      paymentProcessorRegistryMock,
      orderRepositoryMock,
      notificationServiceMock
    );
  });

  it('should create an order successfully', async () => {
    const result = await createOrderUseCase.execute(validInput);

    expect(paymentProcessorRegistryMock.getPaymentProcessor).toHaveBeenCalledWith(validInput.paymentMethod);
    expect(paymentProcessorMock.pay).toHaveBeenCalled();
    expect(orderRepositoryMock.save).toHaveBeenCalled();
    expect(notificationServiceMock.send).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should throw an error if payment processor is not found', async () => {
    const invalidInput = { ...validInput, paymentMethod: 'InvalidMethod' as any };

    paymentProcessorRegistryMock.getPaymentProcessor.mockImplementation(() => {
      throw new Error('Payment processor for method InvalidMethod not found');
    });

    await expect(createOrderUseCase.execute(invalidInput)).rejects.toThrow('Payment processor for method InvalidMethod not found');
  });
});