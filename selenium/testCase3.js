import {
    Builder,
    By,
    until
} from 'selenium-webdriver';

import {
    expect
} from 'chai';

import {
    promisify
} from 'util';

const sleep = promisify(setTimeout);

(async function testCase3() {
    let driver = await new Builder().forBrowser('chrome').build();

    let items = [{
        itemType: "Stuffed Frog",
        id: "2",
        price: 10.99,
        toBuy: 2
    }, {
        itemType: "Fluffy Bunny",
        id: "4",
        price: 9.99,
        toBuy: 2
    }, {
        itemType: "Stuffed Frog",
        id: "7",
        price: 14.99,
        toBuy: 3
    }, ]

    try {
        //Navigate to URL
        await driver.get('https://jupiter.cloud.planittesting.com/#/shop');
        let shopBtn = await driver.wait(until.elementLocated(By.css('li[id="nav-shop"]')), 10000);
        await driver.wait(until.elementIsVisible(shopBtn), 10000);
        await sleep(500);

        //Loop trough the given items
        for (let i = 0; i < items.length; i++) {
            //Loop trough how many times to buy an item
            for (let j = 0; j < items[i].toBuy; j++) {
                let productElement = await driver.findElement(By.id(`product-${items[i].id}`));
                let button = await productElement.findElement(By.css('a.btn.btn-success'));
                await button.click();
            }
        }
        await driver.findElement(By.id('nav-cart')).click();
        await sleep(500);
        await driver.wait(until.elementIsVisible(driver.findElement(By.css('a.btn-checkout.btn.btn-success.ng-scope'))), 10000);

        //Verify Subtotal
        let total = 0;
        for (let i = 0; i < items.length; i++) {
            let subTotal = await driver.findElement(By.xpath(`/html/body/div[2]/div/form/table/tbody/tr[${i + 1}]/td[4]`)).getText();
            let expectedSubtotal = `$${items[i].price *  items[i].toBuy}`
            total = total + parseFloat(subTotal.replace("$", ""))
                //Assert if equal
            expect(subTotal).to.equal(expectedSubtotal);
        }

        //Verify price for each product
        for (let i = 0; i < items.length; i++) {
            let productPrice = await driver.findElement(By.xpath(`/html/body/div[2]/div/form/table/tbody/tr[${i + 1}]/td[2]`)).getText();
            let expectedSubtotal = `$${items[i].price}`

        //Assert if equal
            expect(productPrice).to.equal(expectedSubtotal);
        }

        //Verify that total = sum(sub totals)
        let totalPrice = await driver.findElement(By.css(`strong[class="total ng-binding"]`)).getText();
        expect(totalPrice).to.equal(`Total: ${total}`);

    } finally {
        await driver.quit();
    }

})();

