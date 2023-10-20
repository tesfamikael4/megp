import { CommonEntity } from 'src/shared/entities/common.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'measurements' })
export class Measurement extends CommonEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    name: string;
    @Column()
    shortName: string;
    @Column()
    code: string;
}
