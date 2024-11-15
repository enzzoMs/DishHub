import { TestBed } from "@angular/core/testing";
import { HomeComponent } from "./home.component";

describe("HomeComponent", () => {
  it("should be created", async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(HomeComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
