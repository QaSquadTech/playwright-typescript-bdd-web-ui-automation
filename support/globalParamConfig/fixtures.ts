import {test as base} from 'playwright-bdd';
import {PageManager} from "@pages/pageManager";


type BddFixtures = {
    pages: PageManager;
    scenarioContext: Record<string, any>;
};

export const test = base.extend<BddFixtures>({
    pages: async ({page}, use) => {
        await use(new PageManager(page));
    },
    scenarioContext: async ({}, use) => {
        await use({});
    },
});