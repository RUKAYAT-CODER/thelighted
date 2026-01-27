import {
  IsUUID,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsNumber,
  Min,
  Max,
  IsArray,
  IsEnum,
  IsObject,
} from 'class-validator';
import { MenuItemStatus, SpiceLevel } from '../entities/menu-item.entity';

export class CreateMenuItemDto {
  @IsUUID()
  categoryId: string;

  @IsString()
  @MinLength(2)
  @MaxLength(200)
  name: string;

  @IsString()
  @MaxLength(1000)
  description: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  shortDescription?: string;

  @IsNumber()
  @Min(0.01)
  @Max(99999.99)
  basePrice: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsEnum(MenuItemStatus)
  @IsOptional()
  status?: MenuItemStatus;

  @IsNumber()
  @IsOptional()
  preparationTime?: number;

  @IsArray()
  @IsOptional()
  dietaryTags?: string[];

  @IsArray()
  @IsOptional()
  allergens?: string[];

  @IsEnum(SpiceLevel)
  @IsOptional()
  spiceLevel?: SpiceLevel;

  @IsArray()
  @IsOptional()
  moodTags?: string[];

  @IsObject()
  @IsOptional()
  nutritionalInfo?: object;

  @IsArray()
  @IsOptional()
  ingredients?: string[];
}
