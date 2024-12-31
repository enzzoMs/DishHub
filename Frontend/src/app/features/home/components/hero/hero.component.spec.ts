import { TestBed } from "@angular/core/testing";
import { HeroComponent } from "./hero.component";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe("HeroComponent", () => {
  it("should be created", async () => {
    await TestBed.configureTestingModule({
      imports: [HeroComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(HeroComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
