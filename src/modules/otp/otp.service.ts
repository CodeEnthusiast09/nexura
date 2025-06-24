import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Otp } from './entities/otp.entity';
import { MoreThan, Repository } from 'typeorm';
import { generateOtp } from './utils/otp.util';
import { OtpType } from './type/otp-type';
import { User } from '../users/entities/user.entity';
import { randomUUID } from 'crypto';
import { UsersService } from '../users/users.service';

@Injectable()
export class OtpService {
  private readonly minRequestIntervalMinutes = 1;
  private readonly tokenExpirationMinutes = 10;
  private readonly saltRounds = 10;

  constructor(
    @InjectRepository(Otp)
    private readonly otpRepo: Repository<Otp>,
  ) {}

  async generateOtp(
    user: User,
    size: number,
    type: OtpType,
  ): Promise<{ otp: string; tempToken: string }> {
    const now = new Date();

    // Check if a token was requested too recently
    // Feel free to implement robust throthling/security
    const recentToken = await this.otpRepo.findOne({
      where: {
        user,
        type,
        createdAt: MoreThan(
          new Date(now.getTime() - this.minRequestIntervalMinutes * 60 * 1000),
        ),
      },
    });

    if (recentToken) {
      throw new UnprocessableEntityException(
        'Please wait a minute before requesting a new token.',
      );
    }

    const otp = generateOtp(size);
    const hashedToken = await bcrypt.hash(otp, this.saltRounds);
    const tempToken = randomUUID();

    const tokenEntity = this.otpRepo.create({
      user,
      token: hashedToken,
      type,
      tempToken,
      expiresAt: new Date(
        now.getTime() + this.tokenExpirationMinutes * 60 * 1000,
      ),
    });

    await this.otpRepo.delete({ user, type });

    await this.otpRepo.save(tokenEntity);

    return { otp, tempToken };
  }
}
