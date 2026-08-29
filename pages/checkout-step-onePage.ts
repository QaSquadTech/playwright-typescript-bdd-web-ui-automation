import {Locator, Page} from "@playwright/test";
import {BasePage} from "@pages/basePage";
import getCurrentUrl from "@support/framework-helpers/getCurrentUrl";
import {ENVINFO} from "../env/envInfo";
import logger from "@support/reporting-helpers/logger";

export class CheckoutStepOnePage extends BasePage {

    private firstName: Locator;
    private lastName: Locator;
    private postalCode: Locator;
    private continueBtn: Locator

    constructor(page: Page) {
        super(page);
        this.firstName = page.getByTestId("firstName")
        this.lastName = page.getByTestId("lastName")
        this.postalCode = page.getByTestId("postalCode")
        this.continueBtn = page.getByTestId("continue")

    }

    async isLoaded(): Promise<boolean> {
        await this.page.waitForURL((url) => url.href.includes("checkout-step-one"), {timeout: 80000})
        const currentUrl = getCurrentUrl(this.page)
        return (await currentUrl).includes("checkout-step-one");
    }

    async fillPersonalInfo(): Promise<void> {
        await this.firstName.fill(ENVINFO.personalData.firstName)
        await this.lastName.fill(ENVINFO.personalData.lastName)
        await this.postalCode.fill(ENVINFO.personalData.postCode)
        await this.continueBtn.click()
        logger.info("Personal information filled up")
    }
}