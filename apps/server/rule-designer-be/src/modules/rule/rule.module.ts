import { Module } from '@nestjs/common';
import { RuleController } from './controllers/rule.controller';
import { RuleService } from './services/rule.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule, RuleHandler, RuleHandlerOptions } from 'src/entities';
import { RuleDesignerController } from './controllers/rule-designer.controller';
import { RuleDesignerService } from './services/rule-designer.service';
import { RuleDesigner } from 'src/entities/rule-designer.entity';
import { RuleHandlerService } from './services/rule-handler.service';
import { RuleHandlerController } from './controllers/rule-handler.controller';
import { RuleHandlerOptionsService } from './services/rule-handler-options.service';
import { RuleHandlerOptionsController } from './controllers/rule-handler-options.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Rule,
      RuleDesigner,
      RuleHandler,
      RuleHandlerOptions,
    ]),
  ],
  controllers: [
    RuleController,
    RuleDesignerController,
    RuleHandlerController,
    RuleHandlerOptionsController,
  ],
  providers: [
    RuleService,
    RuleDesignerService,
    RuleHandlerService,
    RuleHandlerOptionsService,
  ],
})
export class RuleModule {}
