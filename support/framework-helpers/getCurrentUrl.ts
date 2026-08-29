import {Page} from "@playwright/test";

export default async function (page: Page) {
    return page.url();
}