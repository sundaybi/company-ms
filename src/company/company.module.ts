import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { Company } from './entities/company.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NatsModule } from 'src/transports/nats.module';
import { CompanyMember } from './entities/company-member.entity';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService],
  imports: [NatsModule, TypeOrmModule.forFeature([Company, CompanyMember])],
})
export class CompanyModule {}
