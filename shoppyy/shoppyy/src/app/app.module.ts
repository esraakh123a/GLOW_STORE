import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

import { NavbarComponent } from './components/navbar/navbar.component';

import { HeroComponent } from './components/hero/hero.component';

import { CategoriesComponent } from './components/categories/categories.component';

import { ProductCardComponent } from './components/product-card/product-card.component';

import { FeaturedProductsComponent } from './components/featured-products/featured-products.component';

import { FooterComponent } from './components/footer/footer.component';

import { HomeComponent } from './pages/home/home.component';

import { ProductsComponent } from './pages/products/products.component';

import { ProductDetailsComponent } from './pages/product-details/product-details.component';

import { CartComponent } from './pages/cart/cart.component';

import { AboutComponent } from './pages/about/about.component';

import { ContactComponent } from './pages/contact/contact.component';

import { LoginComponent } from './components/login/login.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RegisterComponent } from './components/register/register.component';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from './interceptors/interceptor';

import { CheckoutComponent } from './components/checkout/checkout.component';

import { RouterModule } from '@angular/router';

import { FavoriteComponent } from './components/favorite/favorite.component';

import { AdminProductComponent } from './components/admin-product/admin-product.component';

import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';

import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';

import { AdminCustomersComponent } from './components/admin-customers/admin-customers.component';
import { AdminMassegesComponent } from './components/admin-masseges/admin-masseges.component';


@NgModule({

  declarations: [

    AppComponent,

    NavbarComponent,

    HeroComponent,

    CategoriesComponent,

    ProductCardComponent,

    FeaturedProductsComponent,

    FooterComponent,

    HomeComponent,

    ProductsComponent,

    ProductDetailsComponent,

    CartComponent,

    AboutComponent,

    ContactComponent,

    LoginComponent,

    RegisterComponent,

    CheckoutComponent,

    FavoriteComponent,

    AdminProductComponent,

    AdminOrdersComponent,

    AdminDashboardComponent,

    AdminCustomersComponent,
     AdminMassegesComponent

  ],

  imports: [

    BrowserModule,

    AppRoutingModule,

    ReactiveFormsModule,

    HttpClientModule,

    RouterModule,

    FormsModule

  ],

  providers: [

    {

      provide: HTTP_INTERCEPTORS,

      useClass: AuthInterceptor,

      multi: true

    }

  ],

  bootstrap: [AppComponent]

})

export class AppModule { }