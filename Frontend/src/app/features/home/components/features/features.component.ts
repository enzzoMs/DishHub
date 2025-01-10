import { Component } from "@angular/core";
import { RestaurantItemComponent } from "../../../restaurants/components/restaurant-item/restaurant-item.component";
import { ReviewItemComponent } from "../../../restaurants/components/review-item/review-item.component";
import { Review } from "../../../../shared/models/review.model";
import { Restaurant } from "../../../../shared/models/restaurant.model";

@Component({
  selector: "dhub-features",
  standalone: true,
  imports: [RestaurantItemComponent, ReviewItemComponent],
  templateUrl: "./features.component.html",
  styleUrl: "./features.component.css",
})
export class FeaturesComponent {
  restaurantExample: Restaurant = {
    id: 0,
    name: "La Tavola Italiana",
    description:
      "Authentic Italian cuisine with fresh pasta, wood-fired pizzas, and a cozy, rustic vibe.",
    location: "Pasta Lane",
    score: 4.8,
  };

  reviewExample: Review = {
    userName: "Jane Doe",
    comment:
      "The best pasta I've ever had! Cozy atmosphere and fantastic service. Highly recommend! I'll definitely be coming back soon!",
    rating: 5,
    creationDate: new Date("2024-03-16"),
  };
}
