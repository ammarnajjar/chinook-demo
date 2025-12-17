import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { EmployeesModule } from './employees/employees.module';

dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mssql',
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 1433,
      username: process.env.DB_USERNAME || 'sa',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'Chinook',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
      options: { encrypt: false }
    }),
    EmployeesModule
  ]
})
export class AppModule {}
