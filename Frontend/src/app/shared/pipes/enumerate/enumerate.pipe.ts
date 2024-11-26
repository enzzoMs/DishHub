import { Pipe, PipeTransform } from "@angular/core";

/**
 * A pipe that generates an array of a specified length _n_ in the following format:
 * ```
 * [0, 1, 2, ..., n - 1].
 * ```
 * Useful for repeating elements in templates using @for:
 * ```
 * @for(i of 5 | enumerate; track $index) { }
 * ```
 */
@Pipe({
  name: "enumerate",
  standalone: true,
})
export class EnumeratePipe implements PipeTransform {
  transform(value: number): number[] {
    const result: number[] = [];

    for (let i = 0; i < value; i++) {
      result.push(i);
    }

    return result;
  }
}
