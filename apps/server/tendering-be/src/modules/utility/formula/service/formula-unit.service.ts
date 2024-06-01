import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FormulaUnit } from 'src/entities/formula-unit.entity';
import { Repository } from 'typeorm';
import {
  CreateFormulaUnitDto,
  EvaluateFormulaUnitDto,
  UpdateFormulaUnitDto,
} from '../dto/formula.dto';
import { EvaluatorService } from './evaluator.service';
import { ExtraCrudService } from 'src/shared/service';

@Injectable()
export class FormulaUnitService extends ExtraCrudService<FormulaUnit> {
  constructor(
    @InjectRepository(FormulaUnit)
    private readonly formulaUnitRepository: Repository<FormulaUnit>,

    private readonly evaluatorService: EvaluatorService,
  ) {
    super(formulaUnitRepository);
  }

  async evaluate(
    formulaUnitId: string,
    evaluateFormulaUnitDto: EvaluateFormulaUnitDto,
  ): Promise<number> {
    const formulaUnit = await this.findOneOrFail(formulaUnitId);

    const availableFormulaUnitSet = await this.getAvailableFormulaUnitSet(
      formulaUnit.lotId,
    );

    try {
      return this.evaluatorService.evaluate(
        formulaUnit.representation,
        evaluateFormulaUnitDto.variables,
        availableFormulaUnitSet,
      );
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async create(
    formulaUnit: CreateFormulaUnitDto,
    req: any,
  ): Promise<FormulaUnit> {
    const availableFormulaUnitSet = await this.getAvailableFormulaUnitSet(
      formulaUnit.lotId,
    );

    if (availableFormulaUnitSet[formulaUnit.name])
      throw new BadRequestException(
        'Duplicate formulaUnit name under the same group is not allowed.',
      );

    try {
      // Check if the new formulaUnit does not create any circular dependencies
      const formulaUnitSetAfterCreate = {
        ...availableFormulaUnitSet,
        [formulaUnit.name]: formulaUnit.representation,
      };
      this.evaluatorService.validate(formulaUnitSetAfterCreate);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    return this.formulaUnitRepository.save({
      ...formulaUnit,
      organizationId: req.user.organization.id,
      organizationName: req.user.organization.name,
    });
  }

  async update(
    id: string,
    formulaUnit: UpdateFormulaUnitDto,
  ): Promise<FormulaUnit> {
    const originalFormulaUnit = await this.findOneOrFail(id);

    const availableFormulaUnitSet = await this.getAvailableFormulaUnitSet(
      originalFormulaUnit.lotId,
    );

    try {
      // Check if the new formulaUnit update does not create any problem
      const formulaUnitSetAfterUpdate = {
        ...availableFormulaUnitSet,
        [formulaUnit.name]: formulaUnit.representation,
      };
      this.evaluatorService.validate(formulaUnitSetAfterUpdate);

      await this.formulaUnitRepository.update(id, formulaUnit);
    } catch (e) {
      throw new BadRequestException(e.message);
    }

    return { ...originalFormulaUnit, ...formulaUnit };
  }

  async delete(id: string): Promise<FormulaUnit> {
    const formulaUnit = await this.findOneOrFail(id);

    const availableFormulaUnitSet = await this.getAvailableFormulaUnitSet(
      formulaUnit.lotId,
    );

    try {
      // Check if the formulaUnit is being used by other formulaUnits in the same group
      const formulaUnitSetAfterDelete = { ...availableFormulaUnitSet };
      delete formulaUnitSetAfterDelete[formulaUnit.name];
      this.evaluatorService.validate(formulaUnitSetAfterDelete);
    } catch (e) {
      throw new BadRequestException(
        `FormulaUnit ${formulaUnit.name} is being used by other formulaUnit in the group.`,
      );
    }

    await this.formulaUnitRepository.delete(id);

    return formulaUnit;
  }

  async findByGroup(lotId: string): Promise<FormulaUnit[]> {
    return this.formulaUnitRepository.find({ where: { lotId } });
  }

  async getAvailableFormulaUnitSet(
    lotId: string,
  ): Promise<Record<string, string>> {
    /**
         * Schema for formulaUnit set <name: mathematical expression>
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
