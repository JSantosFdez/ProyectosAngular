import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanLoad } from '@angular/router';
import { ValidarTokenGuard } from './guards/validar-token.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./protected/protected.module').then(m => m.ProtectedModule),
    canActivate: [ ValidarTokenGuard ],
    canLoad: [ValidarTokenGuard]
  },
  {
    path :'**',
    redirectTo: 'auth'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // Para que las rutas sean compatibles con la mayoría de navegadores web
      useHash: false
  })
],
  exports: [RouterModule]
})
export class AppRoutingModule { }
