import { ClimateDTO } from "../../../models/DTO/climateDTO.ts";
import { arrayURLS } from "./urls.ts";
import puppeteer, { Browser, Page } from "puppeteer";

export class ClimateService {
  async GetClimateByCity(city: string) {
    const url = this.serchUrlFromCity(city);

    try {
      if (url) return await this.getClimateFromCityByURL(url);
      else throw "city not found";
    } catch (e) {
      return e;
    }
  }

  private serchUrlFromCity(city: string): string | undefined {
    const stringCityFormated = this.formatStringToSerch(city);
    return arrayURLS
      .filter((url) => {
        return url.includes("/" + stringCityFormated + "-");
      })
      .pop();
  }

  private formatStringToSerch(texto: string): string {
    return texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replaceAll(" ", "");
  }

  private async getClimateFromCityByURL(
    url: string
  ): Promise<ClimateDTO | unknown> {
    const [browser, page] = await this.creatingAmbientForPuppeteer();
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      // console.log(url);

      const climateData = await this.getClimate(browser, page);
      if (climateData) return climateData;
      else throw "climate not found";
    } catch (error) {
      return error;
    } finally {
      await browser.close();
    }
  }

  private async creatingAmbientForPuppeteer(): Promise<[Browser, Page]> {
    const browser = await this.creatingBrowserFromPuppeteer();
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    this.abortingResourceFromRequest(page);
    return [browser, page];
  }

  private async getClimate(
    browser: Browser,
    page: Page
  ): Promise<ClimateDTO | null> {
    try {
      return await page.evaluate(() => {
        const variablesList = document.querySelector(".variables-list");
        const umidaty = variablesList
          ?.querySelectorAll(".item")[3]
          ?.querySelectorAll(".-gray-light");

        const tempElementMin = document.querySelector("#min-temp-1");
        const tempElementMax = document.querySelector("#max-temp-1");

        return {
          umidatyMin: umidaty?.[0]?.textContent?.trim() || null,
          umidatyMax: umidaty?.[1]?.textContent?.trim() || null,
          rain:
            variablesList
              ?.querySelector("._margin-l-5")
              ?.textContent.trim()
              .replace(/[\n\t]/g, "") || null,
          tempMin: tempElementMin?.textContent?.trim() || null,
          tempMax: tempElementMax?.textContent?.trim() || null,
        };
      });
    } catch (error) {
      console.error("Erro durante a execução:", error);
      return null;
    }
  }

  private async creatingBrowserFromPuppeteer(): Promise<Browser> {
    return await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });
  }

  private async abortingResourceFromRequest(page: Page) {
    page.on("request", (request) => {
      const resourceType = request.resourceType();

      if (
        resourceType === "image" ||
        resourceType === "stylesheet" ||
        resourceType === "font" ||
        resourceType === "script"
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });
  }
}
