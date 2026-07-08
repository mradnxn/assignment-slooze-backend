import { SetMetadata } from '@nestjs/common';
import { TenancyResourceType } from '../types';

export const CheckTenancy = (resourceType: TenancyResourceType) =>
  SetMetadata('tenancyResourceType', resourceType);
