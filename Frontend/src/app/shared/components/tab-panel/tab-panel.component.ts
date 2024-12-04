import {
  Component,
  computed,
  contentChildren,
  ElementRef,
  signal,
  viewChild,
} from "@angular/core";
import { TabItemComponent } from "../tab-item/tab-item.component";
import { NgTemplateOutlet } from "@angular/common";

@Component({
  selector: "dhub-tab-panel",
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: "./tab-panel.component.html",
  styleUrl: "./tab-panel.component.css",
})
export class TabPanelComponent {
  tabItems = contentChildren(TabItemComponent);
  tabHeaders = computed(() => {
    return this.tabItems().map((tab) => tab.header());
  });

  selectedTabIndex = signal(0);

  private tabListElement =
    viewChild.required<ElementRef<HTMLDivElement>>("tabList");

  private tabFocusIndex = 0;

  selectTab(newSelectedIndex: number) {
    const tabButtons =
      this.tabListElement().nativeElement.querySelectorAll<HTMLButtonElement>(
        "button",
      )!;

    tabButtons[this.selectedTabIndex()].setAttribute("aria-selected", "false");
    tabButtons[newSelectedIndex].setAttribute("aria-selected", "true");

    this.selectedTabIndex.set(newSelectedIndex);
  }

  onTabListKeydown(event: KeyboardEvent) {
    if (
      this.tabItems().length === 0 ||
      (event.key !== "ArrowLeft" && event.key !== "ArrowRight")
    ) {
      return;
    }

    const tabButtons =
      this.tabListElement().nativeElement.querySelectorAll<HTMLButtonElement>(
        "button",
      )!;

    tabButtons[this.tabFocusIndex].setAttribute("tabindex", "-1");

    if (event.key === "ArrowLeft") {
      this.tabFocusIndex--;

      if (this.tabFocusIndex < 0) {
        this.tabFocusIndex = this.tabItems().length - 1;
      }
    }

    if (event.key === "ArrowRight") {
      this.tabFocusIndex++;

      if (this.tabFocusIndex >= this.tabItems().length) {
        this.tabFocusIndex = 0;
      }
    }

    tabButtons[this.tabFocusIndex].setAttribute("tabindex", "0");
    tabButtons[this.tabFocusIndex].focus();
  }
}
