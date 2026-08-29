import {Locator, Page} from "@playwright/test";
import {BasePage} from "@pages/basePage";
import getCurrentUrl from "@support/framework-helpers/getCurrentUrl";
import logger from "@support/reporting-helpers/logger";

export class CheckoutStepTwoPage extends BasePage {

    private finishBtn: Locator;


    constructor(page: Page) {
        super(page);
        this.finishBtn = page.getByTestId("finish")
    }

    async isLoaded(): Promise<boolean> {
        await this.page.waitForURL((url) => url.href.includes("checkout-step-two"), {timeout: 80000})
        const currentUrl = getCurrentUrl(this.page)
        return (await currentUrl).includes("checkout-step-two");
    }

    async finishCheckout(): Promise<void> {
        await this.finishBtn.scrollIntoViewIfNeeded()
        await this.finishBtn.click()
        logger.info("Finish button clicked")
    }
}