import { UserModel } from '../models/user.model';

export class UserService {
  public static USER_KEY = 'icr_users'
  public static ACTIVE_KEY = 'icr_active'
  public static TO_KEY = 'icr_to'

  static getUsers(): UserModel[] {
    if (!localStorage.getItem(this.USER_KEY)) {
      localStorage.setItem(this.USER_KEY, JSON.stringify([
          {
            firstName: 'Lazar',
            lastName: 'Milovanovic',
            email: '007lazar@gmail.com',
            phone: '+381652068821',
            password: 'lazar123',
            data: [],
          },
        ])
      );
    }

    return JSON.parse(localStorage.getItem(this.USER_KEY)!);
  }

  static findUserByEmail(email: string) {
    const users = this.getUsers();
    const selectedUser = users.find(u => u.email === email);

    if (!selectedUser) throw new Error('USER_NOT_FOUND');
  
    return selectedUser;
  }

  static login(email: string, password: string) {

    try {
      const user = this.findUserByEmail(email)
      if (user.password === password) {
        localStorage.setItem(this.ACTIVE_KEY, user.email)
        return true
      }
      return false
    } catch {
      return false
    }
  }

  static hasAuth(){
    return localStorage.getItem(this.ACTIVE_KEY) !== null
  }

  static getActiveUser() {
    if(!this.hasAuth)
      throw new Error()

    return this.findUserByEmail(localStorage.getItem(this.ACTIVE_KEY)!)
  }

  static logout(){
    localStorage.removeItem(this.ACTIVE_KEY)
  }

}
