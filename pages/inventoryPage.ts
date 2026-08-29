import {expect, Locator, Page} from "@playwright/test";
import {BasePage} from "@pages/basePage";
import getCurrentUrl from "@support/framework-helpers/getCurrentUrl";
import {ENVINFO} from "../env/envInfo";

export class InventoryPage extends BasePage {

    private inventoryList: Locator
    private inventoryItem: Locator
    private shoppingCartlink: Locator;


    constructor(page: Page) {
        super(page);
        this.inventoryList = page.getByTestId("inventory-list")
        this.inventoryItem = this.inventoryList.getByTestId("inventory-item")
        this.shoppingCartlink = page.locator("[data-test='shopping-cart-link']")
    }

    async isLoaded(): Promise<boolean> {
        await this.page.waitForURL((url) => url.href.includes("inventory"), {timeout: 80000})
        const currentUrl = getCurrentUrl(this.page)
        return (await currentUrl).includes("inventory");
    }

    async addItemToCart(itemName: string): Promise<void> {
        await this.inventoryList.waitFor({state: 'visible', timeout: ENVINFO.execution.defaultTimeout})

        let isItemFound = false;
        const totalItems = await this.inventoryItem.count()
        console.log(`Total item : ${totalItems}`)

        for (let i = 0; i < totalItems; i++) {
            const currentItemName = await this.inventoryItem.nth(i).getByTestId("inventory-item-name").innerText()
            if (currentItemName == itemName) {
                isItemFound = true
                console.log(`Item "${itemName}" found`)
                await this.inventoryItem.nth(i).getByText("Add to cart").click()
                await this.inventoryItem.nth(i).getByText("Remove").waitFor({
                    state: 'visible',
                    timeout: ENVINFO.execution.defaultTimeout
                },)
                break
            }
        }
        expect(isItemFound, "item not added to cart").toBeTruthy()
        console.log(`Item "${itemName}" added to cart successfully`)
    }

    async goToCart() {
        await this.shoppingCartlink.scrollIntoViewIfNeeded();
        await this.shoppingCartlink.click();
    }
}