export enum DocumentType {
  PDF = 'PDF',
  DOCX = 'DOCX',
  IMAGE = 'IMAGE',
  OTHER = 'OTHER',
  
}

export class DocumentUploadDto {
  file: File | null; 
  userId: number;
  documentType: DocumentType;

  constructor(file: File | null, userId: number, documentType: DocumentType = DocumentType.OTHER) {
    this.file = file;
    this.userId = userId;
    this.documentType = documentType;
  }
}
