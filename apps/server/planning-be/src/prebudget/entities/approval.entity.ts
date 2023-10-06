import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApprovalType, PrebudgetPlanStatus } from 'src/shared/enums/enums';
import { CommonEntity } from 'src/shared/entities/common.entity';

@Entity({ name: 'approvals' })
export class Approval extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  parentId: string;

  @Column({ type: 'enum', enum: ApprovalType })
  type: string;

  @Column({ enum: PrebudgetPlanStatus })
  endorseType: string;

  @Column({ nullable: true })
  approverName: string;

  @Column({ nullable: true })
  remarks: string;

  @Column({ nullable: true })
  attachment: string;
}
