import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { MakePaymentDto } from './dto/make-payment.dto';
import { AuthenticatedGuard } from 'src/auth/guards/authenticated.guard';
import { ApiOkResponse } from '@nestjs/swagger';
import { MakePaymentResponse } from './types';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOkResponse({ type: MakePaymentResponse })
  @UseGuards(AuthenticatedGuard)
  @Post()
  async makePayment(@Body() makePaymentDto: MakePaymentDto) {
    console.log('makePaymentDto: ', makePaymentDto);
    return this.paymentService.makePayment(makePaymentDto);
  }
}
