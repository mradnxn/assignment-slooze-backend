import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { TenancyGuard } from '../auth/tenancy.guard';
import { Roles } from '../auth/roles.decorator';
import { CheckTenancy } from '../auth/tenancy.decorator';

@UseGuards(AuthGuard, RolesGuard, TenancyGuard)
@Roles('ADMIN', 'MANAGER', 'MEMBER')
@Controller('restaurants')
export class RestaurantsController {
  constructor(private readonly restaurantsService: RestaurantsService) {}

  @Get()
  @CheckTenancy('listRestaurants')
  findAll(@Query('country') country?: string) {
    return this.restaurantsService.findAll(country);
  }

  @Get(':id')
  @CheckTenancy('restaurant')
  findOne(@Param('id') id: string) {
    return this.restaurantsService.findOne(+id);
  }

  @Get(':id/menu')
  @CheckTenancy('restaurant')
  findMenu(@Param('id') id: string) {
    return this.restaurantsService.findMenu(+id);
  }
}
