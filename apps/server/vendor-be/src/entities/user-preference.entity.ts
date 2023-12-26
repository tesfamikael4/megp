import { Audit } from "src/shared/entities";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'user_preferences' })
export class UserPreference extends Audit {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    userId: boolean;
    @Column({ default: true })
    emailNotifications: boolean;
    @Column({ default: false })
    smsNotifications: boolean;
    @Column({ default: true })
    pushNotifications: boolean;

}