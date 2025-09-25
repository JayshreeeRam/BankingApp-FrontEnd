export enum DocumentType {
  PDF = 'PDF',
  DOCX = 'DOCX',
  IMAGE = 'IMAGE',
  OTHER = 'OTHER',
  // Add other document types as needed
}

export class DocumentUploadDto {
  file: File | null; // File object from the browser (similar to IFormFile in .NET)
  userId: number;
  documentType: DocumentType;

  constructor(file: File | null, userId: number, documentType: DocumentType = DocumentType.OTHER) {
    this.file = file;
    this.userId = userId;
    this.documentType = documentType;
  }
}
