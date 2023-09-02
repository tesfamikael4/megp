import { ObjectLiteral, Repository } from 'typeorm';
import { SelectQueryBuilder } from 'typeorm';
import { CollectionQuery } from './collection-query';
export declare class QueryConstructor {
    static constructQuery<T extends ObjectLiteral>(repository: Repository<T>, query: CollectionQuery): SelectQueryBuilder<T>;
    static toSnackCase(text: string): string;
}
