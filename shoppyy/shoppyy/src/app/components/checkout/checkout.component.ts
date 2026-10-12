import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit{

cart: any = null;

  loading: boolean = true;
  placingOrder: boolean = false;

  // Customer Data
  customerName: string = '';
  phone: string = '';
  alternativePhone: string = '';
  address: string = '';

  // Payment
  paymentMethod: string = 'cash';

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }


  // ===============================
  // Load Cart
  // ===============================

  loadCart(): void {

    this.loading = true;

    this.cartService.getCart().subscribe({

      next: (res) => {

        console.log('CHECKOUT CART:', res);

        this.cart = res.cart;

        this.loading = false;

      },

      error: (err) => {

        console.error('Error loading cart:', err);

        this.loading = false;

      }

    });

  }


  // ===============================
  // Place Order
  // ===============================

  placeOrder(): void {

    // Validate Customer Name
    if (!this.customerName.trim()) {

      alert('Please enter your name');

      return;

    }


    // Validate Phone
    if (!this.phone.trim()) {

      alert('Please enter your phone number');

      return;

    }


    // Validate Address
    if (!this.address.trim()) {

      alert('Please enter your address');

      return;

    }


    // Check Cart
    if (!this.cart || !this.cart.items?.length) {

      alert('Your cart is empty');

      return;

    }


    // Prevent double click
    this.placingOrder = true;


    // Data sent to backend
    const orderData = {

      customerName: this.customerName,

      phone: this.phone,

      alternativePhone: this.alternativePhone,

      address: this.address,

      paymentMethod: this.paymentMethod

    };


    console.log('ORDER DATA:', orderData);


    this.orderService.createOrder(orderData).subscribe({

      // ===============================
      // Success
      // ===============================

      next: (res) => {

        console.log('ORDER CREATED:', res);

        this.placingOrder = false;


        // Update navbar cart count
        this.cartService.updateCartCount(0);


        // Success Message
        alert('تمت عملية البيع بنجاح ❤️');


        // Go Home
        this.router.navigate(['/home']);

      },


      // ===============================
      // Error
      // ===============================

      error: (err) => {

        console.error('Error creating order:', err);

        this.placingOrder = false;


        alert(
          err.error?.message ||
          'حدث خطأ أثناء تأكيد الطلب'
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
