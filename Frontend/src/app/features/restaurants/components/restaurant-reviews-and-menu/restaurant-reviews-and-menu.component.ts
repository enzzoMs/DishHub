import { Component } from '@angular/core';
import {TabPanelComponent} from "../../../../shared/components/tab-panel/tab-panel.component";
import {TabItemComponent} from "../../../../shared/components/tab-item/tab-item.component";

@Component({
  selector: "dhub-restaurant-reviews-and-menu",
  standalone: true,
  imports: [TabPanelComponent, TabItemComponent],
  templateUrl: "./restaurant-reviews-and-menu.component.html",
  styleUrl: "./restaurant-reviews-and-menu.component.css",
})
export class RestaurantReviewsAndMenuComponent {}
