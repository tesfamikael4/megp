import { SetMetadata } from '@nestjs/common';
import { BulkCrudOptions, CrudOptions } from '../types/crud-option.type';

export const BulkCrudDecorator = (options: BulkCrudOptions) => {
    return SetMetadata('crudOptions', options);
};

export const CrudDecorator = (options: CrudOptions) => {
    return SetMetadata('crudOptions', options);
};