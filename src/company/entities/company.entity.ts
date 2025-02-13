import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('company')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ownerId: string; // ID del usuario propietario

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  postalcode: string;

  @Column({ nullable: true })
  city: string;

  @Column({ unique: true })
  taxnumber: string;

  @Column({ nullable: true })
  phonenumber: string;

  // @Column()
  // logo: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
