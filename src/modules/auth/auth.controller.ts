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

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const result = await this.authService.register(dto);
    return successResponse('User registered successfully', result);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const result = await this.authService.login(dto);
    return successResponse('Login successful', result);
  }

  @Post('verify-email')
  async verifyEmail(@Body('token') token: string) {
    const result = await this.authService.verifyEmail(token);
    return successResponse('Email verified successfully', result);
  }

  @Get('env')
  getEnv() {
    return this.authService.getEnvVariables();
  }
}
