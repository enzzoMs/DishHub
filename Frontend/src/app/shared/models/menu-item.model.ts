export interface MenuItem {
  name: string;
  category: MenuItemCategory;
  description: string;
  price: number;
}

export enum MenuItemCategory {
  Appetizers = "Appetizers",
  MainCourse = "Main Course",
  Pasta = "Pasta",
  Beverages = "Beverages",
  Desserts = "Desserts",
}
