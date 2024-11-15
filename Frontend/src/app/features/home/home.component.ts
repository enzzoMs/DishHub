import { Component } from "@angular/core";
import { HeroComponent } from "./components/hero/hero.component";
import { FeaturesComponent } from "./components/features/features.component";
import { StatisticsComponent } from "./components/statistics/statistics.component";
import { BenefitsComponent } from "./components/benefits/benefits.component";

@Component({
  selector: "dhub-home",
  standalone: true,
  imports: [
    HeroComponent,
    FeaturesComponent,
    StatisticsComponent,
    BenefitsComponent,
  ],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent {}
