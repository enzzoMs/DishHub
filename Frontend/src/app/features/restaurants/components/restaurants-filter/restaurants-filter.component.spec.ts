import { TestBed } from "@angular/core/testing";

import { RestaurantsFilterComponent } from "./restaurants-filter.component";
import { ActivatedRoute, provideRouter, Router } from "@angular/router";
import { Subject } from "rxjs";
import { ScoreOption } from "../../models/restaurant-filter.model";

describe("RestaurantsFilterComponent", () => {
  let component: RestaurantsFilterComponent;

  const queryParamsMock$ = new Subject<Map<string, string>>();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantsFilterComponent],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            queryParamMap: queryParamsMock$,
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(RestaurantsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize the form with default values", () => {
    const { name, location, score } = component.restaurantFilters;

    expect(name).toBe("");
    expect(location).toBe("");
    expect(score).toBe(component.scoreOptions[0]);
  });

  it("should navigate with correct filter values as query params", () => {
    const router = TestBed.inject(Router);
    spyOn(router, "navigate");

    const nameFilter = "Luna Bistro";
    const locationFilter = "Pasta Lane";
    const scoreFilter = component.scoreOptions[4];

    component.restaurantFilters.name = nameFilter;
    component.restaurantFilters.location = locationFilter;
    component.restaurantFilters.score = scoreFilter;

    component.applyFilters();

    expect(router.navigate).toHaveBeenCalledOnceWith([], {
      queryParams: {
        name: nameFilter,
        location: locationFilter,
        score: scoreFilter.value,
      },
    });
  });

  it("should update filters model when query params change", () => {
    const nameFilter = "Luna Bistro";
    const locationFilter = "Pasta Lane";
    const scoreFilter: ScoreOption = { value: 4 };

    const paramsMap = new Map<string, string>();
    paramsMap.set("name", nameFilter);
    paramsMap.set("location", locationFilter);
    paramsMap.set("score", scoreFilter.value!.toString());
    queryParamsMock$.next(paramsMap);

    expect(component.restaurantFilters.name).toBe(nameFilter);
    expect(component.restaurantFilters.location).toBe(locationFilter);
    expect(component.restaurantFilters.score).toEqual(scoreFilter);
  });
});
