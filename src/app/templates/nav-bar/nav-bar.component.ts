import { Component, OnInit, OnChanges } from '@angular/core';
import { CartService } from '../../shared/cart.service';
import { tap } from 'rxjs/operators';
import { ItemCart } from '../../model/item-cart';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css'],
})
export class NavBarComponent implements OnInit {
  page: number;
  numberOfItemCart: number;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.page = 1;

    this.numberOfItemCart = this.cartService.getCartList().length;

    this.cartService.getCartListChanged().subscribe((cart: ItemCart[]) => {
      if (cart) { this.numberOfItemCart = cart.length; }});
    
  }
}
