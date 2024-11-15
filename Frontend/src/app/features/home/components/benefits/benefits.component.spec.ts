import { TestBed } from "@angular/core/testing";
import { BenefitsComponent } from "./benefits.component";

describe("BenefitsComponent", () => {
  it("should be created", async () => {
    await TestBed.configureTestingModule({
      imports: [BenefitsComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(BenefitsComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
