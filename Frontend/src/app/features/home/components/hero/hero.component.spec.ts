import { TestBed } from "@angular/core/testing";
import { HeroComponent } from './hero.component'

describe("HeroComponent", () => {
  it("should be created", async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(HeroComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
