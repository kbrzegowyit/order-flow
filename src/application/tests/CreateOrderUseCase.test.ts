import { OrderRepository } from "../../domain/repositories/OrderRepository";
import { PriceCalculator } from "../../domain/services/PriceCalculator";
import { BlikPaymentProcessor } from "../../infrastructure/payments/BlikPaymentProcessor";
import { PayPalPaymentProcessor } from "../../infrastructure/payments/PayPalPaymentProcessor";
import { CreateOrderDTO } from "../dtos/CreateOrderDTO";
import { NotificationService } from "../ports/NotificationService";
import { PaymentProcessorResolver } from "../services/PaymentProcessorResolver";
import { CreateOrder } from "../usecases/CreateOrder";

describe('CreateOrderUseCase', () => {
  let priceCalculatorMock: PriceCalculator;
  let payPalProcessorMock: PayPalPaymentProcessor;
  let blikProcessorMock: BlikPaymentProcessor;
  let paymentProcessorResolverMock: PaymentProcessorResolver;
  let orderRepositoryMock: OrderRepository;
  let notificationServiceMock: NotificationService;
  let createOrderUseCase: CreateOrder;

  let validInput: CreateOrderDTO = {
    items: [
      { productId: 'prod-1', name: 'Product 1', quantity: 2, price: 10 },
      { productId: 'prod-2', name: 'Product 2', quantity: 1, price: 20 }
    ],
    paymentMethod: 'PayPal'
  };

  beforeEach(() => {
    priceCalculatorMock = {
      calculateTotalPrice: jest.fn(),
    } as jest.Mocked<PriceCalculator>;

    payPalProcessorMock = {
      pay: jest.fn(),
    } as jest.Mocked<PayPalPaymentProcessor>;

    blikProcessorMock = {
      pay: jest.fn(),
    } as jest.Mocked<BlikPaymentProcessor>;

    paymentProcessorResolverMock = new PaymentProcessorResolver(payPalProcessorMock, blikProcessorMock);

    orderRepositoryMock = {
      save: jest.fn(),
    } as jest.Mocked<OrderRepository>;

    notificationServiceMock = {
      send: jest.fn(),
    } as jest.Mocked<NotificationService>;

    createOrderUseCase = new CreateOrder(
      priceCalculatorMock,
      paymentProcessorResolverMock,
      orderRepositoryMock,
      notificationServiceMock
    );
  });

  it('should create an order successfully', async () => {
    const result = await createOrderUseCase.execute(validInput);
    
    expect(priceCalculatorMock.calculateTotalPrice).toHaveBeenCalledWith(validInput.items);
    expect(payPalProcessorMock.pay).toHaveBeenCalled();
    expect(orderRepositoryMock.save).toHaveBeenCalled();
    expect(notificationServiceMock.send).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('should throw an error if payment processor is not found', async () => {
    const invalidInput = { ...validInput, paymentMethod: 'InvalidMethod' as any };
    
    await expect(createOrderUseCase.execute(invalidInput)).rejects.toThrow('Payment processor for method InvalidMethod not found');
  });
});