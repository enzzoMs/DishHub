import { ComponentFixture, TestBed } from "@angular/core/testing";

import { RestaurantItemComponent } from "./restaurant-item.component";

describe("RestaurantComponent", () => {
  let component: RestaurantItemComponent;
  let fixture: ComponentFixture<RestaurantItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantItemComponent);
    fixture.componentRef.setInput("restaurantModel", {
      id: 0,
      name: "",
      description: "",
      location: "",
      score: 0,
    });
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  // TODO: Test see details button
});
