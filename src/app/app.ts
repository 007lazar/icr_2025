import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Utils } from './utils';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected year = new Date().getFullYear()

  constructor(private router: Router, private utils: Utils) { }

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
