import { CommonEntity } from 'src/shared/entities/common.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ItemMaster } from './item-master.entity';

@Entity({ name: 'classifications' })
export class Classification extends CommonEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    key: string;
    @Column({ primary: true, unique: true })
    code: string;
    @Column()
    title: string;
    @Column({ nullable: true })
    definition: string;
    @Column({ nullable: true })
    synonym: string;
    @Column({ nullable: true })
    acronym: string;
    @Column({ default: true })
    isActive: boolean;

    @OneToMany(() => ItemMaster, (entity) => entity.commodityCode)
    itemMasters: ItemMaster[];


}
