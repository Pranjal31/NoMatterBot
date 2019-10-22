const puppeteer = require('puppeteer')
const stale = require('../stale')
const mockStatChange = require('../mock_statChange.json')
const chalk = require('chalk')

var config = {};

// retrieve api tokens
config.mmurl = process.env.MATTERMOSTURL;
config.channelName = process.env.CHANNELNAME;
config.loginEmail = process.env.MATTERMOST_EMAIL;
config.loginPassword = process.env.MATTERMOST_PWD;

async function login(browser, url) {
    const page = await browser.newPage();
  
    await page.goto(url, {waitUntil: 'networkidle0'});
  
    // Login
    await page.type('input[id=loginId]', config.loginEmail);
    await page.type('input[id=loginPassword]', config.loginPassword);
    await page.click('button[id=loginButton]');
  
    // Wait for redirect
    await page.waitForNavigation();
    return page;
  }

  async function navigateTo(page, channelName) {
    await page.waitForSelector('#sidebarItem_'+channelName)
    await page.click('#sidebarItem_'+channelName)
  }

  async function hasInteractiveMsg(page, msgId, expectedMsg)
  {
    var postId = "postMessageText_" + msgId;
    try
    {
      await page.waitForSelector('#'+postId);
      const textEle = await page.$x(`//*[contains(@id, "${postId}")]/p`);
      const text = await (await textEle[0].getProperty('textContent')).jsonValue();
      
      if (!(text === expectedMsg))
      {
        throw "Message did not match!!";
      }

      await page.setRequestInterception(true);
      respBody = {}

      await page.on('request', request => {
        if (request.url().endsWith('/triggers/'))
        {
            respBody = request.body();
        }
            request.continue();
      });

      return respBody;
    }
    catch(err)
    {
      throw err;
    }
  }

  async function hasMsg(page, msgId, expectedMsg)
  {
    var postId = "postMessageText_" + msgId;
    try
    {
      await page.waitForSelector('#'+postId);
      const textEle = await page.$x(`//*[contains(@id, "${postId}")]/p`);
      const text = await (await textEle[0].getProperty('textContent')).jsonValue();
      
      if (!(text === expectedMsg))
      {
        throw "Message did not match!!";
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
      var msgId = await stale.Stale_Issues();

      var expectedMsg1 = "Hola, The following issue have no activity on them from 6 months ";
      var expectedMsg2 = "Mischeif Managed";
      
      //console.log(msgId);

      const browser = await puppeteer.launch({headless: false, args: ["--no-sandbox", "--disable-web-security"]});
      let page = await login( browser, `${config.mmurl}/login` );
      await navigateTo(page, config.channelName);
      var respBody = await hasInteractiveMsg(page, msgId, expectedMsg1);

      var msgId = await stale.assign();

      await hasMsg(page, msgId, expectedMsg2);

      //console.log(chalk.green('Test Case Notify Status Successful!'));
     }
     catch(err)
     {
        //console.log(err);
        //console.log(chalk.red('Test Case Notify Status Failed!!!'));
     }
    
    // //await postMessage(page, "Hello world from browser automation" );
  
    //  const html = await page.content(); // serialized HTML of page DOM.
    // browser.close();
  })()