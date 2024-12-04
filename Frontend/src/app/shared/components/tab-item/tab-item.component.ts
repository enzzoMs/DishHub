import { Component, input, TemplateRef, viewChild } from "@angular/core";

@Component({
  selector: "dhub-tab-item",
  standalone: true,
  imports: [],
  templateUrl: "./tab-item.component.html",
})
export class TabItemComponent {
  header = input.required<string>();

  template = viewChild.required(TemplateRef);
}
