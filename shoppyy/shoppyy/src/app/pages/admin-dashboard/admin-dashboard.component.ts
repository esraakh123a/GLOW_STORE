import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  // ===============================
  // Dashboard Statistics
  // ===============================

  stats: any = {
    totalProducts: 0,
    totalCustomers: 0,
    totalOrders: 0,
    pendingOrders: 0,
    unreadMessages: 0,
    totalSales: 0
  };

  // ===============================
  // Recent Orders
  // ===============================

  recentOrders: any[] = [];

  // ===============================
  // Sales Overview
  // ===============================

  salesData: any[] = [];

  // ===============================
  // Loading
  // ===============================

  loading: boolean = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  // ===============================
  // Load Dashboard
  // ===============================

  loadDashboard(): void {

    this.loading = true;

    // Dashboard Statistics
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
      },
      error: (error) => {
        console.error('Error loading dashboard stats:', error);
      }
    });

    // Recent Orders
    this.adminService.getRecentOrders().subscribe({
      next: (data) => {
        this.recentOrders = data.orders;
      },
      error: (error) => {
        console.error('Error loading recent orders:', error);
      }
    });

    // Sales Overview
    this.adminService.getSalesOverview().subscribe({
      next: (data) => {
        this.salesData = data.sales;
      },
      error: (error) => {
        console.error('Error loading sales overview:', error);
      },
      complete: () => {
        this.loading = false;
      }
    });

  }

}

