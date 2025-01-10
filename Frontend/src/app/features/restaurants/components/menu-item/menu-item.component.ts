import { Component, input } from "@angular/core";
import { CurrencyPipe } from "@angular/common";
import { MenuItem } from "../../../../shared/models/menu-item.model";

@Component({
  selector: "dhub-menu-item",
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: "./menu-item.component.html",
  styleUrl: "./menu-item.component.css",
})
export class MenuItemComponent {
  menuModel = input.required<MenuItem>();
}
