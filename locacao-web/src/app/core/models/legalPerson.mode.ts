import { Person } from "./person.model";

export interface LegalPerson extends Person{
  cnpj: string;
  tradeName: string;
}
