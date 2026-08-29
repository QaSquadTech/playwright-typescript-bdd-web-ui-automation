import {generate} from 'cucumber-html-reporter';

const options: {
    theme: "bootstrap" | "hierarchy" | "foundation" | "simple";
    jsonFile: string;
    output: string;
    reportSuiteAsScenarios: boolean;
    screenshotDirectory: string;
    storeScreenShots: boolean,
    launchReport: boolean;
    metadata: {
        "App Version": string;
        "Test Environment": string;
        Browser: string;
        Platform: string;
        Executed: string;
    };
} = {
    theme: "bootstrap", // Ensure the theme is one of the allowed literal values
    jsonFile: 'reports/cucumber_report.json',
    output: 'reports/cucumber_report.html',
    screenshotDirectory: "screenshots",
    storeScreenShots: true,
    reportSuiteAsScenarios: true,
    launchReport: true,
    metadata: {
        "App Version": "1.0",
        "Test Environment": "STAGING",
        "Browser": "Chrome",
        "Platform": "Windows 11",
        "Executed": "Local"
    }
}

generate(options);