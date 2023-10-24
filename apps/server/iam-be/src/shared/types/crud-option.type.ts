export type RelationCrudOptions = {
  firstEntityIdName: string;
  firstInclude: string;

  secondEntityIdName: string;
  secondInclude: string;
};

export type ExtraCrudOptions = {
  entityIdName: string;
};

export type RelationObjectCrudOptions = {
  firstEntityIdName: string;
  firstInclude: string;

  secondEntityIdName: string;
  secondInclude: string;
  object: any;
};
