import { Booking } from "../models/booking.model";

export const newBooking: Booking = {
    firstname: 'Johnny',
    lastname: 'Dino',
    totalprice: 10000,
    depositpaid: true,
    bookingdates: {
        checkin: '2026-12-01',
        checkout: '2026-12-05',
    },
    additionalneeds: 'Breakfast',
};

export const updatedBooking: Booking = {
    firstname: 'Johnny',
    lastname: 'Papa',
    totalprice: 450,
    depositpaid: true,
    bookingdates: {
        checkin: '2026-12-01',
        checkout: '2026-12-05',
    },
    additionalneeds: 'Airport transfer',
};

export const invalidBooking = {
    firstname: 'Johnny',
    lastname: 'Papa',
    totalprice: 450,
    additionalneeds: 'Airport transfer'
};