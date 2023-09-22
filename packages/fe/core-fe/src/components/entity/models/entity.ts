export interface EntityConfig {
  entity: string;
  primaryKey?: string;
  canAdd?: boolean;
  addPath?: string;

  data?: any[];

  // UI
  title?: React.ReactElement | string;
  subTitle?: React.ReactElement | string;
}
