import { EntityList } from './entity/entity-list';
import type { EntityConfig } from '@/models/entity';

interface EntityLayoutProps<T> {
  mode?: 'list' | 'detail' | 'new';
  config: EntityConfig<T>;
  data: T[];
  detail: React.ReactNode;
}

export function EntityLayout<T>({
  mode = 'list',
  config,
  data,
  detail,
}: EntityLayoutProps<T>): React.ReactElement {
  return (
    <div className="flex gap-4 items-start">
      <EntityList<T> config={config} data={data} mode={mode} />
      <div className="flex-grow">
        <div className="w-full">{detail}</div>
      </div>
    </div>
  );
}
