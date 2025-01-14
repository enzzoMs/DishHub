import { ComponentFixture, TestBed } from "@angular/core/testing";

import { UserMenuItemComponent } from "./user-menu-item.component";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { MenuItem } from "../../../../shared/models/menu-item.model";

describe("UserMenuItemComponent", () => {
  let component: UserMenuItemComponent;
  let fixture: ComponentFixture<UserMenuItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMenuItemComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(UserMenuItemComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput("restaurantId", 0);

    const testMenuItem: MenuItem = {
      id: 0,
      name: "",
      description: "",
      price: 0,
    };
    fixture.componentRef.setInput("menuItemModel", testMenuItem);

    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });
});
