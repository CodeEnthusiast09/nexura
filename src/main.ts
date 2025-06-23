import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  // await app.listen(process.env.PORT ?? 3000);

  const configService = app.get(ConfigService);

  await app.listen(configService.get<number>('port'));
}

bootstrap();
