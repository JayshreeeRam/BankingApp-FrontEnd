import { User } from "./User";  // Assuming User model is in user.model.ts
import { ReportType } from '../Enum/ReportType';  // Assuming ReportType enum is in report-type.enum.ts

export class Report {
    reportId: number;
    reportType: ReportType;
    generatedDate: Date;
    filePath?: string;
    generatedByUserId: number;
    generatedBy: User;

    constructor(
        reportId: number,
        reportType: ReportType,
        generatedDate: Date,
        filePath: string | undefined,
        generatedByUserId: number,
        generatedBy: User
    ) {
        this.reportId = reportId;
        this.reportType = reportType;
        this.generatedDate = generatedDate;
        this.filePath = filePath;
        this.generatedByUserId = generatedByUserId;
        this.generatedBy = generatedBy;
    }
}
