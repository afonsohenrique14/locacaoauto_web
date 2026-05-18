import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IndividualPerson } from '../models/individualPerson.model';
import { User } from '../models/user.model';
import { LegalPerson } from '../models/legalPerson.mode';

@Injectable({
  providedIn: 'root',
})
export class CompleteProfileService {
  private http = inject(HttpClient);

  private readonly apiUrl = environment.apiUrl;

  completeIndividualProfile(data: Omit<IndividualPerson, 'id'>){
    return this.http.post<User>(`${this.apiUrl}/auth/complete-profile/individual`, data);
  }

  completeLegalProfile(data: Omit<LegalPerson, 'id'>) {
    return this.http.post<User>(`${this.apiUrl}/auth/complete-profile/legal`, data);
  }

}
