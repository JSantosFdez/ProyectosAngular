import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [
  ]
})
export class RegisterComponent {

    miFormulario: FormGroup = this.fb.group({
      name: ['Test 4', [Validators.required, Validators.minLength(1)]],
      email: ['test4@test.com', [Validators.required, Validators.email]],
      password: ['123456', [Validators.required, Validators.minLength(6)]],
    })

    constructor( private fb : FormBuilder,
                private router: Router,
                private authService: AuthService){};

    registrar(){
      
      const {name, email, password} = this.miFormulario.value;

      this.authService.registro(name, email, password)
      .subscribe( ok =>{
              console.log(ok);
              if (ok === true){
                this.router.navigateByUrl('/dashboard');
              }else{
                // En caso de error en ok se tiene el mensaje de error
                Swal.fire('Error', ok, 'error');
              }

            })
    }
}
