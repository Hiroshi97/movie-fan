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
  countries : any[];
  phoneCode: string;
  selectedCountry: string;
  dob = new Date().toISOString().split('T')[0];

  constructor(private authService: AuthService, private cartService: CartService, private router: Router) { }
  
  ngOnInit(): void {
    this.authService.getCountryList().subscribe(countries => {this.countries = countries; this.selectedCountry = this.countries[0].name; this.phoneCode = this.countries[0].dial_code;});
  }

  getCountry(name: string): void {
    this.countries.some(country =>{ 
      if(country.name === name) {
        this.phoneCode = country.dial_code;
        this.selectedCountry = country;
        return true;
      }
    })
  }

  onSignup(form: NgForm) {
    this.errorMsg = this.validateSignup(form);
    
    if(this.errorMsg.length === 0) {
      const details = {
        username: form.value.username,
        dob: this.dob,
        nationality: this.selectedCountry['name'],
        phone: this.phoneCode + form.value.phone,
        email: form.value.email,
        countryCode: this.selectedCountry['code']
      };

      this.authService.createNewUser(form.value.email, form.value.password, details).subscribe(
      res => {
        sessionStorage.setItem('key', JSON.stringify(res.localId));
        this.router.navigate(['/']);
      },
      error => {
        this.errorMsg = error.error.error.message;
      });
    }
  }

  validateSignup(form: NgForm): string {
    if (form.invalid) {
      return "Please fill in all required field";
    }

    if (form.value.password !== form.value.confirmPassword){
      return "Confirm password does not match";
    }

    if (form.value.username.length < 5) {
      return "Username's length must have 5 characters or more";
    }

    if (+(new Date().getFullYear()) - +(this.dob.slice( 0,4)) < 18) {
      return "You must be over 18 years old to register an account";
    }

    return '';
  }

}