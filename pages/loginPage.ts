import {expect, Locator, Page} from "@playwright/test";
import {BasePage} from "@pages/basePage";
import getCurrentUrl from "@support/framework-helpers/getCurrentUrl";
import {ENVINFO} from "../env/envInfo";
import logger from "@support/reporting-helpers/logger";

export class LoginPage extends BasePage {

    private username: Locator;
    private password: Locator;
    private loginBtn: Locator;

    constructor(page: Page) {
        super(page);
        this.username = page.getByPlaceholder("Username")
        this.password = page.getByPlaceholder("Password")
        this.loginBtn = page.locator("#login-button")

    }

    async isLoaded(): Promise<boolean> {
        await this.page.waitForURL((url) => url.href.includes(ENVINFO.ui.baseUrl), {timeout: 80000})
        const currentUrl = getCurrentUrl(this.page)
        return (await currentUrl).includes(ENVINFO.ui.baseUrl);
    }

    async loginAsDefaultUser(): Promise<void> {
        await this.username.fill(ENVINFO.credentials.defaultUsername)
        await this.password.fill(ENVINFO.credentials.defaultPassword)
        await this.loginBtn.click();
        await expect(this.loginBtn).not.toBeVisible({timeout: ENVINFO.execution.defaultTimeout})
        logger.info(`Login successful`)
    }
}