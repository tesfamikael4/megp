import type { CollectionQuery } from '../models/query';
import type { EntityConfig } from '../models/entity';
import { EntityList } from './entity/entity-list';
import { TreeList } from './entity/tree-view';

interface EntityLayoutProps<T> {
  mode?: 'list' | 'detail' | 'new';
  config: EntityConfig<T>;
  isLoading?: boolean;
  data: T[];
  total?: number;
  detail: React.ReactNode;
  hasTree?: boolean;
  hasPagination?: boolean;
  onRequestChange?: (request: CollectionQuery) => void;
}

export function EntityLayout<T>({
  mode = 'list',
  config,
  data,
  total,
  isLoading,
  detail,
  hasTree,
  hasPagination,
  onRequestChange,
}: EntityLayoutProps<T>): React.ReactElement {
  return (
    <div className="flex gap-4 items-start">
      {hasTree ? (
        <TreeList<T>
          config={config}
          data={data}
          hasTree
          isLoading={isLoading}
          mode={mode}
        />
      ) : (
        <EntityList<T>
          config={config}
          data={data}
          hasPagination={hasPagination}
          isLoading={isLoading}
          mode={mode}
          onRequestChange={onRequestChange}
          total={total}
        />
      )}

      <div className="flex-grow">
        <div className="w-full">{detail}</div>
      </div>
    </div>
  );
}
