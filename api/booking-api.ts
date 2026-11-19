import test, { APIRequestContext, APIResponse } from "@playwright/test";
import { Booking } from "../models/booking.model";
import { CreateBookingResponse, CreateBookingResponseBody } from "../models/create-booking-response.model";
import { BookingResponse } from "../models/get-booking-response.model";
import { DeleteBookingResponse } from "../models/delete-booking-response.model";

export class BookingApi {
  readonly request: APIRequestContext;
  private readonly baseUrl = 'https://restful-booker.herokuapp.com';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  async createBooking(payload: Booking | Record<string, unknown>): Promise<CreateBookingResponse> {
    const response = await this.request.post(`${this.baseUrl}/booking`, {
      data: payload,
    });
    const responseBody = response.ok()
      ? ((await response.json()) as CreateBookingResponseBody)
      : (null as unknown as CreateBookingResponseBody);

    return {
      status: response.status(),
      responseBody,
    };
  }

  async getBooking(bookingId: number): Promise<BookingResponse> {
    const response = await this.request.get(`${this.baseUrl}/booking/${bookingId}`);
    const responseBody = response.ok()
      ? ((await response.json()) as Booking)
      : (null as unknown as Booking);

    return {
      status: response.status(),
      responseBody,
    };
  }

  async updateBooking(
    bookingId: number,
    payload: Booking,
    token?: string
  ): Promise<BookingResponse> {
    const response = await this.request.put(`${this.baseUrl}/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
      data: payload,
    });
    const responseBody = response.ok()
      ? ((await response.json()) as Booking)
      : (null as unknown as Booking);

    return {
      status: response.status(),
      responseBody,
    };
  }

  async deleteBooking(bookingId: number, token: string): Promise<DeleteBookingResponse> {
    const response = await this.request.delete(`${this.baseUrl}/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
    });
    const responseBody = await response.text();

    return {
      status: response.status(),
      responseBody,
    };
  }
}