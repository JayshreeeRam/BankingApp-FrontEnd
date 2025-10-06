import { Component, OnInit } from '@angular/core';
import { SalaryDisbursementService } from '../../services/salary-disbursement.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentStatus } from '../../Enum/PaymentStatus 1';

@Component({
  selector: 'app-salary-disbursement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./salary-disbursement-component.css'],
  templateUrl: './salary-disbursement-component.html',
})
export class SalaryDisbursementComponent implements OnInit {
  activeTab: 'all' | 'pending' | 'batch' = 'all';

  allSalaries: any[] = [];
  pendingSalaries: any[] = [];
  batchSalaries: any[] = [];
  departments: string[] = []; 

  // ⚡ Changed from number → string
  // batchId: string | null = null;
  selectedBatchId: string | null = null;

  // Pagination Variables
  currentPage: number = 1; // Current page
  itemsPerPage: number = 5; // Items per page

  constructor(private salaryService: SalaryDisbursementService) {}

  ngOnInit() {
    this.loadAllSalaries();
    this.loadDepartments(); 
  }

  setActiveTab(tab: 'all' | 'pending' | 'batch') {
    this.activeTab = tab;

    if (tab === 'all') {
      this.loadAllSalaries();
    } else if (tab === 'pending') {
      this.loadPendingSalaries();
    } else if (tab === 'batch' && this.selectedBatchId) {
      this.loadBatchSalaries();
    }
  }

  loadAllSalaries() {
    this.salaryService.getAllSalaryDisbursements().subscribe(salaries => {
      this.allSalaries = salaries;
      console.log('All Salaries:', this.allSalaries);
    });
  }

  loadPendingSalaries() {
    this.salaryService.getAllSalaryDisbursements().subscribe(salaries => {
      this.pendingSalaries = salaries.filter(s => s.status === 'Pending');
    });
  }

  loadDepartments() {
  this.salaryService.getAllSalaryDisbursements().subscribe(salaries => {
    this.departments = Array.from(new Set(salaries.map(s => s.batchId))); // unique departments
  });
}

 loadBatchSalaries() {
  if (!this.selectedBatchId) {
    alert('Please select a department');
    return;
  }

  this.salaryService.getAllSalaryDisbursements().subscribe({
    next: (salaries: any) => {
      this.batchSalaries = salaries.filter((s: any) => s.batchId === this.selectedBatchId && s.status === 'Pending');
      if (this.batchSalaries.length === 0) {
        alert(`No salaries found for Department: ${this.selectedBatchId}`);
      }
    },
    error: (err: any) => {
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
    if (!this.selectedBatchId) {
      alert('Select department first');
      return;
    }

    this.salaryService.approveSalaryByBatch(this.selectedBatchId).subscribe({
      next: (approvedSalaries: any) => {
        alert(`Successfully disbursed ${approvedSalaries.length} salaries for department: ${this.selectedBatchId}`);
        this.loadBatchSalaries();
        this.loadAllSalaries();
        this.loadPendingSalaries();
      },
      error: (err) => {
        alert(err.error || 'Failed to disburse department salaries');
      }
    });
  }

  // Pagination Logic for each section (All, Pending, Batch)
  getPaginatedSalaries(salaries: any[]) {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return salaries.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Calculate total pages for pagination
  getTotalPages(salaries: any[]) {
    return Math.ceil(salaries.length / this.itemsPerPage);
  }

  // Paginate Salaries based on Active Tab
  paginateSalaries(tab: 'all' | 'pending' | 'batch') {
    if (tab === 'all') {
      this.getPaginatedSalaries(this.allSalaries);
    } else if (tab === 'pending') {
      this.getPaginatedSalaries(this.pendingSalaries);
    } else if (tab === 'batch') {
      this.getPaginatedSalaries(this.batchSalaries);
    }
  }

  // Go to the next page
  nextPage() {
    if (this.currentPage < this.getTotalPages(this.getSalariesByTab())) {
      this.currentPage++;
    }
  }

  // Go to the previous page
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Helper method to get the correct salaries based on active tab
  getSalariesByTab() {
    if (this.activeTab === 'all') {
      return this.allSalaries;
    } else if (this.activeTab === 'pending') {
      return this.pendingSalaries;
    } else if (this.activeTab === 'batch') {
      return this.batchSalaries;
    }
    return [];
  }
}
  

