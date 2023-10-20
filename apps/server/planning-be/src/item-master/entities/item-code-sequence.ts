import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'item_code_sequences' })
export class ItemCodeSequence {
    @PrimaryGeneratedColumn('increment')
    id: number;
}
