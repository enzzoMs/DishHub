import { TestBed } from "@angular/core/testing";

import { MenuItemComponent } from "./menu-item.component";
import {
  MenuItem,
  MenuItemCategory,
} from "../../../../shared/models/menu-item.model";

describe("MenuItemComponent", () => {
  it("should be created", async () => {
    await TestBed.configureTestingModule({
      imports: [MenuItemComponent],
    }).compileComponents();

    const testMenuItem: MenuItem = {
      name: "",
      category: MenuItemCategory.Appetizers,
      description: "",
      price: 0,
    };

    const fixture = TestBed.createComponent(MenuItemComponent);
    fixture.componentRef.setInput("menuModel", testMenuItem);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
