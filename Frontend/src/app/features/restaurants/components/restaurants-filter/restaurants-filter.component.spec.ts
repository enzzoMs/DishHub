import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RestaurantsFilterComponent } from "./restaurants-filter.component";
import { provideRouter, Router } from "@angular/router";

describe("FilterComponent", () => {
  let component: RestaurantsFilterComponent;
  let fixture: ComponentFixture<RestaurantsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantsFilterComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should initialize the form with default values", () => {
    const { name, location, score } = component.restaurantFilterForm.value;

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

    component.restaurantFilterForm.setValue({
      name: nameFilter,
      location: locationFilter,
      score: scoreFilter,
    });

    component.applyFilters();

    expect(router.navigate).toHaveBeenCalledOnceWith([], {
      queryParams: {
        name: nameFilter,
        location: locationFilter,
        score: scoreFilter.value,
      },
    });
  });
});
