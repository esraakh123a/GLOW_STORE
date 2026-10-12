
import { Component, OnInit } from '@angular/core';

import { ProductsService } from 'src/app/services/products.service';
import { FavoriteService } from 'src/app/services/favorite.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  // ===============================
  // Products
  // ===============================

  products: any[] = [];

  filteredProducts: any[] = [];


  // ===============================
  // Categories
  // ===============================

  categories: string[] = [];

  selectedCategory: string = 'All';


  // ===============================
  // Favorite IDs
  // ===============================

  favoriteIds: string[] = [];


  constructor(
    private productService: ProductsService,
    private favoriteService: FavoriteService
  ) {}


  ngOnInit(): void {

    // Load Products
    this.loadProducts();

    // Load Favorites
    this.loadFavorites();

  }


  // ===============================
  // Load Products
  // ===============================

  loadProducts(): void {

    this.productService.getProducts().subscribe({

      next: (res) => {

        console.log('Products:', res);

        this.products = res.products;

        this.filteredProducts = this.products;


        // Categories

        this.categories = [
          'All',
          'skincare',
          'makeup',
          'haircare'
        ];

      },

      error: (err) => {

        console.error(
          'Error loading products:',
          err
        );

      }

    });

  }


  // ===============================
  // Load Favorites
  // ===============================

  loadFavorites(): void {

    this.favoriteService.getFavorites().subscribe({

      next: (res) => {

        console.log('Favorites:', res);

        const favorites = res.favorites || [];


        this.favoriteIds = favorites.map(
          (product: any) => product._id
        );

      },

      error: (err) => {

        console.error(
          'Error loading favorites:',
          err
        );


        // User not logged in

        if (err.status === 401) {

          this.favoriteIds = [];

        }

      }

    });

  }


  // ===============================
  // Check Favorite
  // ===============================

  isFavorite(productId: string): boolean {

    return this.favoriteIds.includes(productId);

  }


  // ===============================
  // Toggle Favorite
  // ===============================

  toggleFavorite(product: any): void {

    const productId = product._id;


    // =================================
    // Remove From Favorites
    // =================================

    if (this.isFavorite(productId)) {

      this.favoriteService
        .removeFromFavorites(productId)
        .subscribe({

          next: (res) => {

            console.log(
              'Removed from favorites:',
              res
            );


            // Remove ID locally

            this.favoriteIds =
              this.favoriteIds.filter(
                id => id !== productId
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


    // =================================
    // Add To Favorites
    // =================================

    else {

      this.favoriteService
        .addToFavorites(productId)
        .subscribe({

          next: (res) => {

            console.log(
              'Added to favorites:',
              res
            );


            // Add ID locally

            this.favoriteIds.push(
              productId
            );


            // Update Navbar Count

            this.favoriteService
              .loadFavoriteCount();

          },


          error: (err) => {

            console.error(
              'Error adding favorite:',
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

  }


  // ===============================
  // Filter By Category
  // ===============================

  filterByCategory(category: string): void {

    this.selectedCategory = category;


    if (category === 'All') {

      this.filteredProducts =
        this.products;

    } else {

      this.filteredProducts =
        this.products.filter(
          product =>
            product.category === category
        );

    }

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





