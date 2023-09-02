import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule.forRoot({
      connectionURI: 'http://196.189.44.47:3567',
      apiKey: 'ob0WLJ637sLR730GcEJJVFRcWNlc2PpN',
      appInfo: {
        appName: 'm-egp',
        apiDomain: 'http://196.189.44.47:3567',
        websiteDomain: 'http://196.189.44.47:3569',
        apiBasePath: '/api/auth',
        websiteBasePath: '/api/auth',
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AuthenticationModule {}
