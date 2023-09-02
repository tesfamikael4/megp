"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, { cors: true });
    app.enableCors();
    const config = app.get(config_1.ConfigService);
    const port = config.get('PORT') || 3000;
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
    app.setGlobalPrefix('api');
    const document = swagger_1.SwaggerModule.createDocument(app, new swagger_1.DocumentBuilder()
        .setTitle('Todos API')
        .setDescription('My Todos API')
        .addBearerAuth()
        .build());
    swagger_1.SwaggerModule.setup('docs', app, document);
    await app.listen(port, () => {
        console.log('[WEB]', config.get('BASE_URL') + '/docs');
    });
}
bootstrap();
//# sourceMappingURL=main.js.map