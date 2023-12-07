import { DocumentData } from './document-data';

export class DocumentValidationResponse {
  Category: {
    classId: number;
    className: string;
    docSubClassId: number;
    docSubClassName: string;
  };
  onlineCopyUrl: string;
  validationCode: number;
  documentData: DocumentData;
  documentAsBase64Json: string;
}
