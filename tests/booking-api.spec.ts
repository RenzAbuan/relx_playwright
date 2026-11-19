import { AuthApi } from '../api/auth-api';
import { invalidBooking, newBooking, updatedBooking } from '../data/booking-api.data';
import { test, expect } from '../fixtures/base-test';
import { Booking } from '../models/booking.model';

test.describe.serial('Positive Booking API Tests', () => {
    let bookingId: number;
    let token: string;

    test.beforeAll(async ({ authApi }) => {
        token = await authApi.createToken();
    });

    test('CreateBooking returns 200 and matching fields', async ({ bookingApi }) => {
        const { status, responseBody } = await bookingApi.createBooking(newBooking
        );
        expect(status).toBe(200);
        expect(typeof responseBody.bookingid).toBe('number');
        expect(responseBody.booking.firstname).toBe(newBooking.firstname);
        expect(responseBody.booking.lastname).toBe(newBooking.lastname);
        expect(responseBody.booking.totalprice).toBe(newBooking.totalprice);
        expect(responseBody.booking.depositpaid).toBe(newBooking.depositpaid);
        expect(responseBody.booking.bookingdates).toEqual(newBooking.bookingdates);
        expect(responseBody.booking.additionalneeds).toBe(newBooking.additionalneeds);

        bookingId = responseBody.bookingid;
    });

    test('GetBooking returns 200 and all booking fields', async ({ bookingApi }) => {
        const { status, responseBody } = await bookingApi.getBooking(bookingId);

        expect(status).toBe(200);
        expect(responseBody.firstname).toBe(newBooking.firstname);
        expect(responseBody.lastname).toBe(newBooking.lastname);
        expect(responseBody.totalprice).toBe(newBooking.totalprice);
        expect(responseBody.depositpaid).toBe(newBooking.depositpaid);
        expect(responseBody.bookingdates).toEqual(newBooking.bookingdates);
        expect(responseBody.additionalneeds).toBe(newBooking.additionalneeds);
    });

    test('UpdateBooking returns 200 and updated fields', async ({ bookingApi }) => {

        const { status, responseBody } = await bookingApi.updateBooking(
            bookingId,
            updatedBooking,
            token
        );

        expect(status).toBe(200);
        expect(responseBody.firstname).toBe(updatedBooking.firstname);
        expect(responseBody.lastname).toBe(updatedBooking.lastname);
        expect(responseBody.totalprice).toBe(updatedBooking.totalprice);
        expect(responseBody.depositpaid).toBe(updatedBooking.depositpaid);
        expect(responseBody.bookingdates).toEqual(updatedBooking.bookingdates);
        expect(responseBody.additionalneeds).toBe(updatedBooking.additionalneeds);
    });

    test('DeleteBooking returns 201 and subsequent GET returns 404', async ({ bookingApi }) => {
        const { status, responseBody } = await bookingApi.deleteBooking(bookingId, token);

        expect(status).toBe(201);
        expect(responseBody).toBe('Created');

        const afterDelete = await bookingApi.getBooking(bookingId);
        expect(afterDelete.status).toBe(404);
    });
});


test.describe('Negative Booking API Tests', () => {
    test('CreateBooking fails when required fields are missing', async ({ bookingApi }) => {
        const { status } = await bookingApi.createBooking(invalidBooking);

        expect(status).toBe(500);
    });

    test('GetBooking returns 404 for non-existent booking ID', async ({ bookingApi }) => {
        const { status } = await bookingApi.getBooking(999999999);

        expect(status).toBe(404);
    });

    test('UpdateBooking returns 403 when auth token is missing or invalid', async ({
        bookingApi,
    }) => {
        const created = await bookingApi.createBooking(newBooking);
        const bookingId = created.responseBody.bookingid;

        // Missing token
        const missingTokenRes = await bookingApi.updateBooking(bookingId, updatedBooking);
        expect(missingTokenRes.status).toBe(403);

        // Invalid token
        const invalidTokenRes = await bookingApi.updateBooking(
            bookingId,
            updatedBooking,
            '1231312321'
        );
        expect(invalidTokenRes.status).toBe(403);
    });

    test('DeleteBooking returns 403 without token and 405 for non-existent ID', async ({
        bookingApi, authApi
    }) => {
        let token = await authApi.createToken();

        const created = await bookingApi.createBooking(newBooking);
        const bookingId = created.responseBody.bookingid;

        // Unauthorized delete
        const unauthorizedRes = await bookingApi.deleteBooking(bookingId, 'asdasdasd');
        expect(unauthorizedRes.status).toBe(403);

        // Clean up valid booking, then attempt to delete it a second time
        await bookingApi.deleteBooking(bookingId, token);
        const nonExistentRes = await bookingApi.deleteBooking(bookingId, token);
        expect(nonExistentRes.status).toBe(405);
    });
});