import { SetMetadata } from '@nestjs/common';
import {
  RelationCrudOptions,
  ExtraCrudOptions,
} from '../types/crud-option.type';

export const RelationCrudDecorator = (options: RelationCrudOptions) => {
  return SetMetadata('crudOptions', options);
};
export const ExtraCrudDecorator = (options: ExtraCrudOptions) => {
  return SetMetadata('crudOptions', options);
};
