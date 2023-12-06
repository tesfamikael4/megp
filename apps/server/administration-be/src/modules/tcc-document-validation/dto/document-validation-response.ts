interface DocumentValidationResponse {
  Category: {
    ClassId: number;
    ClassName: string;
    DocSubClassId: number;
    DocSubClassName: string;
  };
  OnlineCopyUrl: string;
  ValidationCode: number;
  DocumentData: DocumentData;
  DocumentAsBase64Json: string;
}
