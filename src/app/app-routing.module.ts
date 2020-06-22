import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MoviesComponent } from './item/movies/movies.component';
import { MovieDetailsComponent } from './item/movie-details/movie-details.component';
import { CartComponent } from './item/cart/cart.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { DashboardComponent } from './auth/dashboard/dashboard.component';
import { AuthGuardService } from './shared/auth-guard.service';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movies/:page', component: MoviesComponent },
  { path: 'movies/movie/:id', component: MovieDetailsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent},
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
