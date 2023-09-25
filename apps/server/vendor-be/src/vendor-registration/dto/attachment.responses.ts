// import { Attachment, AttachmentEntity } from '@apps/knowledgebase-help-center';
// import { ApiProperty } from '@nestjs/swagger';
// /**
// *A class which contains proporties of Attachment that used to put data to be returned to client
// *
// */
// export class AttachmentResponse {
//   @ApiProperty()
//   id: string;
//   @ApiProperty()
//   ownerId: string;
//   @ApiProperty()
//   title: string;
//   @ApiProperty()
//   attachmentUrl: string;
//   @ApiProperty()
//   fileType: string;
//   @ApiProperty()
//   createdAt: Date;
//   /**
//   *A Method which copy  Attachment Entity object Property value to  AttachmentResponse properties
//   */
//   static fromEntity(attachment: AttachmentEntity): AttachmentResponse {
//     const attachmentResponse = new AttachmentResponse();
//     attachmentResponse.id = attachment.id;
//     attachmentResponse.articleId = attachment.articleId;
//     attachmentResponse.title = attachment.title;
//     attachmentResponse.attachmentUrl = attachment.attachmentUrl;
//     attachmentResponse.fileType = attachment.fileType;
//     attachmentResponse.createdAt = attachment.createdAt;
//     return attachmentResponse;
//   }
//   /**
// *A Method which copy  Attachment domain object Property value to  AttachmentResponse properties
// */
//   static fromDomain(attachment: Attachment): AttachmentResponse {
//     const attachmentResponse = new AttachmentResponse();
//     attachmentResponse.id = attachment.id;
//     attachmentResponse.articleId = attachment.articleId;
//     attachmentResponse.title = attachment.title;
//     attachmentResponse.attachmentUrl = attachment.attachmentUrl;
//     attachmentResponse.fileType = attachment.fileType;
//     attachmentResponse.createdAt = attachment.createdAt;
//     return attachmentResponse;
//   }
// }
