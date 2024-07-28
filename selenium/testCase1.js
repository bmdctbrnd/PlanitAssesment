import {
  Builder,
  By,
  until
} from 'selenium-webdriver';

import {
  expect
} from 'chai';

(async function testCase1() {
  let driver = await new Builder().forBrowser('chrome').build();
  try {
      //Navigate to URL
      await driver.get('http://jupiter.cloud.planittesting.com');
      let contactBtn = await driver.wait(until.elementLocated(By.css('li[id="nav-contact"]')), 10000);
      await driver.wait(until.elementIsVisible(contactBtn), 10000);
      await contactBtn.click();

      //Navigate to Contact tab
      let element = await driver.wait(until.elementLocated(By.css('a.btn-contact.btn.btn-primary')), 10000);
      await driver.wait(until.elementIsVisible(element), 10000);
      await element.click();

      //Verify errors
      //Header Error
      let alertErr = await driver.wait(until.elementLocated(By.css('div.alert.alert-error.ng-scope')), 10000);
      await driver.wait(until.elementIsVisible(alertErr), 10000);
      let actualText = await alertErr.getText();
      let expectedText = `We welcome your feedback - but we won't get it unless you complete the form correctly.`;
      expect(actualText).to.equal(expectedText);

      let errIds = ["forename-err", "email-err", "message-err"]
      let errTxt = ["Forename", "Email", "Message"]

      //Verify Fields Error
      for (let i = 0; i < errIds.length; i++) {
          let spanElement = await driver.wait(until.elementLocated(By.id(errIds[i])), 10000);
          await driver.wait(until.elementIsVisible(spanElement), 10000);
          let actualText = await spanElement.getText();
          expect(actualText).to.equal(`${errTxt[[i]]} is required`);
      }

      let setFields = {
              forename: "Benedict",
              email: "test@email.com",
              message: "Test Message"
          }
          //Populate required fields
      for (const [key, value] of Object.entries(setFields)) {
          console.log(`Key: ${key}, Value: ${value}`);
          let inputElement = await driver.findElement(By.id(key));

          // Set the text content of the input element
          await inputElement.sendKeys(value);

          // Verify the text content to ensure it was set correctly
          let actualText = await inputElement.getAttribute('value');
          expect(actualText).to.equal(value);
      }

      //Validate errors are gone
      let isVisible;
      for (let i = 0; i < errIds.length; i++) {
          try {
              let messageError = await driver.findElement(By.css(`span[id="${errIds[i]}"]`));
              isVisible = await messageError.isDisplayed();
              if (!isVisible) {
                  console.error("Error message is still visible. Expected not")
              }
          } catch (e) {
              if (e.name === 'NoSuchElementError') {
                  console.log('Error messaged is not visible.');
              } else {
                  throw e;
              }
          }

      }

  } finally {
      await driver.quit();
  }

})();