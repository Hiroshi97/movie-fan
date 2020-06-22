import { Injectable } from '@angular/core';
import { ItemCart } from '../model/item-cart';
import { MovieInfo } from '../model/movie-info';
import { Observable, Subject, from } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ifError } from 'assert';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartList: ItemCart[] = sessionStorage.getItem('cart') === null ? [] : JSON.parse(sessionStorage.getItem('cart'));
  cartListChanged = new Subject();
  private projectURL = "https://moviefan-b1801.firebaseio.com/users/";
  
  constructor(private http:HttpClient, private authService: AuthService) {}

  addToCart(movie: MovieInfo, quantity: number, price: number): void {
    
    
    const checked = this.checkItem(movie.id)
    if (checked !== -1) {
      //Increase qty of the existing item
      this.cartList[checked].quantity += quantity;
      this.updateCartJSON();
    }
    else {
      //Add a new item to cart
      this.cartList.push( {
        product: movie,
        quantity: quantity,
        price: price
      });
      if (this.authService.isCurrentUserExisted()) {
        this.updateCartJSON();
      }
     
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
    return this.getCartJSON();
  }

  getCartListChanged(): Observable<any>{
    return this.cartListChanged;
  }

  getCartJSON(): ItemCart[] {
    if (this.authService.isCurrentUserExisted()) {
      const link = this.projectURL + sessionStorage.getItem('key').replace(/"/gi, '') + ".json";
      this.http.get(link).toPromise().then((res) => {
        if(res) {
          this.cartList = res['cart'];
          sessionStorage.setItem('cart', JSON.stringify(this.cartList));
          this.cartListChanged.next(this.cartList);
        }
      });
    }
    return this.cartList;
  }

  updateCartJSON(): void {
    if (this.authService.isCurrentUserExisted()) {
      const link = this.projectURL + sessionStorage.getItem('key').replace(/"/gi, '') + ".json";
      this.http.patch(link, JSON.stringify({cart: this.cartList})).toPromise();
    }
  }

  updateCartQty(id: number, quantity:number): void {
    //Check if the item existed.
    const index = this.checkItem(id);
    if(index !== -1 && quantity > 0) {
      this.cartList[index].quantity = quantity;
      this.updateCartJSON();
      sessionStorage.setItem('cart', JSON.stringify(this.cartList));
      this.cartListChanged.next(this.cartList)
    }
  }

  removeItem(id: number) {
    const index = this.checkItem(id);
    if(index !== -1) {
      this.cartList = this.cartList.filter(item => item.product.id !== id);
      this.updateCartJSON();
      sessionStorage.setItem('cart', JSON.stringify(this.cartList));
      this.cartListChanged.next(this.cartList);
    }
  }

  clearCart(onPurpose : boolean = false): void {
    this.cartList = [];
    if (onPurpose) this.updateCartJSON();
    sessionStorage.setItem('cart', JSON.stringify(this.cartList));
    this.cartListChanged.next(this.cartList);
  }
  
}
