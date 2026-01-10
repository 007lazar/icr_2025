import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Utils } from './utils';
import { MessageModel } from '../models/message.model';
import { RasaService } from '../services/rasa.service';
import { FormsModule } from "@angular/forms";
import { MovieService } from '../services/movie.service';
import { MovieModel } from '../models/movie.model';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected year = new Date().getFullYear()
  protected waitingForResponse: boolean = false;
  protected botThinkingPlaceholder: string = 'Thinking...'
  protected isChatVisible: boolean = false
  protected userMessage: string = ''
  protected messages: MessageModel[] = []

  constructor(private router: Router, private utils: Utils) {
    this.messages.push({
      type: 'bot',
      text: 'How can i help you?'
    })
  }

  toggleChat() {
    this.isChatVisible = !this.isChatVisible
  }

  async sendUserMessage() {
    if (this.waitingForResponse) return

    const trimmedMessage = this.userMessage.trim()
    this.userMessage = ''

    this.messages.push({
      type: 'user',
      text: trimmedMessage
    })
    this.messages.push({
      type: 'bot',
      text: this.botThinkingPlaceholder
    })

    RasaService.sendMessage(trimmedMessage).then(rsp => {
      if (rsp.data.length == 0) {
        this.messages.push({
          type: 'bot',
          text: "Sorry, i didn't understand your question!"
        })
        return
      }

      for (let botMsg of rsp.data) {
        if (botMsg.attachment != null) {
          // Returns movie list
          if (botMsg.attachment.type == 'movie_list' && Array.isArray(botMsg.attachment.data)) {

            let html = ''
            for (let movie of botMsg.attachment.data as MovieModel[]) {
              html += `<ul class="list-unstyled">`
              html += `<li>Title: ${movie.title}</li>`
              html += `<li>Director: ${movie.director.name}</li>`
              html += `<li>Genres: ${movie.movieGenres.map(mg => mg.genre.name)}</li>`
              html += `<li>Actors: ${movie.movieActors.map(ma => ma.actor.name)}</li>`
              html += `</ul>`
              html += `<p>${movie.shortDescription}</p>`
            }

            this.messages.push({
              type: 'bot',
              text: html
            })
          }

          // Simple object list (actor, director, genre)
          if (botMsg.attachment.type == 'genre_list' || botMsg.attachment.type == 'actor_list' || botMsg.attachment.type == 'director_list') {

            let html = ''
            for (let obj of botMsg.attachment.data) {
              html += `<ul class="list-unstyled p-0">`
              html += `<li>${obj.name}</li>`
              html += `</ul>`
            }

            this.messages.push({
              type: 'bot',
              text: html
            })
          }


          this.messages.push({
            type: 'bot',
            text: botMsg.text
          })
        }
      }


      this.messages = this.messages.filter(m => {
        if (m.type === 'bot') {
          return m.text != this.botThinkingPlaceholder
        }
        return true
      })
    })


    // Primer bez Rase
    // Lokalno u Typescriptu
    // if (trimmedMessage.includes('all movie')) {
    //   await this.createBotResponseAsMovieList()
    //   return
    // }

    // if (trimmedMessage.includes('movie detail')) {
    //   const query = trimmedMessage.split('movie detail')[0].trim();
    //   const movies = await MovieService.getMovies(query)

    //   if (movies.data.length > 0) {
    //     const movie = movies.data[0]
    //     let html = `<ul class="list-unstyled">`
    //     html += `<li>Title: ${movie.title}</li>`
    //     html += `<li>Director: ${movie.director.name}</li>`
    //     html += `<li>Genres: ${movie.movieGenres.map(mg => mg.genre.name)}</li>`
    //     html += `<li>Actors: ${movie.movieActors.map(ma => ma.actor.name)}</li>`
    //     html += `</ul>`
    //     html += `<p>${movie.shortDescription}</p>`
    //     this.messages.push({
    //       type: 'bot',
    //       text: html
    //     })
    //   } else {
    //     this.messages.push({
    //       type: 'bot',
    //       text: 'Sorry, there is no selected movie'
    //     })
    //   }

    //   this.removeBotPlaceholder()
    //   return
    // }

    // const genres = await MovieService.getGenres()
    // if (trimmedMessage.includes('genre list')) {
    //   let html = `<ul class="list-unstyled">`
    //   genres.data.map(g => `<li>${g.name}</li>`)
    //     .forEach(g => html += g)
    //   html += `</ul>`

    //   this.messages.push({
    //     type: 'bot',
    //     text: html
    //   })
    //   this.removeBotPlaceholder()
    //   return
    // }

    // // Napravi odgovor bota bas za sve zanrove da vrati film
    // for (let g of genres.data) {
    //   if (trimmedMessage.includes('genre ' + g.name.toLowerCase()) || trimmedMessage.includes(g.name.toLowerCase() + ' genre')) {
    //     await this.createBotResponseAsMovieList(g.genreId)
    //     return
    //   }
    // }

    // this.removeBotPlaceholder()
    // this.messages.push({
    //   type: 'bot',
    //   text: 'Seams like i cant help you with that!'
    // })
  }

  async createBotResponseAsMovieList(genre: number = 0) {
    const movies = await MovieService.getMovies('', genre)

    let html = `<ul class="list-unstyled">`
    movies.data.map(m => `<li><a href="movie/${m.shortUrl}">${m.title} ${m.director.name}</a></li>`)
      .forEach(m => html += m)
    html += `</ul>`

    this.messages.push({
      type: 'bot',
      text: html
    })
    this.removeBotPlaceholder()
  }

  removeBotPlaceholder() {
    this.messages = this.messages.filter(m => {
      if (m.type === 'bot') {
        return m.text != this.botThinkingPlaceholder
      }
      return true
    })
  }

  getUserName() {
    const user = UserService.getActiveUser()
    return `${user.firstName} ${user.lastName}`
  }

  hasAuth() {
    return UserService.hasAuth()
  }

  doLogout() {
    this.utils.showDialog(
      "Are you sure u want to log out?", () => {
        UserService.logout()
        this.router.navigateByUrl('/login')
      },
      `Don't Logout`,
      "Logout Now"
    )
  }


}
