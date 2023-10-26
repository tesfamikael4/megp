import type { EntityConfig } from '../models/entity';
import { EntityList } from './entity/entity-list';
import { TreeList } from './entity/tree-view';

interface EntityLayoutProps<T> {
  mode?: 'list' | 'detail' | 'new';
  config: EntityConfig<T>;
  data: T[];
  isLoading?: boolean;
  detail: React.ReactNode;
  hasTree?: boolean;
}

export function EntityLayout<T>({
  mode = 'list',
  config,
  data,
  isLoading,
  detail,
  hasTree,
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
          isLoading={isLoading}
          mode={mode}
        />
      )}

      <div className="flex-grow">
        <div className="w-full">{detail}</div>
      </div>
    </div>
  );
}
