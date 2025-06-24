import { IsString, MinLength } from 'class-validator';

export class SetNewPasswordDto {
  @IsString()
  newPassword: string;
}
