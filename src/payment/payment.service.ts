import { ForbiddenException, Injectable } from '@nestjs/common';
import { MakePaymentDto } from './dto/make-payment.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  constructor(private configService: ConfigService) {}

  async makePayment(makePaymentDto: MakePaymentDto) {
    console.log('makePayment:', makePaymentDto);
    try {
      const { data } = await axios({
        method: 'POST',
        url: 'https://api.yookassa.ru/v3/payments',
        headers: {
          'Content-Type': 'application/json',
          'Idempotence-Key': Date.now(),
        },
        auth: {
          username: '1230235',
          password: this.configService.get('PAYMENT_KEY') as string,
        },
        data: {
          amount: {
            value: makePaymentDto.amount,
            currency: 'RUB',
          },
          capture: true,
          confirmation: {
            type: 'redirect',
            return_url: 'http://localhost:3000/order',
          },
          description: 'Заказ №1',
        },
      });

      console.log('data: ', data);

      return data;
    } catch (error) {
      console.log('error: ', error);
      throw new ForbiddenException(error);
    }
  }
}
