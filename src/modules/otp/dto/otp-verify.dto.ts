import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

export class OtpVerifyDto {
  @IsUUID()
  tempToken: string;

  @IsNotEmpty()
  otp: string;
}
