import { TestBed } from "@angular/core/testing";
import { FooterComponent } from "./footer.component";

describe("FooterComponent", () => {
  it("should be created", async () => {
    await TestBed.configureTestingModule({
      imports: [FooterComponent],
    }).compileComponents();
    const fixture = TestBed.createComponent(FooterComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
