import test, { expect } from "@playwright/test";
import { HomePage } from "../pages/home.page";
import { searchFlightCases } from "../data/flight-search.data";

test('Invalid airport code should yield no results', async ({ page }) => {
    const homePage = new HomePage(page);

    await homePage.goto();
    await homePage.setOrigin('nljld');
    await expect(page.getByText('No matching locations found.')).toBeVisible();
});

test.describe('Flight Search Scenarios', () => {
    for (const data of searchFlightCases) {
        test(`Search flights: ${data.testCaseName}`, async ({ page }) => {
            const homePage = new HomePage(page);

            await homePage.goto();
            await homePage.selectTripType(data.flightType);
            await homePage.setOriginAndDestination(data.originCode, data.destinationCode);
            await homePage.selectDate(data.departureDate);

            if (data.flightType === 'Return' && data.returnDate) {
                await homePage.selectDate(data.returnDate);
            }

            await homePage.fillUpTravellers(data.travelerType, data.travelerCount);

            const flightsPage = await homePage.clickSearch();
            await flightsPage.waitForResults();

            // check URL
            const expectedPathPattern =
                data.flightType === 'Return' && data.returnDate
                    ? new RegExp(`/flight-search/${data.originCode}-${data.destinationCode}/${data.departureDate}/${data.returnDate}`)
                    : new RegExp(`/flight-search/${data.originCode}-${data.destinationCode}/${data.departureDate}`);

            await expect(flightsPage.page).toHaveURL(expectedPathPattern);

            expect(await flightsPage.getLegAirports(2, 0, 'Departure')).toContain(data.expectedDepartureCity);
            expect(await flightsPage.getLegAirports(2, 0, 'Arrival')).toContain(data.expectedArrivalAirport);
        });
    }
});
