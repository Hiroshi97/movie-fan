import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MoviesComponent } from './item/movies/movies.component';
import { MovieDetailsComponent } from './item/movie-details/movie-details.component';
import { CartComponent } from './item/cart/cart.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'movies/:page', component: MoviesComponent },
  { path: 'movies/movie/:id', component: MovieDetailsComponent },
  { path: 'cart', component: CartComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
