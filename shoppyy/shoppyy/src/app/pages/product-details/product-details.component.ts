
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CartService } from 'src/app/services/cart.service';
import { ProductsService } from 'src/app/services/products.service';
import { FavoriteService } from 'src/app/services/favorite.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: any = null;

  quantity: number = 1;

  // هل المنتج موجود في المفضلة؟
  isFavorite: boolean = false;

  // هل المستخدم Admin؟
  isAdmin: boolean = false;

  constructor(
    private productService: ProductsService,
    private route: ActivatedRoute,
    private cartService: CartService,
    private favoriteService: FavoriteService,
    private router: Router
  ) {}

  ngOnInit(): void {

    // ===============================
    // Check Admin
    // ===============================

    this.checkAdmin();

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {

      this.productService.getProductById(id).subscribe({

        next: (res) => {

          console.log('Product Details:', res);

          this.product = res.product;

          // المستخدم العادي فقط هو اللي نتحقق من Favorite بتاعه
          if (!this.isAdmin) {
            this.checkFavorite();
          }

        },

        error: (err) => {

          console.error('Error loading product:', err);

        }

      });

    }

  }


  // ===============================
  // Check Admin
  // ===============================

  checkAdmin(): void {

    const token = localStorage.getItem('token');

    // مفيش Login
    if (!token) {

      this.isAdmin = false;

      return;

    }

    try {

      const payload = JSON.parse(
        atob(
          token
            .split('.')[1]
            .replace(/-/g, '+')
            .replace(/_/g, '/')
        )
      );

      this.isAdmin = payload.role === 'admin';

    } catch (error) {

      this.isAdmin = false;

    }

  }


  // ===============================
  // Check Favorite
  // ===============================

  checkFavorite(): void {

    this.favoriteService.getFavorites().subscribe({

      next: (res) => {

        console.log('Favorites:', res);

        const favorites = res.favorites || [];

        this.isFavorite = favorites.some(
          (product: any) =>
            product._id === this.product?._id
        );

      },

      error: (err) => {

        console.error('Error loading favorites:', err);

        if (err.status === 401) {

          this.isFavorite = false;

        }

      }

    });

  }


  // ===============================
  // Toggle Favorite
  // ===============================

  toggleFavorite(): void {

    // Admin لا يستخدم Favorites
    if (this.isAdmin) {
      return;
    }

    if (!this.product) {
      return;
    }

    const productId = this.product._id;

    // Remove

    if (this.isFavorite) {
      this.favoriteService.removeFromFavorites(productId).subscribe({
    next: (res) => {
      this.isFavorite = false;

      // Update navbar favorites count
      this.favoriteService.loadFavoriteCount();
    },
    error: (err) => {
      console.error('Error removing favorite:', err);

      if (err.status === 401) {
        alert('Please login first ❤️');
      }
    }
  });
}



    // Add
    else {

      this.favoriteService
        .addToFavorites(productId)
        .subscribe({

          next: (res) => {

            console.log('Added to favorites:', res);

            this.isFavorite = true;
            // Update navbar favorites count
            this.favoriteService.loadFavoriteCount();

          },

          error: (err) => {

            console.error(
              'Error adding favorite:',
              err
            );

            if (err.status === 401) {

              alert('Please login first ❤️');

            } else {

              alert(
                err.error?.message ||
                'Something went wrong'
              );

            }

          }

        });

    }

  }


  // ===============================
  // Quantity
  // ===============================

  increaseQuantity(): void {

    if (
      this.product &&
      this.quantity < this.product.stock
    ) {

      this.quantity++;

    }

  }


  decreaseQuantity(): void {

    if (this.quantity > 1) {

      this.quantity--;

    }

  }


  // ===============================
  // Final Price
  // ===============================

  get finalPrice(): number {

    if (!this.product) {

      return 0;

    }

    const discount = this.product.discount || 0;

    return Math.round(
      this.product.price -
      (this.product.price * discount / 100)
    );

  }


  // ===============================
  // Add To Cart
  // ===============================

  addToCart(): void {

    // Admin cannot add products to cart
    if (this.isAdmin) {

      return;

    }

    if (
      !this.product ||
      this.product.stock === 0
    ) {

      return;

    }

    this.cartService
      .addToCart(
        this.product._id,
        this.quantity
      )
      .subscribe({

        next: (res) => {

          console.log(
            'Added to cart:',
            res
          );

          this.router.navigate(['/cart']);

        },

        error: (err) => {

          console.error(
            'Error adding to cart:',
            err
          );

          if (err.status === 401) {

            alert('Please login first');

          } else {

            alert('Something went wrong');

          }

        }

      });

  }


  // ===============================
  // Product Image
  // ===============================

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

