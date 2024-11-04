import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { RoutePaths } from "../../app.routes";
import { animate, state, style, transition, trigger } from '@angular/animations'

@Component({
  selector: "dhub-header",
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
  animations: [
    trigger('grow', [
      state(
        'initial',
        style({
          opacity: 0
        })
      ),
      state(
        'final',
        style({
          opacity: 1
        })
      ),
      transition('initial => final', [animate('2s')])
    ])
  ]
})
export class HeaderComponent {
  readonly appRoutes = RoutePaths;
}
