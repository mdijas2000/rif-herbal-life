import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MiniCartComponent } from "./components/mini-cart/mini-cart.component";
import { NotificationContainerComponent } from './components/notification-container/notification-container.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule, MiniCartComponent, NotificationContainerComponent, ConfirmDialogComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'RiF-Herbal-Life-Frontend';
  showMiniCart: boolean = true;

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.url.toLowerCase();
      this.showMiniCart = !url.includes('/login') && !url.includes('/edit') && !url.includes('/cart') && !url.includes('/admin');
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
