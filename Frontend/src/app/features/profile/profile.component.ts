import { Component } from "@angular/core";
import { TabPanelComponent } from "../../shared/components/tab-panel/tab-panel.component";
import { TabItemComponent } from "../../shared/components/tab-item/tab-item.component";
import { UserRestaurantsComponent } from "./components/user-restaurants/user-restaurants.component";

@Component({
  selector: "dhub-profile",
  standalone: true,
  imports: [TabPanelComponent, TabItemComponent, UserRestaurantsComponent],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css",
})
export class ProfileComponent {}
