import { Address } from './address.model';
import { VehicleResponse } from './vehicle-response.model';
import { RentalStatus, OptionsPeriod } from './rental.model';

export interface PersonSummary {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
}

export interface Rental_Details {
  id: string;
  tenant: PersonSummary;
  landLord: PersonSummary;
  vehicle: VehicleResponse;
  startDate: string;
  endDate: string;
  status: RentalStatus;
  period: OptionsPeriod;
  value: number;
  deposit: number;
}
