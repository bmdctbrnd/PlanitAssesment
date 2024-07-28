import {
    Builder,
    By,
    until
} from 'selenium-webdriver';

import {
    expect
} from 'chai';

(async function testCase2() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        for (let i = 1; i <=5; i++) {
            console.log(`Executing test try: ${i}`)
            //Navigate to URL
            await driver.get('http://jupiter.cloud.planittesting.com');
            let contactBtn = await driver.wait(until.elementLocated(By.css('li[id="nav-contact"]')), 10000);
            await driver.wait(until.elementIsVisible(contactBtn), 10000);
            await contactBtn.click();

            //Navigate to Contact tab
            let element = await driver.wait(until.elementLocated(By.css('a.btn-contact.btn.btn-primary')), 10000);
            await driver.wait(until.elementIsVisible(element), 10000);

            let setFields = {
                    forename: "Benedict",
                    email: "test@email.com",
                    message: "Test Message"
                }
            // Populate mandatory fields
            for (const [key, value] of Object.entries(setFields)) {
                console.log(`Key: ${key}, Value: ${value}`);
                let inputElement = await driver.findElement(By.id(key));

                // Set the text content of the input element
                await inputElement.sendKeys(value);

                // Verify the text content to ensure it was set correctly
                let actualText = await inputElement.getAttribute('value');

                expect(actualText).to.equal(value);
            }

            //Submit
            await element.click();

            //Wait for loading dialog to be not visible
            await driver.wait(until.elementIsNotVisible(driver.findElement(By.css('div[class="popup modal hide ng-scope in"]'))), 30000);

            let successMsg = await driver.wait(until.elementLocated(By.css('div[class="alert alert-success"]')), 10000);
            await driver.wait(until.elementIsVisible(successMsg), 10000);
            let successTxt = await successMsg.getText();

            expect(successTxt).to.equal(`Thanks ${setFields.forename}, we appreciate your feedback.`);
        }
    } finally {
        await driver.quit();
    }

})();