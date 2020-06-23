import { Component, OnInit } from '@angular/core';
import { AuthRes } from '../../model/auth-res';
import { AuthService } from '../../shared/auth.service';
import { CartService } from '../../shared/cart.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  errorMsg: string = '';
  constructor(private authService: AuthService, private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
  }

  onLogin(form: NgForm) {
    if (form.invalid) {
      this.errorMsg = "Error";
    }
    else {
      this.authService.loginUser(form.value.email, form.value.password).subscribe(
        res => {
          sessionStorage.setItem('key', JSON.stringify(res.localId));
          this.cartService.fetchCartList();
          this.router.navigate(['/movies/1']);
        },
        error => {
          this.errorMsg = error.error.error.message;
          console.log(error);
        })
    }
  }
}
