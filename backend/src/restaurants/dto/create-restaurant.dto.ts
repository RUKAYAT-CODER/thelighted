import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  MaxLength,
  ValidateNested,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PriceRange } from '../entities/restaurant.entity';

class AddressDto {
  @IsString()
  @IsNotEmpty()
  street: string;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsString()
  @IsNotEmpty()
  state: string;

  @IsString()
  @IsNotEmpty()
  zip: string;

  @IsString()
  @IsNotEmpty()
  country: string;
}

export class CreateRestaurantDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(1000)
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  cuisineType?: string;

  @ValidateNested()
  @Type(() => AddressDto)
  address: AddressDto;

  @IsString()
  @MinLength(10)
  @MaxLength(20)
  phone: string;

  @IsEmail()
  email: string;

  @IsEnum(PriceRange)
  @IsOptional()
  priceRange?: PriceRange;

  @IsString()
  @IsOptional()
  logo?: string;

  @IsString()
  @IsOptional()
  coverImage?: string;
}
