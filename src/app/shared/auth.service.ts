import { Injectable } from '@angular/core';
import { ReplaySubject, of, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { User } from '../model/user';
import { AuthRes } from '../model/auth-res';
import { CountryCodes } from '../model/country-codes';
import { UserInfo } from '../model/user-info';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiKey = "AIzaSyAO5u_zbJFpkgAVwWhg8iWy6MKP_L0KcbM";
  private signupURL = "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=";
  private loginURL = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";
  

  user = new ReplaySubject<User>();
  userInfo = new ReplaySubject<UserInfo>();

  constructor(private http: HttpClient) { }

  /*
  *
  * SIGN UP
  * 
  */
  createNewUser(email: string, password: string, details: any) {
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
        this.setUserDetails(details, res.localId);
      }));
  }

  getCountryList() {
    return of(CountryCodes);
  }

  setUserDetails(details: any, localId: string) {
    const link = "https://moviefan-b1801.firebaseio.com/users/" + localId + "-details.json";
    this.http.patch(link, JSON.stringify({details: details})).toPromise();
  } 

  /*
  *
  * LOG IN
  * 
  */

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

  /*
  *
  * GET USER INFORMATION
  * 
  */
 getUserInfo(): Observable<UserInfo> {
  
  const link = "https://moviefan-b1801.firebaseio.com/users/" + sessionStorage.getItem('key').replace(/"/gi, '') + "-details.json";
  this.http.get(link).toPromise().then((res)=> {
    let info: UserInfo;
    if(res) {
      
      info = res['details'];

    }
    else info = null;
    this.userInfo.next(info)
  });
  return this.userInfo;
 }

  
}
