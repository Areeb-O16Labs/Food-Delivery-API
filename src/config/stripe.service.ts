import { Injectable } from '@nestjs/common';
import { getConfigVar } from 'src/utils/config';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  stripe = new Stripe(getConfigVar('STRIPE_API_KEY'));

  async createCustomer(params: Stripe.CustomerCreateParams) {
    return await this.stripe.customers.create(params);
  }

  async createCard(customerId: string, source: string) {
    return await this.stripe.customers.createSource(customerId, {
      source,
    });
  }

  async createConnect(code: string) {
    return await this.stripe.oauth.token({
      grant_type: 'authorization_code',
      code,
    });
  }

  public async calculatePaymentDetails(amount: number) {
    const subtotalAmount = parseFloat(amount.toFixed(2));

    // Calculate the transaction fee shown to the buyer (not the actual fee)
    const processingFee = parseFloat((subtotalAmount * 0.029 + 0.3).toFixed(2));

    // Calculate the total amount charged to the buyer on buyer (including transaction fee)
    const totalAmountChargedToBuyer = parseFloat(
      (subtotalAmount + processingFee).toFixed(2),
    );
    return { subtotalAmount, processingFee, totalAmountChargedToBuyer };
  }
}
