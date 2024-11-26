import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { RoutePaths } from "../../../app.routes";

@Component({
  selector: "dhub-header",
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent {
  readonly appRoutes = RoutePaths;
}
