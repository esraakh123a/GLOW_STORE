import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin-masseges',
  templateUrl: './admin-masseges.component.html',
  styleUrls: ['./admin-masseges.component.css']
})
export class AdminMassegesComponent implements OnInit {




  messages: any[] = [];
  filteredMessages: any[] = [];

  loading: boolean = true;
  errorMessage: string = '';

  searchTerm: string = '';

  activeFilter: string = 'all';

  selectedMessage: any = null;
  showMessageModal: boolean = false;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  // ===============================
  // Load Messages
  // ===============================

  loadMessages(): void {
    this.loading = true;
    this.errorMessage = '';

    this.adminService.getMessages().subscribe({
      next: (response: any) => {

        this.messages = response.messages || [];

        this.applyFilters();

        this.loading = false;
      },

      error: (error: any) => {

        console.error('Error loading messages:', error);

        this.messages = [];
        this.filteredMessages = [];

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Failed to load messages.';
      }
    });
  }

  // ===============================
  // Search
  // ===============================

  searchMessages(): void {
    this.applyFilters();
  }

  // ===============================
  // Filters
  // ===============================

  setFilter(filter: string): void {
    this.activeFilter = filter;

    this.applyFilters();
  }

  applyFilters(): void {

    let result = [...this.messages];

    // Status filter
    if (this.activeFilter === 'unread') {
      result = result.filter(
        (message: any) => message.status === 'unread'
      );
    }

    if (this.activeFilter === 'read') {
      result = result.filter(
        (message: any) => message.status === 'read'
      );
    }

    // Search filter
    const term = this.searchTerm.toLowerCase().trim();

    if (term) {
      result = result.filter((message: any) =>
        message.name?.toLowerCase().includes(term) ||
        message.email?.toLowerCase().includes(term) ||
        message.subject?.toLowerCase().includes(term) ||
        message.message?.toLowerCase().includes(term)
      );
    }

    this.filteredMessages = result;
  }

  // ===============================
  // Statistics
  // ===============================

  getTotalMessages(): number {
    return this.messages.length;
  }

  getUnreadMessages(): number {
    return this.messages.filter(
      (message: any) => message.status === 'unread'
    ).length;
  }

  getTodayMessages(): number {

    const today = new Date();

    return this.messages.filter((message: any) => {

      if (!message.createdAt) {
        return false;
      }

      const date = new Date(message.createdAt);

      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );

    }).length;
  }

  // ===============================
  // Open Message
  // ===============================

  openMessage(message: any): void {

    this.selectedMessage = message;
    this.showMessageModal = true;

    // Mark as read if unread
    if (message.status === 'unread') {
      this.markAsRead(message);
    }
  }

  // ===============================
  // Mark As Read
  // ===============================

  markAsRead(message: any): void {

    if (!message?._id) {
      return;
    }

    this.adminService.markMessageAsRead(message._id).subscribe({
      next: (response: any) => {

        message.status = 'read';

        if (this.selectedMessage?._id === message._id) {
          this.selectedMessage.status = 'read';
        }

        this.applyFilters();
      },

      error: (error: any) => {
        console.error('Error marking message as read:', error);
      }
    });
  }

  // ===============================
  // Close Modal
  // ===============================

  closeMessage(): void {
    this.showMessageModal = false;
    this.selectedMessage = null;
  }

  // ===============================
  // Refresh
  // ===============================

  refreshMessages(): void {
    this.loadMessages();
  }

  // ===============================
  // Initial
  // ===============================

  getCustomerInitial(name: string): string {

    if (!name) {
      return '?';
    }

    return name.charAt(0).toUpperCase();
  }

  // ===============================
  // Format Date
  // ===============================

  formatDate(date: string): string {

    if (!date) {
      return '-';
    }

    return new Date(date).toLocaleDateString('en-GB');
  }

  // ===============================
  // Format Time
  // ===============================

  formatTime(date: string): string {

    if (!date) {
      return '';
    }

    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // ===============================
  // Short Message
  // ===============================

  getShortMessage(message: string): string {

    if (!message) {
      return '';
    }

    if (message.length <= 70) {
      return message;
    }

    return message.substring(0, 70) + '...';
  }
}

