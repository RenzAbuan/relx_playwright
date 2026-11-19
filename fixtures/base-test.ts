import { test as base } from '@playwright/test';
import { AuthApi } from '../api/auth-api';
import { Booking } from '../models/booking.model';
import { BookingApi } from '../api/booking-api';
// import { LoginPage } from '../pages/LoginPage'; // Your existing UI page objects

type MyFixtures = {
  authApi: AuthApi;
  bookingApi: BookingApi;
};

export const test = base.extend<MyFixtures>({
  authApi: async ({ request }, use) => {
    await use(new AuthApi(request));
  },
  bookingApi: async ({ request }, use) => {
    await use(new BookingApi(request));
  }
});

export { expect } from '@playwright/test';