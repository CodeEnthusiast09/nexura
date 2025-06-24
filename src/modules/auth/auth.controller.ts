import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { successResponse } from 'src/common/utils/response.helper';
import { OtpVerifyDto } from '../otp/dto/otp-verify.dto';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(dto);
    return successResponse('Check your email to activate your account', result);
  }

  @Post('verify-email')
  async verifyEmail(@Body('token') token: string) {
    const result = await this.authService.verifyEmail(token);
    return successResponse(
      'Email verified successfully. You account has been activated',
      result,
    );
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return successResponse('OTP has been sent to your email', result);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() dto: OtpVerifyDto) {
    const result = await this.authService.verifyOtp(dto);
    return successResponse('Login successful', result);
  }

  @Get('env')
  getEnv() {
    return this.authService.getEnvVariables();
  }
}
