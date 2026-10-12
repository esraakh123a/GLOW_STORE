import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cart: any = null;
  loading: boolean = true;

  constructor(private cartService: CartService) {}

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

        console.log('CART RESPONSE:', res);

        this.cart = res.cart;

        // Update navbar cart count
        this.updateNavbarCount();

        this.loading = false;

      },

      error: (err) => {

        console.error('Error loading cart:', err);

        this.loading = false;

      }

    });

  }

  // ===============================
  // Get Product ID
  // ===============================
  getProductId(item: any): string | null {

    // IMPORTANT:
    // We need the Product ID, NOT the Cart ID

    return item?.product?._id || null;

  }

  // ===============================
  // Increase Quantity
  // ===============================
  increaseQuantity(item: any): void {

    const productId = this.getProductId(item);

    if (!productId) {

      console.error('Product ID not found:', item);

      return;

    }

    const newQuantity = item.quantity + 1;

    // Check stock
    if (
      item.product?.stock &&
      newQuantity > item.product.stock
    ) {

      alert('Not enough stock');

      return;

    }

    this.cartService.updateCartItem(
      productId,
      newQuantity
    ).subscribe({

      next: (res) => {

        console.log('Quantity updated:', res);

        // Reload cart so we get:
        // populated product
        // finalPrice
        // itemTotal
        // totalPrice

        this.loadCart();

      },

      error: (err) => {

        console.error('Error updating quantity:', err);

        if (err.status === 400) {

          alert(
            err.error?.message || 'Not enough stock'
          );

        } else if (err.status === 404) {

          alert(
            err.error?.message || 'Product not found in cart'
          );

        }

      }

    });

  }

  // ===============================
  // Decrease Quantity
  // ===============================
  decreaseQuantity(item: any): void {

    if (item.quantity <= 1) {

      return;

    }

    const productId = this.getProductId(item);

    if (!productId) {

      console.error('Product ID not found:', item);

      return;

    }

    const newQuantity = item.quantity - 1;

    this.cartService.updateCartItem(
      productId,
      newQuantity
    ).subscribe({

      next: (res) => {

        console.log('Quantity updated:', res);

        // Reload cart
        this.loadCart();

      },

      error: (err) => {

        console.error('Error updating quantity:', err);

      }

    });

  }

  // ===============================
  // Remove Item
  // ===============================
  removeItem(productId: string): void {

    if (!productId) {

      console.error('Product ID is missing');

      return;

    }

    this.cartService.removeFromCart(productId).subscribe({

      next: (res) => {

        console.log('Item removed:', res);

        // Reload cart
        this.loadCart();

      },

      error: (err) => {

        console.error('Error removing item:', err);

      }

    });

  }

  // ===============================
  // Update Navbar Cart Count
  // ===============================
  updateNavbarCount(): void {

    const totalItems =
      this.cart?.items?.reduce(
        (total: number, item: any) =>
          total + item.quantity,
        0
      ) || 0;

    this.cartService.updateCartCount(totalItems);

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