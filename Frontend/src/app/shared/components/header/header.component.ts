import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { RoutePath } from "../../../app.routes";
import { SignUpButtonComponent } from "../../../features/auth/components/sign-up-button/sign-up-button.component";

@Component({
  selector: "dhub-header",
  standalone: true,
  imports: [RouterLink, RouterLinkActive, SignUpButtonComponent],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
})
export class HeaderComponent {
  readonly appRoutes = RoutePath;
}
