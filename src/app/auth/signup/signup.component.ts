import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../shared/auth.service';
import { CartService } from '../../shared/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  errorMsg: string = '';
  constructor(private authService: AuthService, private cartService: CartService, private router: Router) { }

  ngOnInit(): void {
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      this.errorMsg = "Error";
    }
    else if (form.value.password !== form.value.confirmPassword){
      this.errorMsg = "Wrong confirm password";
      console.log(form.value.checkbox);
    }
    else {
      console.log(form.value.checkbox);
      this.authService.createNewUser(form.value.email, form.value.password).subscribe(
      res => {
        sessionStorage.setItem('key', JSON.stringify(res.localId));
        this.router.navigate(['/']);
      },
      error => {
        this.errorMsg = error.error.error.message;
        console.log(error);
      });
    }
  }

}
