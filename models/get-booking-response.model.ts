import { Booking } from "./booking.model";

export interface BookingResponse {
    status: number;
    responseBody: Booking;
}