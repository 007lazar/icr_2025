import { Component, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MovieModel } from '../../models/movie.model';
import { MovieService } from '../../services/movie.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-reservation',
  imports: [RouterLink],
  templateUrl: './reservation.html',
  styleUrl: './reservation.css',
})
export class Reservation {
  protected movie = signal<MovieModel | null>(null)

  constructor(private route: ActivatedRoute, router: Router) {
    this.route.params.subscribe(p => {
      if (p['path']) {
        const shortUrl = p['path']
        if (!UserService.hasAuth()) {
          localStorage.setItem(UserService.TO_KEY, `/movie/${shortUrl}/reservation`)
          router.navigateByUrl('/login')
          return
        }

        MovieService.getMovieByPermalink(p['path'])
          .then(rsp => this.movie.set(rsp.data))
      }
    })
  }
}
