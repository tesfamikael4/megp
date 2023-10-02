import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { SupertokensConfigHelper } from './supertokens-config-helper';
import { AuthController } from './auth.controller';
import { OrganizationModule } from 'src/organization';

@Module({
  imports: [
    AuthModule.forRoot({
      connectionURI: SupertokensConfigHelper.CONNECTION_URI,
      apiKey: SupertokensConfigHelper.API_KEY,
      appInfo: {
        appName: SupertokensConfigHelper.APP_NAME,
        apiDomain: SupertokensConfigHelper.API_DOMAIN,
        websiteDomain: SupertokensConfigHelper.WEBSITE_DOMAIN,
        apiBasePath: SupertokensConfigHelper.API_BASE_PATH,
        websiteBasePath: SupertokensConfigHelper.WEBSITE_BASE_PATH,
      },
    }),
    OrganizationModule,
  ],
  controllers: [AuthController],
  providers: [],
})
export class AuthenticationModule {}
