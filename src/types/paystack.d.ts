/* Type declarations for packages without built-in TypeScript types */

declare module "@paystack/inline-js" {
  interface PaystackTransactionConfig {
    key: string;
    email: string;
    amount: number;
    currency?: string;
    ref?: string;
    metadata?: Record<string, unknown>;
    channels?: string[];
    onSuccess: (transaction: { reference: string; [key: string]: unknown }) => void;
    onCancel: () => void;
  }

  export default class PaystackPop {
    newTransaction(config: PaystackTransactionConfig): void;
  }
}
