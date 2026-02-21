// backend/src/modules/admin/create-user.dto.ts (NEW FILE)
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsEnum,
} from 'class-validator';
import { AdminRole } from '../auth/admin-user.entity';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsEnum(AdminRole)
  role: AdminRole;
}
