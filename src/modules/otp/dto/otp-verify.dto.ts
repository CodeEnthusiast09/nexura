import { IsEmail, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { OtpType } from '../type/otp-type';

export class OtpVerifyDto {
  @IsUUID()
  tempToken: string;

  @IsNotEmpty()
  otp: string;

  @IsString()
  type: OtpType
}
