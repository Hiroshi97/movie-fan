import { Component, OnInit } from '@angular/core';
import { Movie } from '../model/movie';
import { MovieService } from '../shared/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  newArrivals: any[] = [];
  mostPopular: Movie[] = [];
  imgURL = 'https://image.tmdb.org/t/p/w500/';

  constructor(private movieService: MovieService) { }

  ngOnInit(): void {
    this.movieService.getNewMovies().subscribe((res)=> {
      this.newArrivals = res.splice(0,6)
    });
  }

}
