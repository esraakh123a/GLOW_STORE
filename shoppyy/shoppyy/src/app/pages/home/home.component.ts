
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProductsService } from 'src/app/services/products.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: any[] = [];
  loading = true;
  errorMessage = '';

  constructor(
    private productsService: ProductsService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.productsService.getProducts().subscribe({
      next: (res: any) => {
        const allProducts = res.products || [];

        // اعرضي حتى 4 منتجات متاحة في قسم Featured Products
        this.products = allProducts
          .filter((product: any) => product.stock > 0)
          .slice(0, 4);

        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading home products:', err);
        this.errorMessage = 'Unable to load products. Please try again.';
        this.loading = false;
      }
    });
  }

  getImageUrl(image: string): string {
    if (!image) {
      return 'assets/images/placeholder.png';
    }

    if (image.startsWith('http://') || image.startsWith('https://')) {
      return image;
    }

    return `http://localhost:5000${image.startsWith('/') ? '' : '/'}${image}`;
  }

  getFinalPrice(product: any): number {
    const price = Number(product.price) || 0;
    const discount = Number(product.discount) || 0;

    return Math.round(price - (price * discount / 100));
  }

  openProduct(productId: string): void {
    this.router.navigate(['/product-details', productId]);
  }

  addToCart(event: Event, product: any): void {
    event.stopPropagation();

    if (!localStorage.getItem('token')) {
      this.router.navigate(['/login']);
      return;
    }

    if (!product?._id || product.stock <= 0) {
      return;
    }

    this.cartService.addToCart(product._id, 1).subscribe({
      next: () => {
        alert('Product added to your cart ❤️');
      },
      error: (err) => {
        console.error('Error adding product to cart:', err);

        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          alert(err.error?.message || 'Could not add product to cart.');
        }
      }
    });
  }
}

