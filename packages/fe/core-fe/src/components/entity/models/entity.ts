export interface EntityConfig {
  entity: string;
  primaryKey?: string;
  canAdd?: boolean;
  addPath?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any[];

  // UI
  title?: React.ReactElement;
  subTitle?: React.ReactElement;
}
