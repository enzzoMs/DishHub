import { TestBed } from "@angular/core/testing";

import { TabItemComponent } from "./tab-item.component";

describe("TabItemComponent", () => {
  it("should be create", async () => {
    await TestBed.configureTestingModule({
      imports: [TabItemComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TabItemComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
