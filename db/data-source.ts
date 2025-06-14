import { DataSource, DataSourceOptions } from 'typeorm';

// import { ConfigModule, ConfigService } from '@nestjs/config';
// import {
//   TypeOrmModuleAsyncOptions,
//   TypeOrmModuleOptions,
// } from '@nestjs/typeorm';

// export const typeOrmAsyncConfig: TypeOrmModuleAsyncOptions = {
//   imports: [ConfigModule],
//   inject: [ConfigService],
//   useFactory: async (
//     configService: ConfigService,
//   ): Promise<TypeOrmModuleOptions> => {
//     return {
//       type: 'postgres',
//       host: configService.get<string>('dbHost'),
//       port: configService.get<number>('dbPort'),
//       username: configService.get<string>('dbUsername'),
//       database: configService.get<string>('dbName'),
//       password: configService.get<string>('dbPassword'),
//       entities: ['dist/**/*.entity.js'],
//       synchronize: false,
//       migrations: ['dist/db/migrations/*.js'],
//     };
//   },
// };

// console.log('Environment variables loaded:');
// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_PORT:', process.env.DB_PORT);
// console.log('DB_USERNAME:', process.env.DB_USERNAME);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '[SET]' : '[NOT SET]');
// console.log('DB_NAME:', process.env.DB_NAME);

// export const dataSourceOptions: DataSourceOptions = {
//   type: 'postgres',
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT),
//   username: process.env.DB_USERNAME,
//   database: process.env.DB_NAME,
//   password: process.env.DB_PASSWORD,
//   entities: ['dist/**/*.entity.js'],
//   synchronize: false,
//   migrations: ['dist/db/migrations/*.js'],
// };

// const dataSource = new DataSource(dataSourceOptions);
// export default dataSource;

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'obrien',
  password: 'admin123',
  database: 'nexura',
  entities: ['dist/**/*.entity.js'],
  synchronize: false,
  migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
