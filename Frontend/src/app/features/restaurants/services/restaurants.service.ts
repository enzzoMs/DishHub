import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Restaurant } from "../models/restaurant.model";
import { PaginatedItems } from "../../../shared/models/PaginatedItems";
import { RestaurantFilters } from "../models/restaurant-filter.model";
import { Review } from "../models/review.model";
import { MenuItem, MenuItemCategory } from "../models/menu-item.model";

@Injectable({
  providedIn: "root",
})
export class RestaurantsService {
  getRestaurantById(id: number): Observable<Restaurant> {
    // TODO: Replace with HTTP call
    return new Observable((subscriber) => {
      setTimeout(() => {
        subscriber.next(
          this.restaurants.find((restaurant) => restaurant.id === id),
        );
        subscriber.complete();
      }, 800);
    });
  }

  getRestaurantsForPage(
    page: number,
    pageSize: number,
    filters: RestaurantFilters,
  ): Observable<PaginatedItems<Restaurant>> {
    // TODO: Replace with HTTP call
    return new Observable<PaginatedItems<Restaurant>>((subscriber) => {
      setTimeout(() => {
        const filteredRestaurants = this.restaurants.filter((restaurant) => {
          return (
            (!filters.name ||
              restaurant.name
                .toLowerCase()
                .includes(filters.name.toLowerCase())) &&
            (!filters.location ||
              restaurant.location
                .toLowerCase()
                .includes(filters.location.toLowerCase())) &&
            (!filters.score.value || restaurant.score === filters.score.value)
          );
        });

        subscriber.next({
          data: filteredRestaurants.slice(
            (page - 1) * pageSize,
            page * pageSize,
          ),
          pageNumber: page,
          totalItems: filteredRestaurants.length,
        });
        subscriber.complete();
      }, 800);
    });
  }

  getRestaurantReviews(
    id: number,
    page: number,
    pageSize: number,
  ): Observable<PaginatedItems<Review>> {
    return new Observable<PaginatedItems<Review>>((subscriber) => {
      setTimeout(() => {
        subscriber.next({
          data: this.reviews.slice((page - 1) * pageSize, page * pageSize),
          pageNumber: page,
          totalItems: this.reviews.length,
        });
        subscriber.complete();
      }, 800);
    });
  }

  getRestaurantMenu(id: number): Observable<MenuItem[]> {
    return new Observable<MenuItem[]>((subscriber) => {
      setTimeout(() => {
        subscriber.next(this.menuItems);
        subscriber.complete();
      }, 800);
    });
  }

  private menuItems: MenuItem[] = [
    {
      name: "Bife de Chorizo",
      category: MenuItemCategory.MainCourse,
      description:
        "Corte nobre de carne bovina, grelhado no ponto perfeito, servido com molho chimichurri.",
      price: 49.9,
    },
    {
      name: "Picanha na Brasa",
      category: MenuItemCategory.MainCourse,
      description:
        "Picanha suculenta, temperada com sal grosso e grelhada na brasa.",
      price: 69.9,
    },
    {
      name: "Costela de Cordeiro",
      category: MenuItemCategory.MainCourse,
      description:
        "Costela de cordeiro assada lentamente, com ervas e especiarias, servida com purê de batatas.",
      price: 89.9,
    },
    {
      name: "Feijoada Completa",
      category: MenuItemCategory.MainCourse,
      description:
        "Feijoada tradicional com carnes variadas, arroz, farofa, couve e laranja.",
      price: 39.9,
    },
    {
      name: "Frango Grelhado com Ervas",
      category: MenuItemCategory.MainCourse,
      description:
        "Peito de frango marinado com ervas finas e grelhado, servido com arroz e salada.",
      price: 29.9,
    },
    {
      name: "Brigadeiro Gourmet",
      category: MenuItemCategory.Desserts,
      description:
        "Brigadeiro de chocolate belga com granulado dourado, servido em uma mini taça.",
      price: 12.9,
    },
    {
      name: "Pavê de Morango",
      category: MenuItemCategory.Desserts,
      description:
        "Camadas de biscoito champanhe, creme de leite e morangos frescos, coberto com chantilly.",
      price: 18.9,
    },
    {
      name: "Torta de Limão",
      category: MenuItemCategory.Desserts,
      description:
        "Torta crocante com recheio de limão siciliano e cobertura de merengue.",
      price: 22.9,
    },
    {
      name: "Mousse de Maracujá",
      category: MenuItemCategory.Desserts,
      description: "Mousse cremosa de maracujá com calda de maracujá fresca.",
      price: 14.9,
    },
    {
      name: "Cheesecake de Framboesa",
      category: MenuItemCategory.Desserts,
      description:
        "Cheesecake leve e cremoso, coberto com uma deliciosa calda de framboesa.",
      price: 25.9,
    },
    {
      name: "Salada Caesar",
      category: MenuItemCategory.Appetizers,
      description:
        "Folhas frescas de alface, molho Caesar, croutons crocantes e lascas de parmesão.",
      price: 19.9,
    },
    {
      name: "Bruschetta de Tomate e Manjericão",
      category: MenuItemCategory.Appetizers,
      description:
        "Pão italiano torrado, coberto com tomate picado, manjericão e azeite de oliva.",
      price: 15.9,
    },
    {
      name: "Espaguete ao Alho e Óleo",
      category: MenuItemCategory.Pasta,
      description:
        "Espaguete al dente, temperado com alho frito, azeite de oliva e pimenta calabresa.",
      price: 27.9,
    },
    {
      name: "Lasagna de Carne",
      category: MenuItemCategory.Pasta,
      description:
        "Lasanha recheada com carne moída, molho béchamel e queijo gratinado.",
      price: 32.9,
    },
    {
      name: "Pizza Margherita",
      category: MenuItemCategory.Pasta,
      description:
        "Pizza com molho de tomate, mozzarella, manjericão fresco e azeite de oliva.",
      price: 35.9,
    },
  ];

