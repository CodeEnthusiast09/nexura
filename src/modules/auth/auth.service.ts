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
import { EmailService } from 'src/common/email/email.service';
import { randomBytes } from 'crypto';
import { addMinutes } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}
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

    await this.emailService.sendEmail(user.email, 'Verify your email', html);

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
