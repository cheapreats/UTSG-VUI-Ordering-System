import { MenuItem } from "./MenuItem";

export interface Cart {
  id: string;
  items: MenuItem[];
  subtotal: number;
  total: number;
}
