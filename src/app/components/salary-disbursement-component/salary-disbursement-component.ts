import { Component, OnInit } from '@angular/core';
import { SalaryDisbursementService } from '../../services/salary-disbursement.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  // Find the salary in pendingSalaries list by id
  const salary = this.pendingSalaries.find(s => s.disbursementId === id);

  if (salary) {
    // Change status locally to "Rejected"
    salary.status = 'Rejected';

    // Optionally, update the UI by removing it from pendingSalaries if you want
    this.pendingSalaries = this.pendingSalaries.filter(s => s.status === 'Pending');

    alert(`Salary disbursement ${id} has been rejected.`);
  } else {
    alert('Salary disbursement not found!');
  }
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
