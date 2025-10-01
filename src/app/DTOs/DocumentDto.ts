export enum DocumentType {
  PDF = 'PDF',
  DOCX = 'DOCX',
  IMAGE = 'IMAGE',
  // Add other document types as needed
}

export enum DocumentStatus {
  Pending = "Pending",
  Verified = "Verified",
  Rejected = "Rejected"
}


export class DocumentDto {
  documentId: number;
  fileName: string;
  filePath: string;
  uploadDate: Date;
  documentType: DocumentType;
  documentStatus: DocumentStatus;
  uploadedByUserId: number;
  uploadedByUsername?: string; // optional

  constructor(
    documentId: number,
    fileName: string,
    filePath: string,
    uploadDate: Date,
    documentType: DocumentType,
    documentStatus: DocumentStatus,
    uploadedByUserId: number,
    uploadedByUsername?: string
  ) {
    this.documentId = documentId;
    this.fileName = fileName;
    this.filePath = filePath;
    this.uploadDate = uploadDate;
    this.documentType = documentType;
    this.documentStatus = documentStatus;
    this.uploadedByUserId = uploadedByUserId;
    this.uploadedByUsername = uploadedByUsername;
  }
}
