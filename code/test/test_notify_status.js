const puppeteer = require('puppeteer')
const notifier = require('../status_notify.js')
const mockStatChange = require('../mock_statChange.json')
const chalk = require('chalk')

var config = {};

// retrieve api tokens
config.mmurl = process.env.MATTERMOSTURL;
config.channelName = process.env.CHANNELNAME;

async function login(browser, url) {
    const page = await browser.newPage();
  
    await page.goto(url, {waitUntil: 'networkidle0'});
  
    // Login
    await page.type('input[id=loginId]', loginEmail);
    await page.type('input[id=loginPassword]', loginPassword);
    await page.click('button[id=loginButton]');
  
    // Wait for redirect
    await page.waitForNavigation();
    return page;
  }

  async function navigate_to(page, channelName) {
    await page.waitForSelector('#sidebarItem_'+channelName)
    await page.click('#sidebarItem_'+channelName)
  }

  async function hasMsg(page, msgId, expectedMsg)
  {
    try
    {
      await page.waitForSelector('#postMessageText_'+msgId);
      const textEle = await page.$x('//*[contains(@id, "postMessageText_jr5tr5q6mtb1zrz66mon98q98r")]/p');
      const text = await (await textEle[0].getProperty('textContent')).jsonValue();
      
      if (!(text === expectedMsg))
      {
        throw "You Lose!";
      }
    }
    catch(err)
    {
      throw err;
    }
  }

  (async () => {

    try
    {
      var msgId = await notifier.notify_change(mockStatChange);

      var expectedMsg = "Issue: #5 TestIssue is now in progress"
      
      //console.log(msgId);

      const browser = await puppeteer.launch({headless: false, args: ["--no-sandbox", "--disable-web-security"]});
      let page = await login( browser, `${config.mmurl}/login` );
      await navigateTo(page, config.channelName);
      await hasMsg(html, msgId, expectedMsg);
      console.log(chalk.green('Test Case Notify Status Successful!'));
     }
     catch(err)
     {
        console.log(err);
        console.log(chalk.red('Test Case Notify Status Failed!!!'));
     }
    
    // //await postMessage(page, "Hello world from browser automation" );
  
    //  const html = await page.content(); // serialized HTML of page DOM.
    // browser.close();
  })()