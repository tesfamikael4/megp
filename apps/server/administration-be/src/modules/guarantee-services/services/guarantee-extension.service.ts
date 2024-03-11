import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GuaranteeExtension } from 'src/entities/guarantee-extension.entity';
import { ExtraCrudService } from 'src/shared/service';
import { Repository } from 'typeorm';

@Injectable()
export class GuaranteeExtensionService extends ExtraCrudService<GuaranteeExtension> {
  constructor(
    @InjectRepository(GuaranteeExtension)
    private readonly extensionRepository: Repository<GuaranteeExtension>,
  ) {
    super(extensionRepository);
  }
}
