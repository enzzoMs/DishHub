import { TestBed } from "@angular/core/testing";

import { RestaurantProfileComponent } from "./restaurant-profile.component";
import { provideRouter } from "@angular/router";

describe("RestaurantProfileComponent", () => {
  it("should be created", async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantProfileComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(RestaurantProfileComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
