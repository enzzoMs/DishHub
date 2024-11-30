import { TestBed } from "@angular/core/testing";

import { RestaurantDetailsComponent } from "./restaurant-details.component";

describe("RestaurantDetailsComponent", () => {
  it("should be created", async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantDetailsComponent],
      providers: [],
    }).compileComponents();
    const fixture = TestBed.createComponent(RestaurantDetailsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
