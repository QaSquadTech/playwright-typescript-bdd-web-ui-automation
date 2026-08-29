import {createBdd} from "playwright-bdd";
import openUrl from "@support/framework-helpers/openUrl";
import {ENVINFO} from "../env/envInfo";
import {test} from "@support/globalParamConfig/fixtures";
import {PageManager} from "@pages/pageManager";
import {expect} from "@playwright/test";

const {Given} = createBdd(test)

Given(/^I navigate to the website$/, async function ({page}) {
    await openUrl(page, ENVINFO.ui.baseUrl);
})

Given(/^I login with default credentials$/, async function ({page}) {
    await new PageManager(page).loginPage.isLoaded();
    await new PageManager(page).loginPage.loginAsDefaultUser()
    expect(await new PageManager(page).inventoryPage.isLoaded()).toBeTruthy()
})

Given(/^I add the item "(.*)" to cart$/, async function ({page}, itemName: string) {
    await new PageManager(page).inventoryPage.addItemToCart(itemName)
})

Given(/^I complete express checkout$/, async function ({page}) {
    await new PageManager(page).inventoryPage.goToCart();
    await new PageManager(page).cartPage.isLoaded()
    await new PageManager(page).cartPage.clickCheckOut()
    await new PageManager(page).checkoutStep1.isLoaded()
    await new PageManager(page).checkoutStep1.fillPersonalInfo()
    await new PageManager(page).checkoutStep2.isLoaded()
    await new PageManager(page).checkoutStep2.finishCheckout()
    await new PageManager(page).checkoutComplete.isLoaded()
    await new PageManager(page).checkoutComplete.verifySuccessfulCheckoutMsg()
})

