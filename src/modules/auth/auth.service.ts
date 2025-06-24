import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { EmailService } from 'src/modules/email/email.service';
import { randomBytes } from 'crypto';
import { addMinutes } from 'date-fns';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { OtpType } from '../otp/type/otp-type';
import { OtpService } from '../otp/otp.service';
import { OtpVerifyDto } from '../otp/dto/otp-verify.dto';
import { MoreThan, Repository } from 'typeorm';
import { Otp } from '../otp/entities/otp.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { OtpRequestDto } from '../otp/dto/otp-request.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
    private readonly otpService: OtpService,
    @InjectRepository(Otp)
    private readonly otpRepo: Repository<Otp>,
  ) {}

  getEnvVariables() {
    return {
      port: this.configService.get<number>('port'),
      secret: this.configService.get<string>('secret'),
      database: {
        host: this.configService.get<string>('database.host'),
        port: this.configService.get<number>('database.port'),
        user: this.configService.get<string>('database.user'),
        pass: this.configService.get<string>('database.pass'),
        name: this.configService.get<string>('database.name'),
      },
      email: {
        host: this.configService.get<string>('email.host'),
        port: this.configService.get<number>('email.port'),
        user: this.configService.get<string>('email.user'),
        pass: this.configService.get<string>('email.pass'),
      },
      frontendUrl: this.configService.get<string>('frontendUrl'),
    };
  }

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);

    if (existingUser) {
      throw new BadRequestException('Email is already in use');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const token = randomBytes(32).toString('hex');

    const tokenExpires = addMinutes(new Date(), 30);

    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
      emailVerificationToken: token,
      emailVerificationTokenExpires: tokenExpires,
      isEmailVerified: false,
    });

    // Send activation email
    await this.emailService.sendActivationEmail(user.email, token);

    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    if (!user.isEmailVerified) {
      throw new UnauthorizedException(
        'Please verify your email before logging in.',
      );
    }

    const { otp, tempToken } = await this.otpService.generateOtp(
      user,
      6,
      OtpType.OTP,
    );

    await this.emailService.sendEmail({
      recipients: [user.email],
      subject: 'OTP for login verification',
      html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
    });

    return { tempToken };
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }

  async resetPassword(dto: OtpRequestDto) {
    const { email } = dto;

    const user = await this.usersService.findByEmail(email);

    let tempToken: string | null = null;

    if (user) {
      const { otp, tempToken: generatedTempToken } =
        await this.otpService.generateOtp(user, 6, OtpType.RESET_PASSWORD);

      tempToken = generatedTempToken;

      await this.emailService.sendEmail({
        recipients: [user.email],
        subject: 'OTP for password reset',
        html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
      });
    }
    return { tempToken };
  }

  async verifyEmail(token: string) {
    const user = await this.usersService.findByVerificationToken(token);
    if (!user)
      throw new BadRequestException('Invalid or expired verification token');

    if (user.emailVerificationTokenExpires < new Date()) {
      throw new BadRequestException('Verification token has expired');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpires = null;

    await this.usersService.save(user);

    // return { message: 'Email verified successfully. You can now log in.' };
  }

  async verifyOtp(dto: OtpVerifyDto, otpType: OtpType) {
    const { tempToken, otp } = dto;
    const otpRecord = await this.otpRepo.findOne({
      where: {
        tempToken,
        expiresAt: MoreThan(new Date()),
        type: otpType,
      },
      relations: ['user'],
    });

    if (!otpRecord) {
      await bcrypt.compare(otp, '$2b$10$kcf4893fh8948h93043g12345');
      throw new UnauthorizedException('Invalid or expired token.');
    }

    if (otpRecord.isLocked) {
      throw new ForbiddenException(
        'OTP is locked due to too many failed attempts.',
      );
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.token);
    if (!isMatch) {
      otpRecord.failedAttempts += 1;
      if (otpRecord.failedAttempts >= 5) {
        otpRecord.isLocked = true;
      }
      await this.otpRepo.save(otpRecord);
      throw new UnauthorizedException('Invalid otp.');
    }

    const user = await this.usersService.findById(otpRecord.user.id);

    await this.otpRepo.delete({ id: otpRecord.id });

    const { accessToken } = this.generateToken(user);

    return { accessToken, user };
  }

  async setNewPassword(userId: string, newPassword: string) {
    const user = await this.usersService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await this.usersService.save(user);
  }
}
