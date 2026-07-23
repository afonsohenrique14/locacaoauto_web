export const RENTAL_STATUS = {
  Scheduled: 'Scheduled',
  Active: 'Active',
  Expired: 'Expired',
  Cancelled: 'Cancelled',
  Renewed: 'Renewed',
  Closed: 'Closed'
}

export type RentalStatus = typeof RENTAL_STATUS[keyof typeof RENTAL_STATUS]

export const OPTIONS_PERIOD = {
  Daily: 'Daily',
  Weekly: 'Weekly',
  Biweekly: 'Biweekly',
  Monthly: 'Monthly'
}

export type OptionsPeriod = typeof OPTIONS_PERIOD[keyof typeof OPTIONS_PERIOD]

export interface Rental{
  id: string,
  tenantName: string,
  vehiclePlate: string,
  startDate: Date,
  endDate: Date,
  status: RentalStatus,
  value: number,
  period: OptionsPeriod

}
