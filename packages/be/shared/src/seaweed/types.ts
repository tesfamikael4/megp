export type FileInfo = {
  bucketName: string;
  filepath?: string;
  contentType: string;
  originalname: string;
};

export abstract class S3 {
  abstract presignedPutObject(
    bucketName: string,
    objectName: string,
    contentType: string,
    duration: number,
  ): Promise<string>;

  abstract presignedGetObject(
    bucketName: string,
    objectName: string,
    contentType: string,
    duration: number,
  ): Promise<string>;

  abstract deleteObject(bucketName: string, objectName: string): Promise<void>;

  abstract getObject(bucketName: string, objectName: string): Promise<Buffer>;

  abstract putObject(
    bucketName: string,
    objectName: string,
    data: any,
  ): Promise<void>;
}
