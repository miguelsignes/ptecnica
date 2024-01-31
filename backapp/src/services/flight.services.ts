import puppeteer, { Browser, Page } from "puppeteer";
import { Flight } from "../models/flight";

class FlightServices {

  public async scrapping(
    origin: string,
    destination: string
  ): Promise<Flight[]> {

    const browser: Browser = await puppeteer.launch({ headless: false });
    let flights: Flight[] = [];

    try {
      const page = await browser.newPage();
      await page.goto(
        "https://www.google.com/travel/flights?hl=es-ES&curr=EUR",
        {
          waitUntil: "networkidle0",
        }
      );

      await this.inputInfo(page, origin, destination);

      const potentialFlights = await this.scrapData(page);

      flights = potentialFlights.map((flight) => {
        return new Flight(
          flight.price || "",
          flight.departureDate || "",
          flight.returnDate || "",
          flight.airLine || ""
        );
      });

      return flights;

    } catch (error) {

      console.error("Error during scraping process:", error);

    } finally {
      
      await browser.close();
    }
    return flights;
  }

  private async inputInfo(page: Page, from: string, to: string) {

    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1);

    const formattedDepartureDate = new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(currentDate);

    currentDate.setDate(currentDate.getDate() + 6);

    const formattedReturnDate = new Intl.DateTimeFormat("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(currentDate);

    await this.removeGoogleConsent(page);

    await page.locator(".e5F5td").wait();
    const flightInputs = await page.$$(".e5F5td");

    await flightInputs[0].click({ count: 3, delay: 200 });
    await page.keyboard.type(from, { delay: 200 });

    await page.keyboard.press("Enter");

    await flightInputs[1].click({ delay: 200 });
    await page.keyboard.type(to, { delay: 200 });

    await page.keyboard.press("Enter");

    const datePickers = await page.waitForSelector(".FMXxAd");
    await datePickers!.click({ delay: 200 });

    const dateFields = await page.$$(".FMXxAd");

    await dateFields[2].click({ delay: 200 });
    await page.keyboard.type(formattedDepartureDate, { delay: 200 });

    await dateFields[3].click({ delay: 200 });
    await page.keyboard.type(formattedReturnDate, { delay: 200 });

    await page.waitForSelector(".qxcyof");

    const confirmDateButton = await page.waitForSelector(".VfPpkd-RLmnJb");
    await confirmDateButton!.click();

    const searchFlightsButton = await page.waitForSelector('button[jsname="vLv7Lb"]');
    await searchFlightsButton!.click();

  }



  private async scrapData(page: Page) {

     await page.waitForSelector(".Rk10dc");

    // ORDENAMOS POR PRECIO
    const triggerMenuSelector = 'button[jsname="AefGQb"]';

    await page.waitForSelector(triggerMenuSelector);
    await page.click(triggerMenuSelector);

    await new Promise((r) => setTimeout(r, 1000));

    await page.evaluate(() => {
      const options = Array.from(
        document.querySelectorAll('li[class*="VfPpkd-StrnGf-rymPhb-ibnC6b"]')
      );
      const targetOption = options.find(
        (option) => option.textContent && option.textContent.includes("Precio")
      );
      if (targetOption) {
        (targetOption as HTMLElement).click();
      }
    });

    await new Promise((r) => setTimeout(r, 4000));
    await page.waitForSelector("div[jsname='YdtKid']");


    const departureTimeSelector = ".wtdjmc.YMlIz.ogfYpf.tPgKwe";
    await page.waitForSelector(departureTimeSelector);
    const departureTimes = (
      await page.$$eval(departureTimeSelector, (elements) =>
        elements.map((element) => element.textContent)
      )
    ).toString();


    const returnDateSelector = ".XWcVob.YMlIz.ogfYpf.tPgKwe";
    await page.waitForSelector(returnDateSelector);
    const returnDates = (
      await page.$$eval(returnDateSelector, (elements) =>
        elements.map((element) => element.textContent)
      )
    ).toString();


    const airlineNameElement = ".h1fkLb span:nth-child(1)";
    await page.waitForSelector(airlineNameElement);
    const airlineName = await page.$$eval(airlineNameElement, (elements) =>
      elements.map((element) => element.textContent))


    const priceSelector = ".U3gSDe .YMlIz > span";
    await page.waitForSelector(priceSelector);
    const price = (
      await page.$$eval(priceSelector, (elements) =>
        elements.map((element) => element.textContent)
      )
    ).toString();


    if (airlineName) {
      const prices = price.split(",");
      const departureTimeList = departureTimes.split(",");
      const returnDateList = returnDates.split(",");

      const flightList = [];

      for (let i = 0; i < prices.length; i++) {

        const currentAirlineName = airlineName[i];
        const trimmedAirlineName = currentAirlineName ? currentAirlineName.trim() : " ";

        const flight = new Flight(
          prices[i].trim(),
          departureTimeList[i].trim(),
          returnDateList[i].trim(),
          trimmedAirlineName
        );

        flightList.push(flight);
      }

      return flightList;
    } else {

      return [];
    }
  }



  async removeGoogleConsent(page: Page) {

     try {
    const url = await page.evaluate(() => location.href);

    if (url.startsWith("https://consent.google.com/")) {
      await page.waitForSelector(".lssxud", { timeout: 6000 }); 
      await page.click(".lssxud"); 
      await page.waitForSelector(".lssxud", { hidden: true, timeout: 6000 }); 
    }

    return true; 
  } catch (error) {

    console.error("Error removing Google consent:", error);
    return false; 
  }

  }



}
export default FlightServices;
