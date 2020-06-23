import { Injectable } from '@angular/core';
import { Subject, ReplaySubject, of, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { User } from '../model/user';
import { AuthRes } from '../model/auth-res';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiKey = "AIzaSyAO5u_zbJFpkgAVwWhg8iWy6MKP_L0KcbM";
  private signupURL = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";
  private loginURL = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";
  
  user = new ReplaySubject<User>();
  loggedIn = false;

  constructor(private http: HttpClient) { }

  createNewUser(email: string, password: string) {
    return this.http.post<AuthRes>(this.signupURL + this.apiKey, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(
      tap(res => {
        const currentUser = {
          idToken: res.idToken,
          email: res.email,
          refreshToken: res.refreshToken,
          expiresIn: res.expiresIn,
          localId: res.localId
        };
        this.user.next(currentUser);
      }));
  }

  loginUser(email: string, password: string) {
    return this.http.post<AuthRes>(this.loginURL + this.apiKey, {
      email: email,
      password: password,
      returnSecureToken: true
    }).pipe(
      tap(res => {
        const currentUser = {
          idToken: res.idToken,
          email: res.email,
          refreshToken: res.refreshToken,
          expiresIn: res.expiresIn,
          localId: res.localId
        };
        this.user.next(currentUser);
      }));
  }

  logoutUser() {
    this.user.next(null);
  }

  checkCurrentUser() : boolean {
    return sessionStorage.getItem('key') && this.user ? true : false;
  }
}
