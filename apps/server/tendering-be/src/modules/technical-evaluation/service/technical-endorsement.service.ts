import { InjectRepository } from '@nestjs/typeorm';
import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class TechnicalEndorsementService {
  constructor(
    @Inject(REQUEST)
    private request: Request,
  ) {}
  async submit() {
    return true;
  }
}
