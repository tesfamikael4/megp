import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from './auth/auth.guard';
import { Session } from './auth/session.decorator';
import { SessionContainer } from 'supertokens-node/recipe/session';
import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    // const res = await ThirdPartyEmailPassword.emailPasswordSignUp("public", "test1112", "123456789A");
    const result = await ThirdPartyEmailPassword.emailPasswordSignIn(
      'public',
      'test1112',
      '123456789A',
    );
    // const r = await ThirdPartyEmailPassword.sendResetPasswordEmail("public", "abd456b1-bd8b-4794-a87a-512a1327f26a");

    return result;
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
