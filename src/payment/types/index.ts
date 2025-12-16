import { inheritPropertyInitializers } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class MakePaymentResponse {
  @ApiProperty({ example: '30d37441-000f-5000-b000-1a365f417d3a' })
  id: string;

  @ApiProperty({ example: 'pending' })
  status: string;

  @ApiProperty({ example: { value: 100, currency: 'RUB' } })
  amount: {
    value: number;
    currency: string;
  };

  @ApiProperty({ example: 'Заказ №1' })
  description: string;

  @ApiProperty({
    example: {
      type: 'redirect',
      confirmation_url:
        'https://yoomoney.ru/checkout/payments/v2/contract?orderId=30d37441-000f-5000-b000-1a365f417d3a',
    },
  })
  confirmation: {
    type: string;
    confirmation_url: string;
  };

  @ApiProperty({ example: { account_id: '1230235', gateway_id: '2606201' } })
  recipient: {
    account_id: string;
    gateway_id: string;
  };

  @ApiProperty({ example: true })
  test: boolean;

  @ApiProperty({ example: true })
  paid: boolean;

  @ApiProperty({ example: true })
  refundable: boolean;

  @ApiProperty({ example: {} })
  metadata: {};
}
