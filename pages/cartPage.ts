import {Locator, Page} from "@playwright/test";
import {BasePage} from "@pages/basePage";
import getCurrentUrl from "@support/framework-helpers/getCurrentUrl";
import logger from "@support/reporting-helpers/logger";

export class CartPage extends BasePage {

    private checkoutBtn: Locator;


    constructor(page: Page) {
        super(page);
        this.checkoutBtn = page.locator("button:has-text('Checkout')")
    }

    async isLoaded(): Promise<boolean> {
        await this.page.waitForURL((url) => url.href.includes("cart"), {timeout: 80000})
        const currentUrl = getCurrentUrl(this.page)
        return (await currentUrl).includes("cart");
    }

    async clickCheckOut(): Promise<void> {
        await this.checkoutBtn.scrollIntoViewIfNeeded();
        await this.checkoutBtn.click();
        logger.info("Checkout Button clicked")
    }
}