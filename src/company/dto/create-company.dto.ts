import { IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  ownerId: string; // ID del usuario propietario

  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  postalcode: string;

  @IsString()
  city: string;

  @IsString()
  taxnumber: string;

  @IsString()
  phonenumber: string;
}
