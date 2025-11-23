import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  protected form: FormGroup

  constructor(private formBuilder: FormBuilder, private router: Router) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }


  onSubmit() {
    if (!this.form.valid) {
      Swal.fire('Invalid form data')
      return
    }

    if (!UserService.login(this.form.value.email, this.form.value.password)) {
      Swal.fire('Invalid credentials')
    }

    this.router.navigateByUrl('/')
  }


}


