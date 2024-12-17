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

  readonly restaurantFilters: RestaurantFilters = {
    name: "",
    location: "",
    score: this.scoreOptions[0],
  };

  constructor(
    activatedRoute: ActivatedRoute,
    private readonly router: Router,
  ) {
    activatedRoute.queryParamMap.subscribe((paramsMap) => {
      this.restaurantFilters.name = paramsMap.get("name");
      this.restaurantFilters.location = paramsMap.get("location");

      const scoreParam = parseInt(paramsMap.get("score")!, 10);
      this.restaurantFilters.score = {
        value: isNaN(scoreParam) ? null : scoreParam,
      };
    });
  }

  applyFilters() {
    const { name, location, score } = this.restaurantFilters;

    this.router.navigate([], {
      queryParams: {
        name: !name ? null : name,
        location: !location ? null : location,
        score: score?.value,
      },
    });
  }
}
