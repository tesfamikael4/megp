"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const supertokens_node_1 = require("supertokens-node");
const auth_filter_1 = require("./auth/auth.filter");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['<YOUR_WEBSITE_DOMAIN>'],
        allowedHeaders: ['content-type', ...supertokens_node_1.default.getAllCORSHeaders()],
        credentials: true,
    });
    app.useGlobalFilters(new auth_filter_1.SupertokensExceptionFilter());
    const port = 3568;
    await app.listen(port, () => {
        console.log('[WEB]', `http://localhost:${port}`);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map