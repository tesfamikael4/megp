export interface ProcurementMechanism extends PRMechanisms {
  id: string;
  tenderId: string;
  invitationType: 'direct' | 'limited' | 'open';
  stageType: 'single' | 'multiple';
  marketApproach: 'local' | 'national' | 'international';
  stage: number;
}
// ::todo add pr mechanisem model from pr
export interface PRMechanisms {
  id: string;
}
