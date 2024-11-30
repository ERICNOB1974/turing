import { Routes } from '@angular/router';
import { CintaComponent } from './cinta/cinta.component';
import { CsvUploaderComponent } from './seleccionarArchivo/seleccionarArchivo';

export const routes: Routes = [
     {path: 'cinta', component: CintaComponent},
     { path: '', component: CsvUploaderComponent }

];