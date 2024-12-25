import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller()
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @MessagePattern('createCompany')
  create(@Payload() createCompanyDto: CreateCompanyDto) {
    return this.companyService.create(createCompanyDto);
  }

  @MessagePattern('findAllCompany')
  findAll() {
    return this.companyService.findAll();
  }

  @MessagePattern('findOneCompany')
  findOne(@Payload() id: number) {
    return this.companyService.findOne(id);
  }

  @MessagePattern('updateCompany')
  update(@Payload() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.update(updateCompanyDto.id, updateCompanyDto);
  }

  @MessagePattern('removeCompany')
  remove(@Payload() id: number) {
    return this.companyService.remove(id);
  }
}
