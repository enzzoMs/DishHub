import { TestBed } from "@angular/core/testing";
import { FeaturesComponent } from "./features.component";
import { provideRouter } from "@angular/router";
import { appRoutes } from "../../../../app.routes";

describe("FeaturesComponent", () => {
  it("should be created", async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesComponent],
      providers: [provideRouter(appRoutes)],
    }).compileComponents();
    const fixture = TestBed.createComponent(FeaturesComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
