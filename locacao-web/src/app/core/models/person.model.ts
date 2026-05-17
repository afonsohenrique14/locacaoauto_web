import { Address } from "./address.model";

export interface Person {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
}
