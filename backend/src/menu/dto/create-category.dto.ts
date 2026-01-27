import {
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsNumber,
} from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(1000)
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  displayOrder?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
