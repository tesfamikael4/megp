import { Audit } from "src/shared/entities";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "notifications" })
export class Notification extends Audit {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    userId: string;
    @Column()
    title: string;
    @Column()
    content: string;
    @Column({ default: "new" })
    status: string;
}