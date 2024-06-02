import {
  BadRequestException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  CreateFormulaImplementationDto,
  CreateUnitPriceDto,
  EvaluateFormulaImplementationDto,
  UpdateFormulaImplementationDto,
} from '../dto/formula-implementation.dto';
import { EvaluatorService } from './evaluator.service';
import { ExtraCrudService } from 'src/shared/service';
import { FormulaImplementation } from 'src/entities/formula-implementation.entity';
import { ENTITY_MANAGER_KEY } from 'src/shared/interceptors';
import { REQUEST } from '@nestjs/core';
import { OpenedBidResponseItem } from 'src/entities';
import { PriceAdjustingFactorEnum } from 'src/shared/enums/price-adjusting-factor.enum';
import { FormulaUnit } from 'src/entities/formula-unit.entity';
import { CompleteFinancialBidderEvaluationDto } from 'src/modules/financial-evaluation/dto/financial-assessment.dto';
import { FinancialBidPriceAssessment } from 'src/entities/financial-bid-price-assessment.entity';

@Injectable()
export class FormulaImplementationService extends ExtraCrudService<FormulaImplementation> {
  constructor(
    @InjectRepository(FormulaImplementation)
    private readonly formulaImplementationRepository: Repository<FormulaImplementation>,

    private readonly evaluatorService: EvaluatorService,

    @Inject(REQUEST)
    private request: Request,
  ) {
    super(formulaImplementationRepository);
  }

  async evaluate(
    formulaImplementationId: string,
    evaluateFormulaImplementationDto: any,
  ): Promise<number> {
    const formulaImplementation = await this.findOneOrFail(
      formulaImplementationId,
    );

    const availableFormulaImplementationSet =
      await this.getAvailableFormulaImplementationSet(
        formulaImplementation.lotId,
      );

    try {
      return this.evaluatorService.evaluate(
        formulaImplementation.representation,
        evaluateFormulaImplementationDto.variables,
        availableFormulaImplementationSet,
      );
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async create(
    formulaImplementation: CreateFormulaImplementationDto,
    req: any,
  ): Promise<FormulaImplementation> {
    const availableFormulaImplementationSet =
      await this.getAvailableFormulaImplementationSet(
        formulaImplementation.lotId,
      );
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    // await this.hasUnitPrice(manager, formulaImplementation, req);

    if (availableFormulaImplementationSet[formulaImplementation.name])
      throw new BadRequestException(
        'Duplicate formulaImplementation name under the same group is not allowed.',
      );

    try {
      // Check if the new formulaImplementation does not create any circular dependencies
      const formulaImplementationSetAfterCreate = {
        ...availableFormulaImplementationSet,
        [formulaImplementation.name]: formulaImplementation.representation,
      };
      this.evaluatorService.validate(formulaImplementationSetAfterCreate);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    return this.formulaImplementationRepository.save({
      ...formulaImplementation,
      organizationId: req.user.organization.id,
      organizationName: req.user.organization.name,
    });
  }

  async createUnitPrice(formulaImplementation: CreateUnitPriceDto, req: any) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    const hasUnitPrice = await manager
      .getRepository(FormulaImplementation)
      .exists({
        where: {
          name: 'unit_price',
          lotId: formulaImplementation.lotId,
        },
      });

    if (!hasUnitPrice) {
      const unitPrice = await this.getOfferedUnitPrice(
        manager,
        formulaImplementation,
      );
      await manager.getRepository(FormulaImplementation).save({
        name: 'unit_price',
        lotId: formulaImplementation.lotId,
        itemId: formulaImplementation.itemId,
        bidderId: formulaImplementation.bidderId,
        representation: `100`,
        // representation: unitPrice,
        organizationId: req.user.organization.id,
        organizationName: req.user.organization.name,
        type: PriceAdjustingFactorEnum.ADDITION,
      });
    }
  }

  private async getOfferedUnitPrice(
    manager: EntityManager,
    itemData: { lotId: string; itemId: string; bidderId: string },
  ) {
    const response = await manager
      .getRepository(OpenedBidResponseItem)
      .findOne({
        where: {
          bidRegistrationDetail: {
            lotId: itemData.lotId,
            bidRegistration: {
              bidderId: itemData.bidderId,
            },
          },
          itemId: itemData.itemId,
          key: 'rate',
        },
      });
    if (!response) {
      throw new BadRequestException('Rate is required');
    }
    return response.value?.vale?.rate;
  }

  async formulaImplementationStatus(
    lotId: string,
    itemId: string,
    bidderId: string,
    req: any,
  ) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const [formulaUnit, formulaImplementation] = await Promise.all([
      manager.getRepository(FormulaUnit).find({
        where: {
          lotId,
        },
      }),
      // Todo: check if the opener is the team member
      this.formulaImplementationRepository.find({
        where: {
          lotId,
          itemId,
          bidderId,
        },
      }),
    ]);

    const response = formulaUnit.map((formulaUnit) => ({
      ...formulaUnit,
      applicable: formulaImplementation.find((x) => x.name == formulaUnit.name)
        ? true
        : false,
      formulaImplementationId: formulaImplementation.find(
        (x) => x.name == formulaUnit.name,
      )?.id,
    }));

    return response;
  }
  async getSummary(lotId: string, itemId: string, bidderId: string, req: any) {
    // const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const formulaImplementations =
      await this.formulaImplementationRepository.find({
        where: {
          lotId,
          itemId,
          bidderId,
        },
      });

    const response = await Promise.all(
      formulaImplementations.map(async (x) => ({
        ...x,
        result: await this.evaluate(x.id, {
          variables: {
            x: 1,
            y: 2,
            z: 3,
          },
        }),
      })),
    );

    return response;
  }

  async saveResult(lotId: string, itemId: string, bidderId: string, req) {
    const formulaImplementations =
      await this.formulaImplementationRepository.find({
        where: {
          lotId,
          itemId,
          bidderId,
        },
      });

    if (!formulaImplementations) {
      throw new HttpException('There is no formula assigned yet', 430);
    }

    const calculateImplementationResult = await Promise.all(
      formulaImplementations.map(async (x) => ({
        ...x,
        result: await this.evaluate(x.id, {
          variables: {
            x: 1,
            y: 2,
            z: 3,
          },
        }),
      })),
    );
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];

    await manager
      .getRepository(FormulaImplementation)
      .upsert(calculateImplementationResult, {
        conflictPaths: ['id'], // Specify the columns to match on for the upsert operation
      });

    const totalFormula = this.constructTotalFormula(formulaImplementations);

    const total = await this.formulaImplementationRepository.create({
      name: 'Total',
      type: PriceAdjustingFactorEnum.TOTAL,
      representation: totalFormula,
      organizationId: req.user.organization.id,
      organizationName: req.user.organization.name,
      lotId,
      itemId,
      bidderId,
    });
    await this.formulaImplementationRepository.save(total);
  }
  private constructTotalFormula(
    formulaImplementations: FormulaImplementation[],
  ) {
    const additions = [];
    const deductions = [];

    // Iterate through the data and classify names based on type
    formulaImplementations.forEach((item) => {
      if (item.type === 'ADDITION' || item.type === 'TAXES') {
        additions.push(item.name);
      } else if (item.type === 'DEDUCTION') {
        deductions.push(item.name);
      }
    });

    // Construct the formula string
    let formula = '';

    if (additions.length > 0) {
      formula += additions.join(' + ');
    }

    if (deductions.length > 0) {
      if (formula.length > 0) {
        formula += ' - ';
      }
      formula += deductions.join(' - ');
    }
    return formula;
  }

