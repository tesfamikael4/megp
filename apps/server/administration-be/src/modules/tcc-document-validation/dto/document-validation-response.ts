import { Expose, Type } from 'class-transformer';
import { DocumentData } from './document-data';

export class Category {
  @Expose({ name: 'ClassId' })
  classId: number;
  @Expose({ name: 'ClassName' })
  className: string;
  @Expose({ name: 'DocSubClassId' })
  docSubClassId: number;
  @Expose({ name: 'DocSubClassName' })
  docSubClassName: string;
}
export class DocumentValidationResponse {
  @Type(() => DocumentData)
  @Expose({ name: 'DocumentData' })
  documentData: DocumentData;
  @Type(() => Category)
  @Expose({ name: 'Category' })
  category: Category;
  @Expose({ name: 'OnlineCopyUrl' })
  onlineCopyUrl: string;
  @Expose({ name: 'ValidationCode' })
  validationCode: number;
  @Expose({ name: 'DocumentAsBase64Json' })
  documentAsBase64Json: string;
}
