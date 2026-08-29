import {LoginPage} from "@pages/loginPage";
import {Page} from "@playwright/test";
import {InventoryPage} from "@pages/inventoryPage";
import {CartPage} from "@pages/cartPage";
import {CheckoutStepOnePage} from "@pages/checkout-step-onePage";
import {CheckoutStepTwoPage} from "@pages/checkout-step-twoPage";
import {CheckoutComplete} from "@pages/checkout-complete";
// import {CheckoutPage} from "@pages/checkoutPage";
// import {CheckoutStepOnePage} from "@pages/checkout-step-onePage";
// import {CheckoutStepTwoPage} from "@pages/checkout-step-twoPage";
// import {CheckoutComplete} from "@pages/checkout-complete";

export class PageManager {
    readonly loginPage: LoginPage
    readonly inventoryPage: InventoryPage
    readonly cartPage: CartPage
    readonly checkoutStep1: CheckoutStepOnePage
    readonly checkoutStep2: CheckoutStepTwoPage
    readonly checkoutComplete: CheckoutComplete


    constructor(page: Page, itemInfo: string = "0") {
        this.loginPage = new LoginPage(page);
        this.inventoryPage = new InventoryPage(page)
        this.cartPage = new CartPage(page)
        this.checkoutStep1 = new CheckoutStepOnePage(page)
        this.checkoutStep2 = new CheckoutStepTwoPage(page)
        this.checkoutComplete = new CheckoutComplete(page)
    }
}