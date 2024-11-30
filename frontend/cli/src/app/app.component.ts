import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
      <div class="container">
        <router-outlet></router-outlet>
      </div>
  `,
  styleUrls: ['../styles.css']
})
export class AppComponent {
  constructor(private router: Router) {}
}