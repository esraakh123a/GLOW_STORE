import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductsComponent } from './pages/products/products.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { CartComponent } from './pages/cart/cart.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { FavoriteComponent } from './components/favorite/favorite.component';
import { adminGuard } from '../guards/admin.guard';
import { AdminProductComponent } from './components/admin-product/admin-product.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { AdminCustomersComponent } from './components/admin-customers/admin-customers.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminMassegesComponent } from './components/admin-masseges/admin-masseges.component';

const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'products',
    component: ProductsComponent
  },
  {
    path: 'product-details/:id',
    component: ProductDetailsComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'contact',
    component: ContactComponent
  },
 
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'cart',
    component: CartComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'favorite',
    component: FavoriteComponent
  },
  
{
  path: 'admin-dashboard',
  component: AdminDashboardComponent,
  canActivate: [adminGuard]
},
{
  path: 'admin-products',
  component: AdminProductComponent,
  canActivate: [adminGuard]
},  
{
  path: 'admin-orders',
  component: AdminOrdersComponent,
  canActivate: [adminGuard]
},
{
  path: 'admin-customers',
  component: AdminCustomersComponent,
  canActivate: [adminGuard]
},
{
  path: 'admin-messages',
  component: AdminMassegesComponent,
  canActivate: [adminGuard]
},
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
