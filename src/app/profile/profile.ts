import { Component, signal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { UserModel } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {

  protected activeUser = signal<UserModel | null>(null)
  
  constructor(router: Router){
    if(!UserService.hasAuth()) {
      localStorage.setItem(UserService.TO_KEY, '/profile')
      router.navigateByUrl('/login')
      return
    }

    this.activeUser.set(UserService.getActiveUser())
  }
}
