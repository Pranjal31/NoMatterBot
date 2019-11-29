const puppeteer = require('puppeteer');
//const assignee_recommend = require('../assignee_recommend.js');
const lib = require('../lib.js');
// const mockStatChange = require('../mock_statChange.json');	//FIXME //TODO
const chalk = require('chalk');
const stale = require('../stale.js');

const chai = require("chai");
const expect = chai.expect;
const nock = require("nock");

const mockIssues = require('../mockIssues.json');
const mockUser = require('../mockUser.json');	
const mockRepos = require('../mockRepos.json');		
const mockAssignee = "psharma9";	//TODO

var config = {};

// retrieve api tokens
config.mmurl = process.env.MATTERMOSTURL;
config.channelName = process.env.CHANNELNAME;
config.loginEmail = process.env.MATTERMOST_EMAIL;
config.loginPassword = process.env.MATTERMOST_PWD;

describe('Close or Ignore stale Issues', function () {

  // MOCK SERVICE
  var mockIssueService = nock("https://api.github.ncsu.edu")
    .persist() // This will persist mock interception for lifetime of program.
    .get("/repos/psharma9/test1/issues")	//TODO
    .reply(200, JSON.stringify(mockIssues) );

  var mockUserService = nock("https://api.github.ncsu.edu")
    .persist() // This will persist mock interception for lifetime of program.
    .get("/user")       
    .reply(200, JSON.stringify(mockUser);

  var mockReposService = nock("https://api.github.ncsu.edu")
    .persist() // This will persist mock interception for lifetime of program.
    .get("/users/psharma9/repos")
    .reply(200, JSON.stringify(mockRepos) );


//TODO
/*  var mockUserService = nock("https://api.github.ncsu.edu")
    .persist() // This will persist mock interception for lifetime of program.
    .get("/repos/psharma9/test1/collaborators")		//TODO
    .reply(200, JSON.stringify(mockUsers) );
*/

// TODO
/*  var mockAssignService = nock("https://api.github.ncsu.edu")
    .persist() // This will persist mock interception for lifetime of program.
    .patch("/repos/psharma9/test1/issues/" + mockNewIssue.issue_id)	
    .reply(200, JSON.stringify(mockUsers) ); */

  let browser;
  let page;
  let msgId;

  this.timeout(5000000);

  beforeEach(async () => {
      browser = await puppeteer.launch({headless: true, args: ["--no-sandbox", "--disable-web-security"]});	//TODO
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


  it('Should show stale issues', async () => {

    msgId = await stale.Stale_Issues();

    var expectedMsg1 = "Hey, Bot's up? \n The following open issues have had no activity in the last 6 months.";

    var postId = "postMessageText_" + msgId;

    await page.waitForSelector('#sidebarItem_'+ config.channelName);
    await page.click('#sidebarItem_'+ config.channelName);

    await page.waitForSelector('#'+postId);

    const textEle = await page.$x(`//*[contains(@id, "${postId}")]/p`);
    const text = await (await textEle[0].getProperty('textContent')).jsonValue();

    expect(text).to.eql(expectedMsg1);

    await browser.close();
  });
//TODO  -- as of now stale issue code isn't responsible for such a message
/*
  it('Should close Stale Issues', async () => {

    var expectedMsg2 = "Cool. It's done!";

    var postId = "messageAttachmentList_" + msgId;

    await page.waitForSelector('#sidebarItem_'+ config.channelName);
    await page.click('#sidebarItem_'+ config.channelName);

    let selector = `#${postId} > div > div.attachment__content > div > div > div.attachment__body.attachment__body--no_thumb > div.attachment-actions > button:nth-child(1)`;

    await page.waitForSelector(selector);

    await page.click(selector);

    // await page.evaluate((selector) => document.querySelector(selector).click(), selector);

    var close_msgId = await stale.close_all();

    var close_post = "postMessageText_" + close_msgId;

    //console.log(close_post);

    const textEle = await page.$x(`//*[contains(@id, "${close_post}")]/p`);
    const text = await (await textEle[0].getProperty('textContent')).jsonValue();

    expect(text).to.eql(expectedMsg2);

    await browser.close();
  });
*/
  it('Should ignore Stale Issues', async () => {

    var expectedMsg3 = "Alright! These issues(s) have been ignored for a day.";

    var postId = "messageAttachmentList_" + msgId;

    await page.waitForSelector('#sidebarItem_'+ config.channelName);
    await page.click('#sidebarItem_'+ config.channelName);

    let selector = `#${postId} > div > div.attachment__content > div > div > div.attachment__body.attachment__body--no_thumb > div.attachment-actions > button:nth-child(2)`;

    await page.waitForSelector(selector);

    await page.click(selector);

    // await page.evaluate((selector) => document.querySelector(selector).click(), selector);

    var ignore_msgId = await stale.ignoreAll(mockAssignee);	//TODO

    var ignore_post = "postMessageText_" + ignore_msgId;

    //console.log(ignore_post);

    const textEle = await page.$x(`//*[contains(@id, "${ignore_post}")]/p`);
    const text = await (await textEle[0].getProperty('textContent')).jsonValue();

    expect(text).to.eql(expectedMsg3);

    await browser.close();
  });

});
