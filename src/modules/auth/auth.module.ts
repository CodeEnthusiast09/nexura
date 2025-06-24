import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWTStrategy } from './strategies/jwt.strategy';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { authConstants } from './constants/auth.constants';
import { EmailService } from '../email/email.service';
import { EmailModule } from '../email/email.module';
import { OtpModule } from '../otp/otp.module';
import { OtpService } from '../otp/otp.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from '../otp/entities/otp.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Otp]),
    UsersModule,
    OtpModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('secret'),
        signOptions: {
          expiresIn: '1h',
        },
      }),
      inject: [ConfigService],
    }),
    // JwtModule.register({
    //   secret: authConstants.secret,
    //   signOptions: {
    //     expiresIn: '1d',
    //   },
    // }),
    PassportModule,
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy],
})
export class AuthModule {}
