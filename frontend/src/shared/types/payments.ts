import { PaymentMethod, PaymentStatus } from './orders';

export type PaymentDetails = {
  paymentId: number;
  orderId: number;
  paymentMethod: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  transactionRef: string | null;
  paidAt: string | null;
  createdAt: string;
};

export type PayByCardRequest = {
  cardHolderName: string;
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
};
