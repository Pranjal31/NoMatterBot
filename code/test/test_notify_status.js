const puppeteer = require('puppeteer');
const notifier = require('../status_notify.js');
const mockStatChange = require('./mock/mockStatChange.json');
const chalk = require('chalk');

const chai = require("chai");
const expect = chai.expect;
const dbConnManager = require('../dbConnManager.js')

var config = {};

// retrieve api tokens
config.mmurl = process.env.MATTERMOSTURL;
config.loginEmail = process.env.MATTERMOST_EMAIL;	
config.channelname = process.env.CHANNELNAME;
config.loginPassword = process.env.MATTERMOST_PWD;

describe('Notify status using puppeteer', function () {

  let browser;
  let page;
  let msgId;

  this.timeout(5000000);

  beforeEach(async () => {
      browser = await puppeteer.launch({headless: true, args: ["--no-sandbox", "--disable-web-security"]}); 
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

    var expectedMsg = "Issue: #24 ahahah in repo: test1 is now in progress";	

    var channelName = config.channelname;		

    msgId = await notifier.notifyStatChange("psharma9", mockStatChange.repository.name, mockStatChange.issue.number, mockStatChange.issue.title, mockStatChange.label.name);

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
