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
    this.cartList = this.cartService.getCartList();
    this.cartService.getCartListChanged().subscribe( cart => {
      this.cartList = cart;
    })
  }

  getTotalPrice(): number {
    if (this.cartList)
      return this.cartList.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    return 0;
  }

  getTotalQuantity(): number {
    if (this.cartList)
      return this.cartList.reduce((sum, item) => sum + item.quantity, 0)
    return 0;
  }

  getPoster(path: string): string {
    return this.imgURL + path;
  }

  changeQuantity(id: number, quantity: number) : void{
    this.cartService.updateCartQty(+id, +quantity);
  }

  deleteItem(id: number): void {
    this.cartService.deleteItem(+id);
  }

  onClear(): void {
    this.cartList = [];
    this.cartService.clearCart();
  }

  
}