  private reviews: Review[] = [
    {
      userName: "Alice Johnson",
      rating: 4,
      comment: "Amazing experience! The product quality exceeded expectations.",
      date: new Date("2024-03-16"),
    },
    {
      userName: "Bob Smith",
      rating: 3,
      comment: "Decent product, but delivery was delayed.",
      date: new Date("2024-03-15"),
    },
    {
      userName: "Catherine Lee",
      rating: 5,
      comment: "Exceptional service and great value for money!",
      date: new Date("2024-03-14"),
    },
    {
      userName: "David Brown",
      rating: 1,
      comment: "Good overall, but packaging could be improved.",
      date: new Date("2024-03-13"),
    },
    {
      userName: "Ella Williams",
      rating: 3,
      comment: "Not satisfied with the product's durability.",
      date: new Date("2024-03-12"),
    },
    {
      userName: "Frank Thomas",
      rating: 2,
      comment: "Quick delivery and excellent quality. Highly recommend!",
      date: new Date("2024-03-11"),
    },
    {
      userName: "Grace Hall",
      rating: 3,
      comment: "Product works as expected, but the instructions were unclear.",
      date: new Date("2024-03-10"),
    },
    {
      userName: "Henry Scott",
      rating: 5,
      comment: "Absolutely perfect! Couldn't ask for more.",
      date: new Date("2024-03-09"),
    },
    {
      userName: "Isabella Moore",
      rating: 3,
      comment: "Average product, not worth the price.",
      date: new Date("2024-03-08"),
    },
    {
      userName: "Jack Wilson",
      rating: 4,
      comment: "Solid purchase with minor flaws.",
      date: new Date("2024-03-07"),
    },
    {
      userName: "Karen White",
      rating: 4,
      comment: "Fantastic product and excellent customer support.",
      date: new Date("2024-03-06"),
    },
    {
      userName: "Liam Harris",
      rating: 2,
      comment: "Very disappointed. The product did not match the description.",
      date: new Date("2024-03-05"),
    },
  ];

