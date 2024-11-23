import { Component } from "@angular/core";
import {
  NgLabelTemplateDirective,
  NgOptionTemplateDirective,
  NgSelectComponent,
} from "@ng-select/ng-select";
import { FormBuilder, FormControl, ReactiveFormsModule } from "@angular/forms";
import { Router } from "@angular/router";

interface ScoreOption {
  value: number | null;
}

@Component({
  selector: "dhub-restaurants-filter",
  standalone: true,
  imports: [
    NgSelectComponent,
    ReactiveFormsModule,
    NgOptionTemplateDirective,
    NgLabelTemplateDirective,
  ],
  templateUrl: "./restaurants-filter.component.html",
  styleUrl: "./restaurants-filter.component.css",
})
export class RestaurantsFilterComponent {
  readonly restaurantFilterForm;

  readonly scoreOptions: ScoreOption[] = [
    { value: null },
    { value: 1 },
    { value: 2 },
    { value: 3 },
    { value: 4 },
    { value: 5 },
  ];

  constructor(
    formBuilder: FormBuilder,
    private readonly router: Router,
  ) {
    this.restaurantFilterForm = formBuilder.group({
      name: [""],
      location: [""],
      score: new FormControl<ScoreOption>(this.scoreOptions[0]),
    });
  }

  applyFilters() {
    const { name, location, score } = this.restaurantFilterForm.value;

    this.router.navigate([], {
      queryParams: {
        name: !name ? null : name,
        location: !location ? null : location,
        score: score?.value,
      },
    });
  }
}
