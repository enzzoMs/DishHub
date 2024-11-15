import { TestBed } from "@angular/core/testing";
import { FeaturesComponent } from './features.component'

describe("FeaturesComponent", () => {
  it("should be created", async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(FeaturesComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
