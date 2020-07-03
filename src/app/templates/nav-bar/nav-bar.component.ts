import { Component, OnInit, OnChanges } from '@angular/core';
import { CartService } from '../../shared/cart.service';
import { tap } from 'rxjs/operators';
import { ItemCart } from '../../model/item-cart';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  page: number;
  numberOfItemCart: number = 0;
  isLogin: boolean = sessionStorage.getItem('key') ? true : false;

  constructor(private cartService: CartService, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.page = 1;

    this.authService.user.subscribe(user => {this.isLogin = user ? true : false;});

    this.cartService.getCartListChanged().subscribe((cart: ItemCart[]) => {
      this.numberOfItemCart = cart.reduce((sum, item) => sum + item.quantity, 0);
    });
    
  }

  onLogout() {
    this.authService.logoutUser();
    this.cartService.clearCart();
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
}
