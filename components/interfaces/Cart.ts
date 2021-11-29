import { MenuItem } from "./MenuItem";

export interface Cart {
  _id: string;
  items: {menu_item: MenuItem}[];
  subtotal: number;
}
