const puppeteer = require('puppeteer')
const notifier = require('../status_notify.js')

var config = {};

// retrieve api tokens
config.mmurl = process.env.MATTERMOSTURL;
config.channelid = process.env.CHANNELID;


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

  async function navigate_to(page, channelid) {
    await page.waitForSelector(`[data-channelid=${channelid}]`)
    await page.click(`[data-channelid=${channelid}`)
  }

  async function hasMsgId(page, msgId)
  {
    try
    {
      await page.waitForXPath()
  }

  (async () => {

    msgId = await notifier.notify_change(test_json);

    const browser = await puppeteer.launch({headless: false, args: ["--no-sandbox", "--disable-web-security"]});
    let page = await login( browser, `${config.mmurl}/login` );
    await navigateTo(page, config.channelid);
    await hasMsgId(page, msgId)
    
    //await postMessage(page, "Hello world from browser automation" );
  
    // const html = await page.content(); // serialized HTML of page DOM.
    // browser.close();
  })()