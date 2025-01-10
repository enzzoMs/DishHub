import { TestBed } from "@angular/core/testing";

import { ProfileComponent } from "./profile.component";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe("ProfileComponent", () => {
  it("should be created", async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    const fixture = TestBed.createComponent(ProfileComponent);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });
});
