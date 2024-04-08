import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from '@audit';
@Entity({ name: 'files' })
export class FilesEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  fileName: string;
  @Column()
  fileType: string;
  @Column()
  bucketName: string;
  @Column()
  originalName: string;
  @Column({ nullable: true })
  attachmentUrl: string;
  @Column()
  path: string;
  @Column()
  vendorId: string;
}
