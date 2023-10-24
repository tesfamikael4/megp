import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserProfile } from '../entities/user-profile.entity';
import { ExtraCrudService } from 'src/shared/service/extra-crud.service';

@Injectable()
export class UserProfileService extends ExtraCrudService<UserProfile> {
  constructor(
    @InjectRepository(UserProfile)
    private readonly repositoryUserProfile: Repository<UserProfile>,
  ) {
    super(repositoryUserProfile);
  }
}
