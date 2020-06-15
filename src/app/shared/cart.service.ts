import { Injectable } from '@angular/core';
import { ItemCart } from '../model/item-cart';
import { MovieInfo } from '../model/movie-info';
import { Observable, Subject, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartList: ItemCart[] = sessionStorage.getItem('cart') === null ? [] : JSON.parse(sessionStorage.getItem('cart'));
  cartListChanged = new Subject();

  constructor() {}

  addToCart(movie: MovieInfo, quantity: number, price: number): void {
    
    
    const checked = this.checkItem(movie.id)
    if (checked !== -1) {
      //Increase qty of the existing item
      this.cartList[checked].quantity += quantity;
    }
    else {
      //Add a new item to cart
      this.cartList.push( {
        product: movie,
        quantity: quantity,
        price: price
      });
    }
    sessionStorage.setItem('cart', JSON.stringify(this.cartList));
    this.cartListChanged.next(this.cartList);
  }

  checkItem(id: number): number {
    let result = -1;
    this.cartList.some(item => {
      if (item.product.id === id) {
        result = this.cartList.indexOf(item);
        return true;
      }
    });
    return result;
  }

  getCartList(): ItemCart[] {
    return this.cartList;
  }

  getCartListChanged(): Observable<any>{
    return this.cartListChanged;
  }

  updateCart(id: number, quantity?:number, price?:number): void {

  }

  updateCartQty(id: number, quantity:number): void {
    //Check if the item existed.
    const index = this.checkItem(id);
    
    if(index !== -1 && quantity) {
      this.cartList[index].quantity = quantity;
      sessionStorage.setItem('cart', JSON.stringify(this.cartList));
      this.cartListChanged.next(this.cartList)
    }
  }

  clearCart(): void {
    this.cartList = [];
    sessionStorage.clear();
    this.cartListChanged.next(this.cartList);
  }
  
}
