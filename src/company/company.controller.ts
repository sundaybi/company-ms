import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AddCompanyMemberDto } from './dto/add-company-member.dto';

@Controller()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @MessagePattern('features.company.create')
  create(@Payload() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @MessagePattern('features.company.addMember')
  addMember(@Payload() dto: AddCompanyMemberDto) {
    return this.companyService.addMember(dto);
  }

  @MessagePattern('features.company.findAll')
  findAll() {
    return this.companyService.findAll();
  }

  @MessagePattern('features.company.findOne')
  findOne(@Payload() id: number) {
    return this.companyService.findOne(id);
  }

  @MessagePattern('features.company.update')
  update(@Payload() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(updateCompanyDto.id, updateCompanyDto);
  }

  @MessagePattern('features.company.remove')
  remove(@Payload() id: number) {
    return this.companyService.remove(id);
  }
}
