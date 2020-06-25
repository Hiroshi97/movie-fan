import { Component, OnInit, OnChanges, SimpleChanges, ChangeDetectionStrategy } from '@angular/core';
import { MovieService } from '../../shared/movie.service';
import { Movie } from '../../model/movie';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css'],
})
export class MoviesComponent implements OnInit {
  movies: Movie[] = [];
  imgURL = 'https://image.tmdb.org/t/p/w500/';
  page: number;
  term: string;

  constructor(
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.page = +params['page'];
    });
    this.getMovies(this.page);
    
    // refresh the component
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  /*
  *
  * GET A LIST OF MOVIES
  * 
  */

  getMovies(page: number): void {
    this.movieService.getMovies(page).subscribe((res: Movie[]) => {
      this.movies = res;
    });
  }


  /*
  *
  * PAGINATION
  * 
  */

  onPrevious(): void {
    this.page = +this.page - 1;
    this.onPage(this.page);
  }

  onNext(): void {
    this.page = +this.page + 1;
    this.onPage(this.page);
  }

  onPage(page: number): void {
    this.router.navigate(['../' + page], { relativeTo: this.route });
  }

  /*
  *
  * MISCELLANEOUS
  * 
  */
 getYear(date: string): string {
   return '(' + date.slice(0,4) + ')';
 }
}
