const puppeteer = require('puppeteer');
const notifier = require('../status_notify.js');
const mockStatChange = require('../mock_statChange.json');
const chalk = require('chalk');

const chai = require("chai");
const expect = chai.expect;

var config = {};

// retrieve api tokens
config.mmurl = process.env.MATTERMOSTURL;
config.userchannel = process.env.CHANNELUSERID;
config.botchannel = process.env.BOTUSERID;
config.loginEmail = process.env.MATTERMOST_EMAIL;
config.loginPassword = process.env.MATTERMOST_PWD;

describe('Notify status using puppeteer', function () {

  let browser;
  let page;
  let msgId;

  this.timeout(5000000);

  beforeEach(async () => {
      browser = await puppeteer.launch({headless: false, args: ["--no-sandbox", "--disable-web-security"]});
      page = await browser.newPage();
      await page.goto(`${config.mmurl}/login`, {waitUntil: 'networkidle0'});
      await page.type('input[id=loginId]', config.loginEmail);
      await page.type('input[id=loginPassword]', config.loginPassword);
      await page.click('button[id=loginButton]');
    
      // Wait for redirect
      await page.waitForNavigation();
  });

  afterEach(async () => {
      await browser.close();
  });

  it('Should show status notification', async () => {

    var expectedMsg = "Issue: #24 ahahah is now in progress";

    var channelName = config.userchannel+"__"+config.botchannel;

    msgId = await notifier.notify_change(mockStatChange);

    var postId = "postMessageText_" + msgId;

    await page.waitForSelector('#sidebarItem_'+ channelName);
    await page.click('#sidebarItem_'+ channelName);

    await page.waitForSelector('#postMessageText_' + msgId);

    const textEle = await page.$x(`//*[contains(@id, "${postId}")]/p`);
    const text = await (await textEle[0].getProperty('textContent')).jsonValue();

    expect(text).to.eql(expectedMsg);

    await browser.close();
  });  
});