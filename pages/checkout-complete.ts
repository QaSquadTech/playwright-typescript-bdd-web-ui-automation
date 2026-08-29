import {expect, Locator, Page} from "@playwright/test";
import {BasePage} from "@pages/basePage";
import getCurrentUrl from "@support/framework-helpers/getCurrentUrl";
import {ENVINFO} from "../env/envInfo";
import logger from "@support/reporting-helpers/logger";

export class CheckoutComplete extends BasePage {

    private orderConfirmation: Locator;

    constructor(page: Page) {
        super(page);
        this.orderConfirmation = page.getByTestId("complete-header")
    }

    async isLoaded(): Promise<boolean> {
        await this.page.waitForURL((url) => url.href.includes("checkout-complete"), {timeout: 80000})
        const currentUrl = getCurrentUrl(this.page)
        return (await currentUrl).includes("checkout-complete");
    }

    async verifySuccessfulCheckoutMsg(): Promise<void> {
        await expect(this.orderConfirmation).toBeVisible({timeout: ENVINFO.execution.defaultTimeout})
        const confirmationMsg = await this.orderConfirmation.innerText();
        logger.info(`Order confirmation msg is displayed`);
        expect(confirmationMsg == "Thank you for your order!").toBeTruthy();
        logger.info("Order confirmation message verified")
    }
}