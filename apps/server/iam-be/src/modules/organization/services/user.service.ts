import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '@entities';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';
import { CreateUserDto, InviteUserDto } from '../dto/user.dto';
import { AccountsService } from 'src/modules/account/services/account.service';

@Injectable()
export class UserService extends ExtraCrudService<User> {
  constructor(
    @InjectRepository(User)
    private readonly repositoryUser: Repository<User>,
    private readonly accountsService: AccountsService,
  ) {
    super(repositoryUser);
  }

  async create(itemData: CreateUserDto): Promise<any> {
    const account =
      await this.accountsService.createBackOfficeAccount(itemData);

    itemData.accountId = account.id;
    itemData.username = account.username;
    const item = this.repositoryUser.create(itemData);
    return await this.repositoryUser.save(item);
  }

  async sendInvitation(input: InviteUserDto): Promise<any> {
    try {
      const user = await this.repositoryUser.findOne({
        where: { id: input.id },
        relations: {
          userRoles: true,
          userUnits: true,
        },
      });
      if (!user) {
        throw new HttpException('user_not_found', HttpStatus.NOT_FOUND);
      }

      if (user.userRoles.length < 1 || user.userUnits.length < 1) {
        throw new HttpException(
          'user_role_and_unit_not_assigned',
          HttpStatus.NOT_FOUND,
        );
      }

      return await this.accountsService.inviteBackOfficeAccount(user.accountId);
    } catch (error) {
      throw error;
    }
  }

  async getInvitation(id: string): Promise<any> {
    try {
      const user = await this.repositoryUser.findOneBy({ id });
      if (!user) {
        throw new HttpException('user_not_found', HttpStatus.NOT_FOUND);
      }

      return await this.accountsService.getInvitation(user.accountId);
    } catch (error) {
      throw error;
    }
  }

  async createDefaultOrganizationUser(input: any, organizationId: string) {
    const { id, ...user } = input;

    user.organizationId = organizationId;
    user.accountId = id;

    await this.repositoryUser.insert(user);
  }
}
