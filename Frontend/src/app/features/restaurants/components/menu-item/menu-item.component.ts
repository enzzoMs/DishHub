import { Component, input } from "@angular/core";
import { MenuItem } from "../../models/menu-item.model";
import {CurrencyPipe} from "@angular/common";

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
