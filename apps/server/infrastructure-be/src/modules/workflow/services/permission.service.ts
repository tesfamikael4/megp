import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ExtraCrudService } from '@megp/shared-be';
import { Permission } from 'src/entities/permission.entity';

@Injectable()
export class PermissionService extends ExtraCrudService<Permission> {
  constructor(
    @InjectRepository(Permission)
    private readonly repositoryPermission: Repository<Permission>,
  ) {
    super(repositoryPermission);
  }
  async bulkCreate(permissions: Permission[]): Promise<Permission[]> {
    const prePermission = await this.repositoryPermission.find({
      where: { activityId: permissions[0].activityId },
    });
    if (prePermission.length > 0) {
      await this.repositoryPermission.delete(prePermission as any);
    }
    const items = this.repositoryPermission.create(permissions);
    await this.repositoryPermission.save(items);

    return permissions;
  }
}
