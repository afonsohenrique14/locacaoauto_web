import { License } from "./licence.model";
import { Person } from "./person.model";

export interface IndividualPerson extends Person{
  cpf: string;
  birthDate: string;
  license: License | null;
}
