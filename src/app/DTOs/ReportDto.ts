import { ReportType } from '../Enum/ReportType';  // Assuming ReportType is defined in the enums file

export class ReportDto {
  reportId: number;
  reportType: ReportType;
  generatedDate: Date;
  filePath?: string;
  generatedByUserId: number;
  generatedByUsername?: string;  

  constructor(
    reportId: number,
    reportType: ReportType,
    generatedDate: Date,
    generatedByUserId: number,
    generatedByUsername?: string,
    filePath?: string
  ) {
    this.reportId = reportId;
    this.reportType = reportType;
    this.generatedDate = generatedDate;
    this.generatedByUserId = generatedByUserId;
    this.generatedByUsername = generatedByUsername;
    this.filePath = filePath;
  }
}
