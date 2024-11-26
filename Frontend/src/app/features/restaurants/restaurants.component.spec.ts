import { TestBed } from "@angular/core/testing";

import { RestaurantsComponent } from "./restaurants.component";
import { provideRouter} from "@angular/router";

describe("RestaurantsComponent", () => {
  it("should be created", async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantsComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    const fixture = TestBed.createComponent(RestaurantsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
