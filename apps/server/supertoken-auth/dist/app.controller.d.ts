import { AppService } from './app.service';
import { SessionContainer } from 'supertokens-node/recipe/session';
import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): Promise<{
        status: "OK";
        user: ThirdPartyEmailPassword.User;
    } | {
        status: "WRONG_CREDENTIALS_ERROR";
    }>;
    getTest(session: SessionContainer): Promise<any>;
}
