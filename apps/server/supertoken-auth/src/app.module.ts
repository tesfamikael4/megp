import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule.forRoot({
    // https://try.supertokens.com is for demo purposes. Replace this with the address of your core instance (sign up on supertokens.com), or self host a core.
    connectionURI: "http://196.189.44.47:3567",
    // apiKey: <API_KEY(if configured)>,
    appInfo: {
      // Learn more about this on https://supertokens.com/docs/thirdpartyemailpassword/appinfo
      appName: "m-egp",
      apiDomain: "http://196.189.44.47:3567",
      websiteDomain: "http://196.189.44.47:3569",
      apiBasePath: "/auth",
      websiteBasePath: "/auth"
    },
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
