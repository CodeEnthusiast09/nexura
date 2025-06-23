import {
  BadRequestException,
  Injectable,
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

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly configService: ConfigService,
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

    const verifyUrl = `http://localhost:3001/verify-email?token=${token}`;
    const html = `<p>Click <a href="${verifyUrl}">here</a> to verify your email.</p>`;

    // Send activation email
    await this.emailService.sendActivationEmail(user.email, token);

    return {
      message:
        'Registration successful. Check your email to verify your account.',
    };
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

    return this.generateToken(user);
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
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

    return { message: 'Email verified successfully. You can now log in.' };
  }
}
