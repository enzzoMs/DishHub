import { TestBed } from "@angular/core/testing";

import { RestaurantsComponent } from "./restaurants.component";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe("RestaurantsComponent", () => {
  it("should be created", async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantsComponent],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(RestaurantsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
