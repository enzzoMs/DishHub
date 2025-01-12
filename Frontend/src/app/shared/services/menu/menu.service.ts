import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { MenuItem } from "../../models/menu-item.model";
import { apiEndpoints } from "../../../../api/api-endpoints";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class MenuService {
  constructor(private readonly http: HttpClient) {}

  getRestaurantMenu(id: number): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(apiEndpoints.getRestaurantMenu(id));
  }

  createMenu(
    restaurantId: number,
    name: string,
    description: string,
    price: number,
  ): Observable<MenuItem> {
    return this.http.post<MenuItem>(apiEndpoints.createMenuItem(restaurantId), {
      name,
      description,
      price,
    });
  }

  updateMenu(
    restaurantId: number,
    menuItemId: number,
    name: string,
    description: string,
    price: number,
  ): Observable<MenuItem> {
    return this.http.patch<MenuItem>(
      apiEndpoints.updateMenuItem(restaurantId, menuItemId),
      {
        name,
        description,
        price,
      },
    );
  }

  deleteMenu(restaurantId: number, menuItemId: number): Observable<null> {
    return this.http.delete<null>(
      apiEndpoints.deleteMenuItem(restaurantId, menuItemId),
    );
  }
}
