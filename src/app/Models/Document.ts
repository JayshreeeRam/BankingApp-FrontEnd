import { DocumentStatus } from '../Enum/DocumentStatus 1';
import { DocumentType} from '../Enum/DocumentType';  // Assuming enums are in enums.ts
import { User } from './User';  // Assuming User model is in user.model.ts

export class Document {
    documentId: number;
    fileName: string;
    filePath: string;
    uploadDate: Date;
    documentType: DocumentType;
    documentStatus: DocumentStatus;
    uploadedByUserId: number;
    uploadedBy: User; // Relationship with User model

    constructor(
        documentId: number,
        fileName: string,
        filePath: string,
        uploadDate: Date,
        documentType: DocumentType,
        documentStatus: DocumentStatus,
        uploadedByUserId: number,
        uploadedBy: User
    ) {
        this.documentId = documentId;
        this.fileName = fileName;
        this.filePath = filePath;
        this.uploadDate = uploadDate;
        this.documentType = documentType;
        this.documentStatus = documentStatus;
        this.uploadedByUserId = uploadedByUserId;
        this.uploadedBy = uploadedBy;
    }
}
