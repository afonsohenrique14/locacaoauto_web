import { Person } from "./person.model";

export interface User {
  id: string;
  email: string;
  personId: string | null;
  person: Person | null;
  createdAt: string;
  token: string;
}
