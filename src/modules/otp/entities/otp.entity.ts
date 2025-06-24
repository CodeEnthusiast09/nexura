import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OtpType } from '../type/otp-type';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, { nullable: false })
  // @JoinColumn({ name: 'userId' }) // will be userId by default
  user: User;

  @Column()
  token: string; // hashed otp for verification or token for password reset

  @Column({ default: 0 })
  failedAttempts: number;

  @Column({ default: false })
  isLocked: boolean;

  @Column({ type: 'enum', enum: OtpType })
  type: OtpType; // type of OTP, can be 'otp' or 'reset_password'

  @Column({ unique: true })
  tempToken: string;

  @Column()
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
