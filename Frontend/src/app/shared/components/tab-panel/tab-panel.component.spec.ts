import { ComponentFixture, TestBed } from "@angular/core/testing";

import { TabPanelComponent } from "./tab-panel.component";
import { Component, DebugElement } from "@angular/core";
import { TabItemComponent } from "../tab-item/tab-item.component";
import { By } from "@angular/platform-browser";

@Component({
  selector: "dhub-tab-panel-test-wrapper",
  standalone: true,
  imports: [TabPanelComponent, TabItemComponent],
  template: ` <dhub-tab-panel>
    <dhub-tab-item [header]="headers[0]"></dhub-tab-item>
    <dhub-tab-item [header]="headers[1]"></dhub-tab-item>
    <dhub-tab-item [header]="headers[2]"></dhub-tab-item>
  </dhub-tab-panel>`,
})
class TabPanelWrapperComponent {
  static readonly testHeaders = ["Header 1", "Header 2", "Header 3"];
  readonly headers = TabPanelWrapperComponent.testHeaders;
}

describe("TabPanelComponent", () => {
  let testWrapperFixture: ComponentFixture<TabPanelWrapperComponent>;
  let tabPanelElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabPanelComponent, TabPanelWrapperComponent],
    }).compileComponents();

    testWrapperFixture = TestBed.createComponent(TabPanelWrapperComponent);
    tabPanelElement = testWrapperFixture.debugElement.children[0];
    testWrapperFixture.detectChanges();
  });

  it("should be created", () => {
    expect(tabPanelElement).toBeTruthy();
  });

  it("should initialize headers from the content children", () => {
    const tabHeaders = tabPanelElement.componentInstance.tabHeaders();
    expect(tabHeaders.length).toBe(TabPanelWrapperComponent.testHeaders.length);

    TabPanelWrapperComponent.testHeaders.forEach((testHeader, index) => {
      expect(tabHeaders[index]).toBe(testHeader);
    });
  });

  it("should set the correct aria-selected on tab click", () => {
    const tabButtons = tabPanelElement
      .queryAll(By.css("button[role=tab]"))
      .map((tabElement) => tabElement.nativeElement as HTMLButtonElement);

    const testIndex = 1;

    tabButtons[testIndex].click();

    expect(tabButtons[0].getAttribute("aria-selected")).toBe("false");
    expect(tabButtons[1].getAttribute("aria-selected")).toBe("true");
    expect(tabButtons[2].getAttribute("aria-selected")).toBe("false");
  });

  it("should update the selected tab index on tab click", () => {
    const tabButtons = tabPanelElement
      .queryAll(By.css("button[role=tab]"))
      .map((tabElement) => tabElement.nativeElement as HTMLButtonElement);

    const testIndex = 1;

    tabButtons[testIndex].click();
    testWrapperFixture.detectChanges();

    const tabPanelComponent =
      tabPanelElement.componentInstance as TabPanelComponent;

    expect(tabPanelComponent.selectedTabIndex()).toBe(testIndex);
  });

  it("should move focus to the next tab on ArrowRight keyboard navigation", () => {
    const tabButtons = tabPanelElement
      .queryAll(By.css("button[role=tab]"))
      .map((tabElement) => tabElement.nativeElement as HTMLButtonElement);

    const tabList = tabPanelElement.query(By.css("[role=tablist]"))
      .nativeElement as HTMLElement;

    const currentTabFocusIndex = 0;
    tabButtons[currentTabFocusIndex].focus();
    testWrapperFixture.detectChanges();

    const keyboardEvent = new KeyboardEvent("keydown", { key: "ArrowRight" });
    tabList.dispatchEvent(keyboardEvent);
    testWrapperFixture.detectChanges();

    expect(document.activeElement?.id).toBe(tabButtons[currentTabFocusIndex + 1].id);
  });

  it("should move focus to the previous tab on ArrowLeft keyboard navigation", () => {
    const tabButtons = tabPanelElement
      .queryAll(By.css("button[role=tab]"))
      .map((tabElement) => tabElement.nativeElement as HTMLButtonElement);

    const tabList = tabPanelElement.query(By.css("[role=tablist]"))
      .nativeElement as HTMLElement;


    const currentTabFocusIndex = 0;
    tabButtons[currentTabFocusIndex].focus();
    testWrapperFixture.detectChanges();

    const keyboardEvent = new KeyboardEvent("keydown", { key: "ArrowLeft" });
    tabList.dispatchEvent(keyboardEvent);
    testWrapperFixture.detectChanges();

    expect(document.activeElement?.id).toBe(tabButtons[2].id);
  });

  it("should render tab panels based on selected index", () => {
    const tabButtons = tabPanelElement
      .queryAll(By.css("button[role=tab]"))
      .map((tabElement) => tabElement.nativeElement as HTMLButtonElement);

    const firstPanelId = `${TabPanelWrapperComponent.testHeaders[0].toLowerCase()}-panel`;
    const secondPanelId = `${TabPanelWrapperComponent.testHeaders[1].toLowerCase()}-panel`;

    // Initially, first tab should be selected
    let tabPanels = tabPanelElement.queryAll(By.css("[role=tabpanel]"));

    expect(tabPanels.length).toBe(1);
    expect(tabPanels[0].nativeElement.id).toBe(firstPanelId);

    // Select second tab
    tabButtons[1].click();
    testWrapperFixture.detectChanges();

    tabPanels = tabPanelElement.queryAll(By.css("[role=tabpanel]"));

    expect(tabPanels.length).toBe(1);
    expect(tabPanels[0].nativeElement.id).toBe(secondPanelId);
  });
});
