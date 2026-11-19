import { Booking } from "./booking.model";

export interface CreateBookingResponse {
    status: number;
    responseBody: CreateBookingResponseBody;
}

export interface CreateBookingResponseBody {
  bookingid: number;
  booking: Booking;
}