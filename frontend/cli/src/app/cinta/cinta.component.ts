import { Component } from '@angular/core';
import { CintaService } from './cinta.service';

@Component({
  selector: 'app-proyecto-detail',
  standalone: true,
  imports: [],
  template: `
  <div class="container mt-4">

  </div>
  `,
  styles: [``]
})
export class ProyectosDetailComponent {

  constructor(
    private cintaService: CintaService
  ) { }

  ngOnInit() {

  }

}