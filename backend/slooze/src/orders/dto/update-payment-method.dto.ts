import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePaymentMethodDto {
  @IsNotEmpty()
  @IsString()
  paymentMethod!: string;
}
