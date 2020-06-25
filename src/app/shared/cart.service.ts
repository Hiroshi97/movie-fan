import { Injectable } from '@angular/core';
import { ItemCart } from '../model/item-cart';
import { MovieInfo } from '../model/movie-info';
import { Observable, Subject, from, ReplaySubject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ifError } from 'assert';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartList: ItemCart[];
  //cartList: ItemCart[] = sessionStorage.getItem('cart') === null ? [] : JSON.parse(sessionStorage.getItem('cart'));
  cartListChanged = new ReplaySubject<ItemCart[]>();
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
      if (this.authService.checkCurrentUser()) {
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

  fetchCartList(): ItemCart[] {
    return this.getCartJSON();
  }

  getCartListChanged(): Observable<any>{
    this.cartList = this.fetchCartList();
    return this.cartListChanged;
  }

  getCartJSON(): ItemCart[] {
    this.cartList = sessionStorage.getItem('cart') === null ? [] : JSON.parse(sessionStorage.getItem('cart'));
    this.cartListChanged.next(this.cartList);

    //if user logged in
    if (this.authService.checkCurrentUser() ) {
      if (this.cartList.length > 0) {
        this.updateCartJSON();
      }
      else {
      const link = this.projectURL + sessionStorage.getItem('key').replace(/"/gi, '') + ".json";
      this.http.get<ItemCart[]>(link).toPromise().then((res) => {
        if(res) {
            this.cartList = res['cart'];
            sessionStorage.setItem('cart', JSON.stringify(this.cartList));
          }
          this.cartListChanged.next(this.cartList);
        })
      } 
    }
    return this.cartList;
  }

  updateCartJSON(): void {
    //if user logged in
    if (this.authService.checkCurrentUser()) {
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
    if (onPurpose) this.updateCartJSON(); //false - log out && true - clear button
    sessionStorage.setItem('cart', JSON.stringify(this.cartList));
    this.cartListChanged.next(this.cartList);
  }

  getTotalPrice(): Observable<number> {
    if (this.cartList)
      return of(this.cartList.reduce((sum, item) => sum + (item.quantity * item.price), 0));
    else return of(0);
  }

  getTotalQty(): Observable<number> {
    if (this.cartList)
      return of(this.cartList.reduce((sum, item) => sum + item.quantity, 0));
    else return of(0);
  }
}
