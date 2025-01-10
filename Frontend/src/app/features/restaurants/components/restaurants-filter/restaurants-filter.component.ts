import { Component } from "@angular/core";
import {
  NgLabelTemplateDirective,
  NgOptionTemplateDirective,
  NgSelectComponent,
} from "@ng-select/ng-select";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { EnumeratePipe } from "../../../../shared/pipes/enumerate/enumerate.pipe";
import {
  RestaurantFilters,
  ScoreOption,
} from "../../models/restaurant-filters.model";
import { parseRestaurantScore } from "../../../../shared/models/restaurant.model";

@Component({
  selector: "dhub-restaurants-filter",
  standalone: true,
  imports: [
    NgSelectComponent,
    ReactiveFormsModule,
    NgOptionTemplateDirective,
    NgLabelTemplateDirective,
    EnumeratePipe,
    FormsModule,
  ],
  templateUrl: "./restaurants-filter.component.html",
  styleUrl: "./restaurants-filter.component.css",
})
export class RestaurantsFilterComponent {
  readonly scoreOptions: ScoreOption[] = [
    { value: null },
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 },
  ];

  readonly restaurantsFilters: RestaurantFilters = {
    name: "",
    location: "",
    score: this.scoreOptions[0],
  };

  constructor(
    activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) {
    activatedRoute.queryParamMap.subscribe((paramsMap) => {
      this.restaurantsFilters.name = paramsMap.get("name");
      this.restaurantsFilters.location = paramsMap.get("location");

      const scoreParam = paramsMap.get("score");
      this.restaurantsFilters.score = {
        value: parseRestaurantScore(scoreParam),
      };
    });
  }

  applyFilters() {
    const { name, location, score } = this.restaurantsFilters;

    this.router.navigate([], {
      queryParams: {
        name: !name ? null : name,
        location: !location ? null : location,
        score: score?.value,
      },
    });
  }
}
