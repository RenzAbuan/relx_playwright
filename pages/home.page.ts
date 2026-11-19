import { Locator, Page } from "@playwright/test";
import { FlightType, TravellerType } from "../models/flight-model";
import { FlightsPage } from "./flights.page";

export class HomePage {
  readonly page: Page;
  readonly signInButton: Locator;
  readonly logo: Locator;
  readonly flightType: Locator;
  readonly searchForFlightsButtton: Locator;
  readonly originLocation: Locator;
  readonly originInputList: Locator;
  readonly destinationLocation: Locator;
  readonly destinationInputList: Locator;
  readonly tripTypeGrp: Locator;
  readonly removeLocationButton: Locator;
  readonly departureDate: Locator;
  readonly returnDate: Locator;
  readonly dateSelector: Locator;
  readonly travellerTypeSelector: Locator;
  readonly selectDateButton: Locator;
  readonly travellerTypeButton: Locator;
  readonly childAgeSelector: Locator;
  readonly searchFlightButton: Locator;
  readonly progressBar: Locator;
  readonly nextMonthButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.logo = page.locator('.gPDR-main-logo')
    this.signInButton = page.locator('[aria-label="Sign in"]')
    this.searchForFlightsButtton = page.getByRole('link', { name: 'Search for flights' });
    this.tripTypeGrp = page.getByRole('radiogroup', {name: 'Trip type'})
    this.flightType = page.getByRole('combobox', {name: 'Trip type Return'})
    this.originLocation = page.getByRole('combobox', { name: 'Origin location' });
    this.originInputList = page.locator('#flight-origin-smarty-input-list');
    this.destinationLocation = page.locator('input[data-test-destination]');
    this.destinationInputList = page.getByRole('listbox', {name: 'Destination airports'})
    this.removeLocationButton = page.getByRole('button', {name: 'Remove value'});
    this.departureDate = page.getByRole('button', {name: 'Departure date'});
    this.returnDate = page.getByRole('button', {name: 'Return date'});
    this.dateSelector = page.locator('.BdbJ-pill').nth(0);
    this.travellerTypeSelector = page.locator('.BdbJ-pill').nth(1);
    this.selectDateButton = page.locator('.g_wN-dialog-footer-button');
    this.travellerTypeButton = page.locator('#ffd-traveler-type-handle');
    this.childAgeSelector = page.getByRole('combobox', { name: 'Age Age' });
    this.searchFlightButton = page.getByRole('button', {name: 'Search'});
    this.progressBar = page.getByRole('progressbar');
    this.nextMonthButton = page.getByRole('button', { name: 'Next month' });
  }

  async goto() {
    await this.page.goto('https://www.cheapflights.com.au/', {waitUntil: 'domcontentloaded'});
  }

  async selectTripType(flightType: FlightType){
    await this.flightType.click();
    await this.page.getByText(flightType).first().click();
  }

  async fillUpTravellers(travellerType: TravellerType, count: number, childrenAge: number[] = []){
    const defaultCount = travellerType === 'Adults' ? 1:0;
    while(count > defaultCount){
      await this.page.locator(`//*[@class="FkqV-inner" and contains(.,"${travellerType}")]`)
        .getByLabel('Increment')
        .click();
      
        count--;
    }

    if(travellerType === 'Children' && count > 0){
      for (let x = 0; x < count; x++) {
      const age = childrenAge[x];

      await this.childAgeSelector.nth(x).click();

      await this.page.getByRole('option', { name: String(age), exact: true }).click();
      }
    }
  }

  async setOrigin(origin: string){
    await this.removeDefaultSelectedLocations();
    await this.originLocation.waitFor({state: 'visible'});
    await this.originLocation.click();
    await this.originLocation.fill(origin);
  }

  async setDestination(destination: string){
    await this.destinationLocation.waitFor({state: 'visible'});
    await this.destinationLocation.click();
    await this.destinationLocation.fill(destination);
  }

  async setOriginAndDestination(origin: string, destination: string){
    await this.setOrigin(origin);
    await this.progressBar.waitFor({state: 'detached'});
    await this.originInputList.waitFor({state: 'visible'});
    await this.originInputList.getByText(origin).first().press('Enter');

    await this.setDestination(destination);
    await this.progressBar.waitFor({state: 'detached'});
    await this.destinationInputList.waitFor({state: 'visible'});
    await this.destinationInputList.getByText(destination).first().press('Enter');
  }

  async removeDefaultSelectedLocations(){
    while(await this.removeLocationButton.count() > 0){
      await this.removeLocationButton.first().click();
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  async clickSearch(): Promise<FlightsPage>{
    await this.searchFlightButton.click();

    const newTabEvent = this.page.context().waitForEvent('page');
    const newTab = await newTabEvent;

    await newTab.waitForLoadState('domcontentloaded');

    return new FlightsPage(newTab);
  }

  async clickDateSelector(){
    await this.dateSelector.click();
  }

  async clickTravellerTypeSelector(){
    await this.travellerTypeSelector.click();
  }

  async clickSelectDates(){
    await this.selectDateButton.click();
  }

  /**
   * 
   * @param date - Date to select, in YYYY-MM-DD format.
   */
  async selectDate(date: string){
    await this.nextMonthButton.waitFor({state: 'visible'});

    const [year, month, day] = date.split('-').map(Number);
    const monthName = new Intl.DateTimeFormat('en', {
      month: 'long',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(year, month - 1, day)));

    const targetMonthYear = `${monthName} ${year}`; // e.g., "January 2027"
    const monthCaptions = this.page.locator('table[role="grid"] caption');

    // Max 11 clicks
    for (let i = 0; i < 11; i++) {
      const visibleMonths = await monthCaptions.allTextContents();
      if (visibleMonths.some((m) => m.trim() === targetMonthYear)) {
        break;
      }
      await this.nextMonthButton.click();
    }

    const dateButton = await this.getDateButton(date);
    await dateButton.click();
  }

  async getDateButton(date: string): Promise<Locator> {
    const [year, month, day] = date.split('-').map(Number);

    const monthName = new Intl.DateTimeFormat('en', {
      month: 'long',
      timeZone: 'UTC',
    }).format(new Date(Date.UTC(year, month - 1, day)));

    const dateText = ` ${day} ${monthName}, ${year}`;

    return this.page.locator(
      `//div[@role="button" and contains(@aria-label, "${dateText}")]`
    );
  }
}