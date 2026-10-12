import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent implements OnInit {

  orders: any[] = [];
  filteredOrders: any[] = [];

  loading: boolean = true;
  errorMessage: string = '';

  // Current filter
  activeFilter: string = 'active';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  // =========================================
  // LOAD ORDERS
  // =========================================

  loadOrders(): void {

    this.loading = true;
    this.errorMessage = '';

    this.adminService.getAllOrders().subscribe({

      next: (response) => {

        console.log('Orders response:', response);

        this.orders = response.orders || [];

        this.applyFilter();

        this.loading = false;

      },

      error: (error) => {

        console.error('Error loading orders:', error);

        this.orders = [];
        this.filteredOrders = [];

        this.loading = false;

        this.errorMessage =
          error?.error?.message ||
          'Failed to load orders.';

      }

    });
  }


  // =========================================
  // FILTER
  // =========================================

  setFilter(filter: string): void {

    this.activeFilter = filter;

    this.applyFilter();

  }


  applyFilter(): void {

    switch (this.activeFilter) {

      case 'active':

        this.filteredOrders = this.orders.filter(
          order =>
            order.orderStatus !== 'delivered' &&
            order.orderStatus !== 'cancelled'
        );

        break;


      case 'pending':

        this.filteredOrders = this.orders.filter(
          order => order.orderStatus === 'pending'
        );

        break;


      case 'confirmed':

        this.filteredOrders = this.orders.filter(
          order => order.orderStatus === 'confirmed'
        );

        break;


      case 'shipped':

        this.filteredOrders = this.orders.filter(
          order => order.orderStatus === 'shipped'
        );

        break;


      case 'delivered':

        this.filteredOrders = this.orders.filter(
          order => order.orderStatus === 'delivered'
        );

        break;


      case 'cancelled':

        this.filteredOrders = this.orders.filter(
          order => order.orderStatus === 'cancelled'
        );

        break;


      default:

        this.filteredOrders = [...this.orders];

    }

  }


  // =========================================
  // STATISTICS
  // =========================================

  getPendingOrdersCount(): number {

    return this.orders.filter(
      order => order.orderStatus === 'pending'
    ).length;

  }


  getConfirmedOrdersCount(): number {

    return this.orders.filter(
      order => order.orderStatus === 'confirmed'
    ).length;

  }


  getShippedOrdersCount(): number {

    return this.orders.filter(
      order => order.orderStatus === 'shipped'
    ).length;

  }


  getDeliveredOrdersCount(): number {

    return this.orders.filter(
      order => order.orderStatus === 'delivered'
    ).length;

  }


  getCancelledOrdersCount(): number {

    return this.orders.filter(
      order => order.orderStatus === 'cancelled'
    ).length;

  }


  getActiveOrdersCount(): number {

    return this.orders.filter(
      order =>
        order.orderStatus !== 'delivered' &&
        order.orderStatus !== 'cancelled'
    ).length;

  }


  // =========================================
  // THIS MONTH
  // =========================================

  getThisMonthOrdersCount(): number {

    const now = new Date();

    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return this.orders.filter(order => {

      const date = new Date(order.createdAt);

      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );

    }).length;

  }


  // =========================================
  // LAST MONTH
  // =========================================

  getLastMonthOrdersCount(): number {

    const now = new Date();

    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const lastMonthDate = new Date(
      currentYear,
      currentMonth - 1,
      1
    );

    const lastMonth =
      lastMonthDate.getMonth();

    const lastMonthYear =
      lastMonthDate.getFullYear();

    return this.orders.filter(order => {

      const date = new Date(order.createdAt);

      return (
        date.getMonth() === lastMonth &&
        date.getFullYear() === lastMonthYear
      );

    }).length;

  }


  // =========================================
  // MONTHLY CHANGE
  // =========================================

  getMonthlyChange(): number {

    const thisMonth =
      this.getThisMonthOrdersCount();

    const lastMonth =
      this.getLastMonthOrdersCount();


    if (lastMonth === 0) {

      if (thisMonth > 0) {
        return 100;
      }

      return 0;

    }


    return Math.round(
      ((thisMonth - lastMonth) / lastMonth) * 100
    );

  }


  // =========================================
  // PRODUCTS
  // =========================================

  getTotalItems(order: any): number {

    if (!order?.items) {
      return 0;
    }

    return order.items.reduce(
      (total: number, item: any) => {

        return total + (item.quantity || 0);

      },
      0
    );

  }


  getProductName(item: any): string {

    return item?.product?.name ||
           'Unknown Product';

  }


  getProductImage(item: any): string {

    return item?.product?.image || '';

  }


  getDisplayProducts(order: any): any[] {

    if (!order?.items) {
      return [];
    }

    return order.items.slice(0, 2);

  }


  // =========================================
  // DATE
  // =========================================

  formatDate(date: string): string {

    if (!date) {
      return '';
    }

    return new Date(date)
      .toLocaleDateString('en-GB');

  }


  // =========================================
  // STATUS
  // =========================================

  getStatusClass(status: string): string {

    switch (status) {

      case 'pending':
        return 'status-pending';

      case 'confirmed':
        return 'status-confirmed';

      case 'shipped':
        return 'status-shipped';

      case 'delivered':
        return 'status-delivered';

      case 'cancelled':
        return 'status-cancelled';

      default:
        return '';

    }

  }
  


  // =========================================
  // UPDATE STATUS
  // =========================================

  updateStatus(
    orderId: string,
    newStatus: string
  ): void {

    this.adminService
      .updateOrderStatus(orderId, newStatus)
      .subscribe({

        next: (response) => {

          console.log(
            'Order status updated:',
            response
          );


          const order =
            this.orders.find(
              item => item._id === orderId
            );


          if (order) {

            order.orderStatus =
              newStatus;

          }


          // Re-apply current filter

          this.applyFilter();

        },


        error: (error) => {

          console.error(
            'Error updating order status:',
            error
          );

          alert(
            error?.error?.message ||
            'Failed to update order status.'
          );

        }

      });


  }
  getImageUrl(image: string): string {
  if (!image) {
    return '';
  }

  if (
    image.startsWith('http://') ||
    image.startsWith('https://')
  ) {
    return image;
  }

  return `http://localhost:5000${image}`;
}

}
