import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserMenuComponent } from "./user-menu.component";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MenuItem } from "../../../../shared/models/menu-item.model";

describe("UserMenuComponent", () => {
  let component: UserMenuComponent;
  let fixture: ComponentFixture<UserMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMenuComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMenuComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput("restaurantId", 0);

    const testMenuItem: MenuItem[] = [
      {
        id: 0,
        name: "",
        description: "",
        price: 0,
      },
    ];
    fixture.componentRef.setInput("restaurantMenu", testMenuItem);

    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
