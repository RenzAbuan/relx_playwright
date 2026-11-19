import { Page, Locator } from '@playwright/test';

export class FlightsPage {
  readonly page: Page;
  readonly resultsContainer: Locator;

  constructor(page: Page) {
    // `this.page` now points to the newly opened tab
    this.page = page;
    this.resultsContainer = page.locator('#flight-results-list-wrapper');
  }

  async waitForResults() {
    await this.resultsContainer.waitFor({ state: 'visible' });
  }

  async getResultCard(itemNumber: number): Promise<Locator> {
    return this.page.getByRole('group', { name: `Result item ${itemNumber}`, exact: true });
  }

  async getFlightLeg(itemNumber: number, legIndex: 0 | 1): Promise<Locator> {
    return (await this.getResultCard(itemNumber)).getByRole('listitem').nth(legIndex);
  }

  async getLegAirports(
    itemNumber: number,
    legIndex: 0 | 1,
    airport: 'Departure' | 'Arrival'
  ): Promise<string> {
    const leg = await this.getFlightLeg(itemNumber, legIndex);

    const airports = leg.locator('.EFvI').locator('[title]');

    const airportName = airport === 'Departure' ? airports.first() : airports.last();

    return await airportName.getAttribute('title') ?? '';
  } 
}