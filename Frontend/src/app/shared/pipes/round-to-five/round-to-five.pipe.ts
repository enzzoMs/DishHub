import { Pipe, PipeTransform } from "@angular/core";

/**
 * A pipe that rounds numbers to the lowest multiple of five.
 */
@Pipe({
  name: "roundToFive",
  standalone: true,
})
export class RoundToFivePipe implements PipeTransform {
  transform(value: number): number {
    return Math.floor(value / 5) * 5;
  }
}
