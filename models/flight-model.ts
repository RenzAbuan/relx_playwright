export type TravellerType = 'Adults' | 'Children' | 'Infants on lap';
export type FlightType = 'Return' | 'One-way' | 'Multi-city';   

export interface FlightSearchCriteria {
  testCaseName: string;
  flightType: FlightType;
  originCode: string;
  destinationCode: string;
  departureDate: string;
  returnDate?: string;
  travelerType: TravellerType;
  travelerCount: number;
  expectedDepartureCity: string;
  expectedArrivalAirport: string;
}
