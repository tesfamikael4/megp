export interface Expression {
  id: string;
  name: string;
  formula: string;
  dependencies?: Expression[];
}
