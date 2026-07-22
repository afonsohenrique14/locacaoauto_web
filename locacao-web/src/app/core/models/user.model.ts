import { IndividualPerson } from "./individualPerson.model";
import { LegalPerson } from "./legalPerson.mode";

export interface User {
  id: string;
  email: string;
  personId: string | null;
  person: IndividualPerson | LegalPerson | null;
  createdAt: string;
  token: string;
}
