import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";
import { IndividualPerson } from "../models/individualPerson.model";
import { LegalPerson } from "../models/legalPerson.mode";

// core/services/person.service.ts
@Injectable({ providedIn: 'root' })
export class PersonService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  findByCpf(cpf: string) {
    return this.http.get<IndividualPerson>(
      `${this.apiUrl}/persons/individual/cpf`,
      { params: { value: cpf } }
    );
  }

  findByCnpj(cnpj: string) {
    return this.http.get<LegalPerson>(
      `${this.apiUrl}/persons/legal/cnpj`,
      { params: { value: cnpj } }
    );
  }

  createIndividual(data: Omit<IndividualPerson, 'id'>) {
    return this.http.post<IndividualPerson>(`${this.apiUrl}/persons/individual`, data);
  }

  createLegal(data: Omit<LegalPerson, 'id'>) {
    return this.http.post<LegalPerson>(`${this.apiUrl}/persons/legal`, data);
  }
}
