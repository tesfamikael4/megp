import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  AllowAnonymous,
  CurrentUser,
  PermissionsGuard,
} from 'src/authorization';
import { JwtAuthGuard } from 'src/authorization/guard/jwt-auth.guard';

@ApiBearerAuth()
@Controller('sample')
@ApiTags('sample')
export class SampleController {
  @Get('pro')
  @UseGuards(JwtAuthGuard)
  async pro(@CurrentUser() user: any) {
    console.log(
      '🚀 ~ file: sample.controller.ts:30 ~ SampleController ~ pro ~ user:',
      user,
    );

    return user;
  }

  @Post('pro')
  @UseGuards(PermissionsGuard('admin'))
  async Post(@CurrentUser() user: any) {
    console.log(
      '🚀 ~ file: sample.controller.ts:30 ~ SampleController ~ pro ~ user:',
      user,
    );

    return user;
  }

  @Get()
  @AllowAnonymous()
  async all(@CurrentUser() user: any) {
    console.log(
      '🚀 ~ file: sample.controller.ts:30 ~ SampleController ~ pro ~ user:',
      user,
    );

    return user;
  }
}
