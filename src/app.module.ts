import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validate } from 'env.validation';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../db/data-source';
import { EmailController } from './modules/email/email.controller';
import { EmailModule } from './modules/email/email.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(dataSourceOptions),
    // TypeOrmModule.forRoot(typeOrmAsyncConfig),
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    //   {
    //   envFilePath: ['.development.env', '.production.env'],
    //   envFilePath: [`${process.cwd()}/.env.${process.env.NODE_ENV}`],
    //   validate: validate,
    // }
    AuthModule,
    UsersModule,
    EmailModule,
  ],
  controllers: [AppController, EmailController],
  providers: [AppService],
})
export class AppModule {}
