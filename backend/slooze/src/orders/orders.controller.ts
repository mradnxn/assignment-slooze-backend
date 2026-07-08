import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { TenancyGuard } from '../auth/tenancy.guard';
import { Roles } from '../auth/roles.decorator';
import { CheckTenancy } from '../auth/tenancy.decorator';

@UseGuards(AuthGuard, RolesGuard, TenancyGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles('ADMIN', 'MANAGER', 'MEMBER')
  @CheckTenancy('bodyRestaurant')
  create(@Request() req: any, @Body() createOrderDto: CreateOrderDto) {
    const userId = req.user.sub;
    return this.ordersService.create(userId, createOrderDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id/checkout')
  @Roles('ADMIN', 'MANAGER')
  @CheckTenancy('order')
  checkout(@Param('id') id: string) {
    return this.ordersService.checkout(+id);
  }

  @HttpCode(HttpStatus.OK)
  @Post(':id/cancel')
  @Roles('ADMIN', 'MANAGER')
  @CheckTenancy('order')
  cancel(@Param('id') id: string) {
    return this.ordersService.cancel(+id);
  }

  @Patch(':id/payment-method')
  @Roles('ADMIN')
  @CheckTenancy('order')
  updatePaymentMethod(
    @Param('id') id: string,
    @Body() updatePaymentMethodDto: UpdatePaymentMethodDto,
  ) {
    return this.ordersService.updatePaymentMethod(+id, updatePaymentMethodDto.paymentMethod);
  }

  @Get()
  @Roles('ADMIN', 'MANAGER', 'MEMBER')
  @CheckTenancy('list')
  findAll(
    @Request() req: any,
    @Query('country') country?: string,
    @Query('userId') queryUserId?: string,
  ) {
    const user = req.user;
    let userId = queryUserId ? +queryUserId : undefined;

    userId = user.sub;

    return this.ordersService.findAll(country, userId);
  }

  @Get(':id')
  @Roles('ADMIN', 'MANAGER', 'MEMBER')
  @CheckTenancy('order')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }
}
