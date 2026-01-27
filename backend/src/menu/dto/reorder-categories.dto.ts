import { Type } from 'class-transformer';
import { IsArray, ValidateNested, IsUUID, IsNumber } from 'class-validator';

export class ReorderCategoriesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CategoryOrderDto)
  categories: CategoryOrderDto[];
}

class CategoryOrderDto {
  @IsUUID()
  categoryId: string;

  @IsNumber()
  displayOrder: number;
}
