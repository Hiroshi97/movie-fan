import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Movie } from '../model/movie';
import { MovieInfo } from '../model/movie-info';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private _apiKey = '?api_key=02d2da2237b14cc72fe66e6a3c677785&language=en-US';

  constructor(private http: HttpClient) {}

  getMovies(page: number): Observable<Movie[]> {
    const urlList = 'https://api.themoviedb.org/3/discover/movie' + this._apiKey + '&sort_by=popularity.desc&include_adult=false&include_video=false&year=2020';
    return this.http.get(urlList + '&page=' + page).pipe(
      map((res) => res['results']),
      map((res) => {
        return res.map((data) => {
          return {
            id: data['id'],
            name: data['title'],
            poster: data['poster_path'],
            rate: data['vote_average'],
            date: data['release_date'],
          };
        });
      })
    );
  }

  getMovieDetails(id: number): Observable<MovieInfo> {
    
    const url = 'https://api.themoviedb.org/3/movie/' + id.toString() + this._apiKey;
    return this.http.get(url).pipe(
      map(res => {
      return {
        id: res['id'],
        name: res['title'],
        poster: res['poster_path'],
        rate: res['vote_average'],
        genres: res['genres'],
        overview: res['overview'],
        date: res['release_date'].split("-").reverse().join("-"),
        runtime: res['runtime']
      };
    }));
  }
}
