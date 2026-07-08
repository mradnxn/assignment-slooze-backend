import { IsNotEmpty, IsNumber, IsArray, ValidateNested, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  menuItemId!: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1, { message: 'Quantity must be at least 1' })
  quantity!: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  restaurantId!: number;

  @IsNotEmpty()
  @IsString()
  paymentMethod!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[];
}
