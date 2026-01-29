import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { AddProductComponent } from './components/add-product/add-product.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { MiniCartComponent } from './components/mini-cart/mini-cart.component';
import { CartComponent } from './components/cart/cart.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { adminGuard } from './guards/admin.guard';
import { UserOrdersComponent } from './components/user-orders/user-orders.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';



export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },

    { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [AuthGuard, adminGuard] },

    { path: 'add', component: AddProductComponent, canActivate: [AuthGuard, adminGuard] },
    { path: 'edit/:id', component: EditProductComponent, canActivate: [AuthGuard, adminGuard] },
    { path: 'products', component: ProductListComponent },
    { path: 'product/:id', component: ProductDetailsComponent },
    { path: 'cart', component: CartComponent },
    { path: 'my-orders', component: UserOrdersComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'home' },
];
