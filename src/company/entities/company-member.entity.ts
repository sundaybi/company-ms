import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Company } from './company.entity';

@Entity('company_members')
export class CompanyMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string; // Referencia al usuario

  @Column()
  companyId: string; // Referencia a la empresa

  @Column({
    type: 'enum',
    enum: ['owner', 'admin', 'manager', 'reader'],
    default: 'reader',
  })
  role: 'owner' | 'admin' | 'manager' | 'reader';

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company: Company;
}
