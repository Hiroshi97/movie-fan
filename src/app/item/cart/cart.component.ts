import { Component, OnInit } from '@angular/core';
import { CartService } from '../../shared/cart.service';
import { ItemCart } from '../../model/item-cart';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartList: ItemCart[] = [];
  
  imgURL = 'https://image.tmdb.org/t/p/original/';

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.cartService.cartListChanged.subscribe( cart => {
      this.cartList = cart;
    })
  }

  getTotalPrice(): number {
    let totalPrice: number;
    this.cartService.getTotalPrice().subscribe(total =>  totalPrice = total);
    return totalPrice;
  }

  getPoster(path: string): string {
    return this.imgURL + path;
  }

  changeQuantity(id: number, quantity: number) : void{
    this.cartService.updateItemQty(+id, +quantity);
  }

  removeItem(id: number): void {
    this.cartService.removeItem(+id);
  }

  onClear(): void {
    this.cartService.clearCart(true);
  }

  
}
