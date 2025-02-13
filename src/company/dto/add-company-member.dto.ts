import { IsEnum, IsString } from 'class-validator';

export class AddCompanyMemberDto {
  @IsString()
  companyId: string;

  @IsString()
  ownerId: string; // Usuario que otorga los permisos

  @IsString()
  userId: string; // Usuario al que se le da acceso

  @IsEnum(['owner', 'admin', 'manager', 'reader'], {
    message: 'El rol debe ser owner, admin, manager o reader',
  })
  role: 'owner' | 'admin' | 'manager' | 'reader';
}
