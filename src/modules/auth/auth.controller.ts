import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { successResponse } from 'src/common/utils/response.helper';
import { OtpVerifyDto } from '../otp/dto/otp-verify.dto';
import { OtpRequestDto } from '../otp/dto/otp-request.dto';
import { OtpType } from '../otp/type/otp-type';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './guards/jwt.guard';
import { SetNewPasswordDto } from './dto/set-new-password.dto';
import { GoogleOAuthGuard } from './guards/google.guard';

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

  @Post('reset-password')
  async resetPassword(@Body() dto: OtpRequestDto) {
    const result = await this.authService.resetPassword(dto);
    return successResponse('you will receive an OTP shortly.', result);
  }

  // @Post('verify-otp')
  // async verifyOtp(@Body() dto: OtpVerifyDto) {
  //   const result = await this.authService.verifyOtp(dto);
  //   return successResponse('Login successful', result);
  // }

  @Post('verify-login-otp')
  async verifyLoginOtp(@Body() dto: OtpVerifyDto) {
    const result = await this.authService.verifyOtp(dto, OtpType.OTP);
    return successResponse('Login successful', result);
  }

  @Post('verify-reset-password-otp')
  async verifyResetPasswordOtp(@Body() dto: OtpVerifyDto) {
    const result = await this.authService.verifyOtp(
      dto,
      OtpType.RESET_PASSWORD,
    );
    return successResponse(
      'OTP verified. You may now reset your password.',
      result,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('set-new-password')
  async setNewPassword(@Req() req, @Body() dto: SetNewPasswordDto) {
    await this.authService.setNewPassword(req.user.id, dto.newPassword);
    return successResponse('Password has been reset successfully');
  }

  @Get('google/login')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {
    // Guard redirects to Google
  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  async googleCallback(@Req() req, @Res() res) {
    try {
      const response = await this.authService.oauthLogin(req.user);

      res.redirect(
        `${process.env.FRONT_END_URL}?token=${response.accessToken}`,
      );
    } catch (error) {
      console.error('OAuth callback error:', error);
      res.redirect(`${process.env.FRONT_END_URL}?error=oauth_failed`);
    }
  }

  @Get('env')
  getEnv() {
    return this.authService.getEnvVariables();
  }
}
