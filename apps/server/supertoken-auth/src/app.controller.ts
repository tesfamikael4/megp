import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { Session } from './auth/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('protected')
  @UseGuards(new AuthGuard())
  async getTest(@Session() session: SessionContainer): Promise<any> {
    return {
      userId: session.getUserId(),
      accessToken: session.getAccessToken(),
    };
  }
}
