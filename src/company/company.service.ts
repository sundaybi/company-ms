import { HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { CompanyMember } from './entities/company-member.entity';
import { ServicesDirectory } from 'src/config';
import { firstValueFrom } from 'rxjs';
import { AddCompanyMemberDto } from './dto/add-company-member.dto';

@Injectable()
export class CompanyService {
  private readonly logger = new Logger(CompanyService.name);
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(CompanyMember)
    private readonly memberRepository: Repository<CompanyMember>,
    @Inject(ServicesDirectory.NATS_SERVICE)
    private readonly client: ClientProxy,
  ) {}

  async create(createCompanyDto: CreateCompanyDto) {
    try {
      const { ownerId } = createCompanyDto;

      // 1️⃣ Verificar que el usuario existe en `auth`
      const user = await firstValueFrom(
        this.client.send('auth.user.findById', ownerId),
      );

      if (!user) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Propietario no encontrado',
        });
      }

      // 2️⃣ Crear la empresa
      const company = this.companyRepository.create(createCompanyDto);
      await this.companyRepository.save(company);

      // 3️⃣ Asignar al usuario como `owner` en `CompanyMember`
      const owner = this.memberRepository.create({
        companyId: company.id,
        userId: ownerId,
        role: 'owner',
      });
      await this.memberRepository.save(owner);

      // 4️⃣ Emitir evento en NATS
      this.client.emit('company.created', { companyId: company.id, ownerId });

      return company;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async addMember(dto: AddCompanyMemberDto) {
    try {
      const { companyId, ownerId, userId, role } = dto;

      // 1️⃣ Verificar que la empresa exista
      const company = await this.companyRepository.findOne({
        where: { id: companyId },
      });

      if (!company)
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Empresa no encontrada',
        });

      // 2️⃣ Verificar que el usuario que otorga permisos (`ownerId`) es `owner` o `manager`
      const ownerMember = await this.memberRepository.findOne({
        where: { companyId, userId: ownerId },
      });

      if (
        !ownerMember ||
        (ownerMember.role !== 'owner' && ownerMember.role !== 'manager')
      ) {
        throw new RpcException({
          status: HttpStatus.FORBIDDEN,
          message: 'No tienes permiso para agregar miembros a esta empresa',
        });
      }

      // 3️⃣ Verificar que el usuario a agregar existe en `auth`
      let user;

      user = await firstValueFrom(
        this.client.send('auth.user.findById', userId),
      );

      if (!user)
        throw new RpcException({
          status: HttpStatus.BAD_REQUEST,
          message: 'Nuevo miembro no encontrado',
        });

      // 4️⃣ Verificar si el usuario ya pertenece a la empresa
      const existingMember = await this.memberRepository.findOne({
        where: { companyId, userId },
      });
      if (existingMember) {
        throw new RpcException({
          status: HttpStatus.CONFLICT,
          message: 'Miembro ya existe',
        });
      }

      // 5️⃣ Agregar usuario a la empresa con el rol definido
      const newMember = this.memberRepository.create({
        companyId,
        userId,
        role,
      });
      await this.memberRepository.save(newMember);

      // 6️⃣ Emitir evento NATS para notificar a otros servicios
      this.client.emit('company.member.added', { companyId, userId, role });

      return { message: 'Miembro nuevo asignado satisfactoriamente' };
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

 async findAll() {
    // 1️⃣ Verificar que la empresa exista
    const companies = await this.companyRepository.find();
    return companies;
  }

  async findOne(id: string) {
      // 1️⃣ Verificar que la empresa exista
      const company = await this.companyRepository.findOneBy({
        id
      });

      if (!company)
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: 'Empresa no encontrada',
        });

      return company;
  }

  update(id: number, updateCompanyDto: UpdateCompanyDto) {
    return `This action updates a #${id} company`;
  }

  remove(id: number) {
    return `This action removes a #${id} company`;
  }

  private handleDBExceptions(error: any) {
    if (typeof error === 'object' && 'status' in error && 'message' in error) {
      throw new RpcException({
        status: error.status,
        message: error.message,
      });
    }

    if (error instanceof RpcException) {
      throw error;
    }

    if (error.code === '23505')
      throw new RpcException({
        message: error.detail,
        status: HttpStatus.BAD_REQUEST,
      });

    this.logger.error(error);
    throw new RpcException({
      message: 'Unexpected error, check server logs',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });
  }
}
