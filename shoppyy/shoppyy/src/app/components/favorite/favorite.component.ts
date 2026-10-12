
import { Component, OnInit } from '@angular/core';

import { FavoriteService } from 'src/app/services/favorite.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {

  // ===============================
  // Favorites
  // ===============================

  favorites: any[] = [];

  loading = true;


  constructor(
    private favoriteService: FavoriteService,
    private cartService: CartService
  ) {}


  ngOnInit(): void {

    this.loadFavorites();

  }


  // ===============================
  // Load Favorites
  // ===============================

  loadFavorites(): void {

    this.loading = true;


    this.favoriteService.getFavorites().subscribe({

      next: (res) => {

        console.log(
          'Favorites:',
          res
        );


        this.favorites =
          res.favorites || [];


        this.loading = false;

      },


      error: (err) => {

        console.error(
          'Error loading favorites:',
          err
        );


        this.loading = false;


        if (err.status === 401) {

          alert(
            'Please login first ❤️'
          );

        }

      }

    });

  }


  // ===============================
  // Remove Favorite
  // ===============================

  removeFavorite(productId: string): void {

    this.favoriteService
      .removeFromFavorites(productId)
      .subscribe({

        next: (res) => {

          console.log(
            'Removed:',
            res
          );


          // Remove from page

          this.favorites =
            this.favorites.filter(
              product =>
                product._id !== productId
            );


          // Update Navbar Count

          this.favoriteService
            .loadFavoriteCount();

        },


        error: (err) => {

          console.error(
            'Error removing favorite:',
            err
          );


          if (err.status === 401) {

            alert(
              'Please login first ❤️'
            );

          } else {

            alert(
              err.error?.message ||
              'Something went wrong'
            );

          }

        }

      });

  }


  // ===============================
  // Add To Cart
  // ===============================

  addToCart(productId: string): void {

    this.cartService
      .addToCart(productId, 1)
      .subscribe({

        next: (res) => {

          console.log(
            'Added to cart:',
            res
          );


          alert(
            'Product added to cart 🛒'
          );

        },


        error: (err) => {

          console.error(
            'Error adding to cart:',
            err
          );


          if (err.status === 401) {

            alert(
              'Please login first ❤️'
            );

          } else {

            alert(
              err.error?.message ||
              'Something went wrong'
            );

          }

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

