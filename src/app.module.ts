import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { envs } from './config';
import { CompanyModule } from './company/company.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.dbHost,
      port: envs.dbPort,
      database: envs.dbName,
      username: envs.dbUserName,
      password: envs.dbPassword,
      autoLoadEntities: true,
      synchronize: true,
    }),
    CompanyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
