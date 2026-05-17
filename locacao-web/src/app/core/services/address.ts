import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Address } from '../models/address.model';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  private http = inject(HttpClient)

  private readonly apiUrl = environment.apiUrl;

  FindAddress(zipcode: string){
    return this.http.get<Address>(`${this.apiUrl}/addresses/${zipcode}`)
  }

}
