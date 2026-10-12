
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { FavoriteService } from 'src/app/services/favorite.service';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  isMenuOpen = false;

  isLoggedIn = false;
  isAdmin = false;

  cartCount = 0;
  favoriteCount = 0;

  // Account menu
  isProfileOpen = false;

  // Search
  isSearchOpen = false;
  searchTerm = '';
  searchResults: any[] = [];
  allProducts: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private cartService: CartService,
    private favoriteService: FavoriteService,
    private productService: ProductsService
  ) {}

  ngOnInit(): void {

    // ================= LOGIN STATUS =================

    this.authService.loggedIn$.subscribe(status => {

      this.isLoggedIn = status;

      if (status) {

        // Check if current user is admin
        this.checkAdmin();

        // Load favorites count
        this.favoriteService.loadFavoriteCount();

      } else {

        this.isAdmin = false;
        this.favoriteCount = 0;
        this.isProfileOpen = false;

      }

    });


    // ================= CART COUNT =================

    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });


    // ================= FAVORITE COUNT =================

    this.favoriteService.favoriteCount$.subscribe(count => {
      this.favoriteCount = count;
    });


    // ================= LOAD PRODUCTS FOR SEARCH =================

    this.productService.getProducts().subscribe({
      next: (res) => {

        this.allProducts = res.products || [];

      },

      error: (err) => {

        console.error(
          'Error loading products for search:',
          err
        );

      }
    });

  }


  // ================= CHECK ADMIN =================

  checkAdmin(): void {

    const token = localStorage.getItem('token');

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


  // ================= MOBILE MENU =================

  toggleMenu(): void {

    this.isMenuOpen = !this.isMenuOpen;

  }


  closeMenu(): void {

    this.isMenuOpen = false;

  }


  // ================= ACCOUNT MENU =================

  toggleProfile(): void {

    this.isProfileOpen = !this.isProfileOpen;

  }


  // ================= SEARCH =================

  toggleSearch(): void {

    this.isSearchOpen = !this.isSearchOpen;

    if (!this.isSearchOpen) {

      this.clearSearch();

    }

  }


  clearSearch(): void {

    this.searchTerm = '';
    this.searchResults = [];

  }


  onSearch(): void {

    const term = this.searchTerm.trim().toLowerCase();

    if (!term) {

      this.searchResults = [];
      return;

    }

    this.searchResults = this.allProducts
      .filter(product =>
        product.name?.toLowerCase().includes(term)
      )
      .slice(0, 5);

  }


  goToProduct(productId: string): void {

    this.searchTerm = '';
    this.searchResults = [];
    this.isSearchOpen = false;

    this.router.navigate([
      '/product-details',
      productId
    ]);

  }


  // ================= CLOSE SEARCH / ACCOUNT =================
  // لما ندوس في أي مكان خارج البحث أو الـ Account

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {

    const target = event.target as HTMLElement;

    // لو الضغط مش جوه Search
    if (!target.closest('.nav-search')) {

      this.isSearchOpen = false;
      this.clearSearch();

    }

    // لو الضغط مش جوه Account
    if (!target.closest('.profile-wrapper')) {

      this.isProfileOpen = false;

    }

  }
  
goToDashboard(): void {

  this.isProfileOpen = false;

  this.router.navigate(['/admin-dashboard']);

}




  // ================= LOGOUT =================

  logout(): void {

    this.authService.logout();

    this.isAdmin = false;
    this.favoriteCount = 0;

    this.isProfileOpen = false;
    this.isSearchOpen = false;

    this.clearSearch();

    this.closeMenu();

    this.router.navigate(['/login']);

  }

}

