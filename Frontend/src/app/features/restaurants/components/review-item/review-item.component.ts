import { Component, computed, input } from "@angular/core";
import { Review } from "../../models/review.model";
import { EnumeratePipe } from "../../../../shared/pipes/enumerate/enumerate.pipe";

@Component({
  selector: "dhub-review-item",
  standalone: true,
  imports: [EnumeratePipe],
  templateUrl: "./review-item.component.html",
  styleUrl: "./review-item.component.css",
})
export class ReviewItemComponent {
  reviewModel = input.required<Review>();
  reviewDate = computed(() => {
    const date = this.reviewModel().date;
    const dayDate = date.getDate().toString().padStart(2, "0");
    const monthDate = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${dayDate}-${monthDate}-${date.getFullYear()}`;
  });
}
