import { Component } from "@angular/core";
import { HeroComponent } from "./hero/hero.component";

@Component({
  selector: "dhub-home",
  standalone: true,
  imports: [HeroComponent],
  templateUrl: "./home.component.html",
})
export class HomeComponent {}