  private restaurants: Restaurant[] = [
    {
      id: 1,
      name: "The Spicy Fork",
      description:
        "A vibrant restaurant serving delicious spicy dishes.\nCome for the heat and stay for the flavor.",
      location: "New York, NY",
      score: 4.5,
    },
    {
      id: 2,
      name: "Bistro La Vie",
      description:
        "Evidentemente, a revolução dos costumes possibilita uma melhor visão global dos níveis de motivação departamental. Evidentemente, a revolução dos costumes possibilita uma melhor visão global dos níveis de motivação departamental.",
      location: "Los Angeles, CA",
      score: 4.2,
    },
    {
      id: 3,
      name: "Seafood Haven",
      description:
        "Fresh seafood in a relaxed beachside atmosphere.\nSavor the catch of the day with an ocean view.",
      location: "Miami, FL",
      score: 4.8,
    },
    {
      id: 4,
      name: "Pasta Palace",
      description:
        "A charming spot with homemade pastas and Italian wines.\nIndulge in timeless Italian dishes prepared with passion.",
      location: "Chicago, IL",
      score: 4.6,
    },
    {
      id: 5,
      name: "Taco Fiesta",
      description:
        "Serving up the best tacos in town with bold flavors.\nFrom classic to adventurous, every bite is a fiesta.",
      location: "Austin, TX",
      score: 4.3,
    },
    {
      id: 6,
      name: "Sushi Masters",
      description:
        "Experience authentic sushi prepared by skilled chefs.\nFresh ingredients and precise craftsmanship in every roll.",
      location: "San Francisco, CA",
      score: 4.7,
    },
    {
      id: 7,
      name: "The Green Table",
      description:
        "Healthy and organic options for vegetarians and vegans.\nA clean, green menu packed with nourishing choices.",
      location: "Portland, OR",
      score: 4.1,
    },
    {
      id: 8,
      name: "Grill & Thrill",
      description:
        "A lively spot for BBQ lovers and grilled specialties.\nPerfectly charred meats and smoky flavors await you.",
      location: "Denver, CO",
      score: 4.4,
    },
    {
      id: 9,
      name: "Noodle Nirvana",
      description:
        "A noodle paradise with a variety of Asian-inspired dishes.\nSlurp-worthy bowls filled with flavor and texture.",
      location: "Boston, MA",
      score: 4.3,
    },
    {
      id: 10,
      name: "Burger Bliss",
      description:
        "Gourmet burgers and creative sides in a laid-back setting.\nEvery bite of our burgers is pure bliss, paired with innovative sides.",
      location: "Seattle, WA",
      score: 4.2,
    },
    {
      id: 11,
      name: "La Trattoria",
      description:
        "An Italian classic known for its fresh pasta and warm atmosphere.\nEnjoy a comforting meal in an intimate, family-friendly environment.",
      location: "Las Vegas, NV",
      score: 4.6,
    },
    {
      id: 12,
      name: "Curry Corner",
      description:
        "A vibrant Indian eatery with a wide variety of curries and breads.\nSpicy, fragrant, and satisfying – perfect for curry lovers.",
      location: "San Diego, CA",
      score: 4.5,
    },
    {
      id: 13,
      name: "Bamboo Grove",
      description:
        "Traditional Asian cuisine with a focus on fresh ingredients.\nDelight in dishes that are both healthy and bursting with flavor.",
      location: "Honolulu, HI",
      score: 4.7,
    },
    {
      id: 14,
      name: "Steakhouse Supreme",
      description:
        "A high-end steakhouse offering premium cuts of meat.\nIndulge in tender, perfectly grilled steaks in an upscale setting.",
      location: "Dallas, TX",
      score: 4.8,
    },
    {
      id: 15,
      name: "The French Bakery",
      description:
        "Freshly baked croissants and pastries with a French flair.\nFrom buttery croissants to delicate tarts, each bite is a treat.",
      location: "Paris, France",
      score: 4.9,
    },
    {
      id: 16,
      name: "Vegan Vibes",
      description:
        "Delicious vegan meals crafted from fresh, local ingredients.\nVibrant dishes bursting with plant-based goodness.",
      location: "Los Angeles, CA",
      score: 4.4,
    },
    {
      id: 17,
      name: "BBQ Kings",
      description:
        "Classic American BBQ with a variety of meats and sides.\nSmoky, savory, and finger-licking good – a true BBQ experience.",
      location: "Kansas City, MO",
      score: 4.6,
    },
    {
      id: 18,
      name: "Ramen Empire",
      description:
        "A ramen joint offering rich broths and fresh toppings.\nSavor the deep flavors of Japan in a steaming bowl of ramen.",
      location: "New York, NY",
      score: 4.3,
    },
    {
      id: 19,
      name: "Ocean Breeze",
      description:
        "A beachside restaurant known for its seafood and cocktails.\nEnjoy the best seafood with a refreshing drink by the beach.",
      location: "Charleston, SC",
      score: 4.2,
    },
    {
      id: 20,
      name: "Farmhouse Kitchen",
      description:
        "Farm-to-table meals with fresh ingredients and hearty flavors.\nThe best local produce meets rustic charm in every dish.",
      location: "Nashville, TN",
      score: 4.7,
    },
  ];
}
