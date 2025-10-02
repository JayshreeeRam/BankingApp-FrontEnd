import { Component, OnInit } from '@angular/core';
import { SalaryDisbursementService } from '../../services/salary-disbursement.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentStatus } from '../../Enum/PaymentStatus 1';
@Component({
  selector: 'app-salary-disbursement',
  standalone:true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./salary-disbursement-component.css'],
  templateUrl: './salary-disbursement-component.html',
})
export class SalaryDisbursementComponent implements OnInit {
  activeTab: 'all' | 'pending' | 'batch' = 'all';

  allSalaries: any[] = [];
  pendingSalaries: any[] = [];
  batchSalaries: any[] = [];
  batchId: number | null = null;

  constructor(private salaryService: SalaryDisbursementService) {}

  ngOnInit() {
    this.loadAllSalaries();
  }

  setActiveTab(tab: 'all' | 'pending' | 'batch') {
    this.activeTab = tab;

    if (tab === 'all') {
      this.loadAllSalaries();
    } else if (tab === 'pending') {
      this.loadPendingSalaries();
    } else if (tab === 'batch' && this.batchId) {
      this.loadBatchSalaries();
    }
  }

  loadAllSalaries() {
    this.salaryService.getAllSalaryDisbursements().subscribe(salaries => {
      this.allSalaries = salaries;
      console.log('All Salaries:', this.allSalaries); // Debug log
    });
  }

  loadPendingSalaries() {
  this.salaryService.getAllSalaryDisbursements().subscribe(salaries => {
    this.pendingSalaries = salaries.filter(s => s.status === 'Pending');
  });
}


  loadBatchSalaries() {
  if (!this.batchId) {
    alert('Please enter a batch ID');
    return;
  }

  this.salaryService.getAllSalaryDisbursements().subscribe({
    next: (salaries:any) => {
      this.batchSalaries = salaries.filter((s: any)  => s.batchId === this.batchId);
      if (this.batchSalaries.length === 0) {
        alert(`No salaries found for Batch ID ${this.batchId}`);
      }
    },
    error: (err:any) => {
      console.error('Failed to fetch salaries', err);
      alert('Something went wrong while loading salaries.');
    }
  });
}


  approveSalary(id: number) {
    console.log('Approving salary with id:', id);
  if (!id) {
    alert('Invalid salary ID');
    return;
  }
    this.salaryService.approveSalary(id).subscribe(() => {
      alert('Salary approved');
      this.loadPendingSalaries();
    });
  }
  

rejectSalary(id: number) {
  const salary = this.pendingSalaries.find(s => s.disbursementId === id);
  if (!salary) {
    alert('Salary disbursement not found!');
    return;
  }

  const updatedSalary = {
    disbursementId: salary.disbursementId,
    employeeId: salary.employeeId,
    clientId: salary.clientId,
    amount: salary.amount,
    date: salary.date,
    status: 'Rejected',
    batchId: salary.batchId
  };

  this.salaryService.updateSalaryDisbursement(id, updatedSalary).subscribe({
    next: () => {
      this.pendingSalaries = this.pendingSalaries.filter(s => s.disbursementId !== id);
      alert(`Salary disbursement ${id} has been rejected.`);
    },
    error: (err) => {
      console.error('Failed to reject salary:', err);
      alert('Failed to reject salary disbursement. Please try again.');
    }
  });
}


disburseAllBatchSalaries() {
    if (!this.batchId) {
      alert('Enter batch ID first');
      return;
    }

    this.salaryService.approveSalaryByBatch(this.batchId).subscribe(() => {
      alert('All salaries in batch disbursed');
      this.loadBatchSalaries();
    });
  }
}
