import { Routes } from '@angular/router';
// layouts
import { GeneralLayoutComponent } from './layouts/general-layout/general-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
// pages
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { RegisterPageComponent } from './pages/auth/register-page/register-page.component';
import { BookListPageComponent } from './pages/books/book-list-page/book-list-page.component';
import { BookDetailPageComponent } from './pages/books/book-detail-page/book-detail-page.component';
import { CartPageComponent } from './pages/cart/cart-page.component';
import { OrderHistoryPageComponent } from './pages/orders/order-history-page/order-history-page.component';
import { DashboardPageComponent } from './pages/dashboard/dashboard-page/dashboard-page.component';
import { AddBookPageComponent } from './pages/dashboard/add-book-page/add-book-page.component';
import { UpdateBookPageComponent } from './pages/dashboard/update-book-page/update-book-page.component';
import { NotFoundPageComponent } from './pages/not-found/not-found-page.component';
// guards
import { IsAdminGuard } from './core/guards/is-admin.guard';
import { OrdersHistoryPageComponent } from './pages/orders/orders-history-page/orders-history-page/orders-history-page.component';
import { IsLoggedGuard } from './core/guards/is-logged.guard';
import { resolveTitle } from './features/books/book-detail/book-detail.component';

export const routes: Routes = [
  {
    path: '',
    component: GeneralLayoutComponent,
    children: [
      { path: '', redirectTo: 'books', pathMatch: 'full' },
      {
        path: 'login',
        component: LoginPageComponent,
        title: 'Log in!',
        canActivate: [IsLoggedGuard],
      },
      {
        path: 'register',
        component: RegisterPageComponent,
        title: 'Register!',
        canActivate: [IsLoggedGuard],
      },
      {
        path: 'books',
        component: BookListPageComponent,
        title: 'Book Nook! - Choose your favourite book...',
      },
      {
        path: 'books/:bookId',
        component: BookDetailPageComponent,
        title: resolveTitle,
      },
      {
        path: 'cart',
        component: CartPageComponent,
        title: 'Your cart!',
        canActivate: [IsLoggedGuard],
      },
      {
        path: 'order/history',
        component: OrdersHistoryPageComponent,
        title: 'History!',
        canActivate: [IsLoggedGuard],
      },
      {
        path: 'order/history/:orderId',
        component: OrderHistoryPageComponent,
        title: 'History!',
        canActivate: [IsLoggedGuard],
      },
    ],
  },
  {
    path: 'dashboard',
    component: AdminLayoutComponent,
    title: 'Dashboard!',
    canActivate: [IsAdminGuard],
    children: [
      { path: '', component: DashboardPageComponent },
      {
        path: 'add-book',
        component: AddBookPageComponent,
        title: 'Add a book!',
      },
      {
        path: 'update-book/:bookId',
        component: UpdateBookPageComponent,
        title: 'Update a book!',
      },
      {
        path: 'manage-books',
        component: BookListPageComponent,
        title: 'Manage books!',
      },
    ],
  },
  {
    path: '**',
    component: GeneralLayoutComponent,
    title: 'Not found 404!',
    children: [{ path: '', component: NotFoundPageComponent }],
  },
];
