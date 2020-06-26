import { Component, OnInit, PlatformRef, ViewChild } from '@angular/core';
import { MovieService } from '../../shared/movie.service';
import { MovieInfo } from '../../model/movie-info';
import { ActivatedRoute, Router } from '@angular/router';
import {Location} from '@angular/common';
import { CartService } from '../../shared/cart.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  movie: MovieInfo;
  imgURL = 'https://image.tmdb.org/t/p/original/';

  constructor(private movieService: MovieService, private route: ActivatedRoute, private router: Router, private location: Location, private cartService: CartService) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.getMovieDetails(id);
  }

  getMovieDetails(id: number): void {
    this.movieService.getMovieDetails(id).subscribe(movie => this.movie = movie);
  }

  getStarRating(rate: number): number { 
    return rate / 2;
  }

  onBack() {
    this.location.back();
  }

  addItemCart(movie: MovieInfo, quantity: number): void {
    let price = +movie.date.slice(6) > 2019 ? 10.99 : 5.99;
    this.cartService.addToCart(movie, quantity, price);
  }

}
