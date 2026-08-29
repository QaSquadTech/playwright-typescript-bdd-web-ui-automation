import {Page} from "@playwright/test";
import {ENVINFO} from "../../env/envInfo";
import logger from "@support/reporting-helpers/logger";

export default async function (page: Page, website: string) {
    await page.goto(website, {waitUntil: 'domcontentloaded', timeout: ENVINFO.execution.defaultTimeout})
    logger.info(`Navigating to website: ${website}`);
}