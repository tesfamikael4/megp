import { SetMetadata } from '@nestjs/common';
import {
  RelationCrudOptions,
  ExtraCrudOptions,
} from '../types/crud-option.type';

export const RelationCrudDecorator = (options: RelationCrudOptions) => {
  return Reflect.metadata('crudOptions', options);
};
export const ExtraCrudDecorator = (options: ExtraCrudOptions) => {
  return SetMetadata('crudOptions', options);
};
