
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-customers',
  templateUrl: './admin-customers.component.html',
  styleUrls: ['./admin-customers.component.css'],
 
})
export class AdminCustomersComponent implements OnInit {

  customers: any[] = [];
  filteredCustomers: any[] = [];

  loading: boolean = true;
  errorMessage: string = '';

  searchTerm: string = '';

  constructor(
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  // ==========================================
  // LOAD CUSTOMERS
  // ==========================================

  loadCustomers(): void {

    this.loading = true;
    this.errorMessage = '';

    this.adminService.getCustomers().subscribe({

      next: (response: any) => {

        console.log('Customers response:', response);

        this.customers = response.customers || [];

        this.filteredCustomers = [...this.customers];

        this.loading = false;

      },

      error: (error: any) => {

        console.error('Error loading customers:', error);

        this.customers = [];
        this.filteredCustomers = [];

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Failed to load customers.';

      }

    });
  }

  // ==========================================
  // SEARCH CUSTOMERS
  // ==========================================

  searchCustomers(): void {

    const term = this.searchTerm
      .toLowerCase()
      .trim();

    if (!term) {

      this.filteredCustomers = [...this.customers];

      return;
    }

    this.filteredCustomers = this.customers.filter(
      (customer: any) =>

        customer.name?.toLowerCase().includes(term) ||

        customer.email?.toLowerCase().includes(term)
    );
  }

  // ==========================================
  // TOTAL CUSTOMERS
  // ==========================================

  getTotalCustomers(): number {

    return this.customers.length;

  }

  // ==========================================
  // NEW CUSTOMERS THIS MONTH
  // ==========================================

  getNewCustomersThisMonth(): number {

    const now = new Date();

    const currentMonth = now.getMonth();

    const currentYear = now.getFullYear();

    return this.customers.filter(
      (customer: any) => {

        const date = new Date(customer.createdAt);

        return (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );

      }
    ).length;
  }

  // ==========================================
  // CUSTOMER INITIAL
  // ==========================================

  getCustomerInitial(name: string): string {

    if (!name) {
      return '?';
    }

    return name
      .charAt(0)
      .toUpperCase();

  }

  // ==========================================
  // FORMAT DATE
  // ==========================================

  formatDate(date: string): string {

    if (!date) {
      return '-';
    }

    return new Date(date)
      .toLocaleDateString('en-GB');

  }

  // ==========================================
  // REFRESH
  // ==========================================

  refreshCustomers(): void {

    this.loadCustomers();

  }

}

