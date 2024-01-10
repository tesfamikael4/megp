import type { CollectionQuery } from '../models/query';
import type { EntityConfig } from '../models/entity';
import { EntityList } from './entity/entity-list';

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
    <div
      className={
        mode === 'list' ? 'flex items-start gap-0' : 'flex items-start gap-4'
      }
    >
      <EntityList<T>
        config={config}
        data={data}
        hasPagination={hasPagination}
        hasTree={Boolean(hasTree)}
        isLoading={isLoading}
        mode={mode}
        onRequestChange={onRequestChange}
        total={total}
      />

      <div className="flex-grow">
        <div className="w-full">{detail}</div>
      </div>
    </div>
  );
}
