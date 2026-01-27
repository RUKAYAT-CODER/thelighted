import { IsArray, IsUUID, IsEnum, IsObject, IsOptional } from 'class-validator';

export class BulkOperationDto {
  @IsArray()
  @IsUUID('4', { each: true })
  itemIds: string[];

  @IsEnum(['UPDATE_STATUS', 'UPDATE_PRICE', 'UPDATE_CATEGORY', 'DELETE'])
  operation: string;

  @IsObject()
  @IsOptional()
  operationData?: any;
}