  async completeBidderEvaluation(
    itemData: CompleteFinancialBidderEvaluationDto,
    req: any,
  ) {
    const manager: EntityManager = this.request[ENTITY_MANAGER_KEY];
    const totalFormula = await manager
      .getRepository(FormulaImplementation)
      .findOne({
        where: {
          lotId: itemData.lotId,
          itemId: itemData.itemId,
          bidderId: itemData.bidderId,
          name: 'Total',
        },
      });
    const totalResult = await this.evaluate(totalFormula.id, {
      variables: {
        x: 1,
        y: 2,
        z: 3,
      },
    });
    await manager.getRepository(FormulaImplementation).update(
      {
        id: totalFormula.id,
      },
      {
        result: totalResult,
      },
    );

    // const unitPrice = await this.getOfferedUnitPrice(manager, itemData);

    const financialBidPriceAssessment = await manager
      .getRepository(FinancialBidPriceAssessment)
      .create({
        lotId: itemData.lotId,
        itemId: itemData.itemId,
        bidderId: itemData.bidderId,
        organizationName: req.user.organization.name,
        organizationId: req.user.organization.id,
        evaluatorId: req.user.userId,
        evaluatorName: req.user.firstName + ' ' + req.user.lastName,
        isTeamLead: true,
        offeredUnitPrice: 100, // change with actual
        // offeredUnitPrice: unitPrice,
        calculatedBidUnitPrice: totalResult,
        formulaImplementationId: totalFormula.id,
      });

    await manager
      .getRepository(FinancialBidPriceAssessment)
      .save(financialBidPriceAssessment);
  }

  async update(
    id: string,
    formulaImplementation: UpdateFormulaImplementationDto,
  ): Promise<FormulaImplementation> {
    const originalFormulaImplementation = await this.findOneOrFail(id);

    const availableFormulaImplementationSet =
      await this.getAvailableFormulaImplementationSet(
        originalFormulaImplementation.lotId,
      );

    try {
      // Check if the new formulaImplementation update does not create any problem
      const formulaImplementationSetAfterUpdate = {
        ...availableFormulaImplementationSet,
        [formulaImplementation.name]: formulaImplementation.representation,
      };
      this.evaluatorService.validate(formulaImplementationSetAfterUpdate);

      await this.formulaImplementationRepository.update(
        id,
        formulaImplementation,
      );
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    return { ...originalFormulaImplementation, ...formulaImplementation };
  }

  async delete(id: string): Promise<FormulaImplementation> {
    const formulaImplementation = await this.findOneOrFail(id);

    const availableFormulaImplementationSet =
      await this.getAvailableFormulaImplementationSet(
        formulaImplementation.lotId,
      );

    try {
      // Check if the formulaImplementation is being used by other formulaImplementations in the same group
      const formulaImplementationSetAfterDelete = {
        ...availableFormulaImplementationSet,
      };
      delete formulaImplementationSetAfterDelete[formulaImplementation.name];
      this.evaluatorService.validate(formulaImplementationSetAfterDelete);
    } catch (e) {
      throw new BadRequestException(
        `FormulaImplementation ${formulaImplementation.name} is being used by other formulaImplementation in the group.`,
      );
    }

    await this.formulaImplementationRepository.delete(id);

    return formulaImplementation;
  }

  async findByGroup(lotId: string): Promise<FormulaImplementation[]> {
    return this.formulaImplementationRepository.find({ where: { lotId } });
  }

  async getAvailableFormulaImplementationSet(
    lotId: string,
  ): Promise<Record<string, string>> {
    /**
         * Schema for formulaImplementation set <name: mathematical expression>
        {
          'formula1': '2 + 2',
          'formula2': 'formula1 * 2',
        }
        */
    const formulaSet: Record<string, string> = {};

    (await this.findByGroup(lotId)).forEach((f) => {
      formulaSet[f.name] = f.representation;
    });

    return formulaSet;
  }
}
