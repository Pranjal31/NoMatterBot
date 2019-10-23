const puppeteer = require('puppeteer')
const assignee_recommend = require('../assignee_recommend.js')
const lib = require('../lib.js');
const mockStatChange = require('../mock_statChange.json')
const chalk = require('chalk');

const chai = require("chai");
const expect = chai.expect;
const nock = require("nock");

const mockIssues = require('../mockIssues.json');
const mockUsers = require('../mockUsers.json');
const mockNewIssue = require('../mockNewIssue.json');
const mockAssignee = "asmalunj";

var config = {};

// retrieve api tokens
config.mmurl = process.env.MATTERMOSTURL;
config.channelName = process.env.CHANNELNAME;
config.loginEmail = process.env.MATTERMOST_EMAIL;
config.loginPassword = process.env.MATTERMOST_PWD;

describe('Recommend assignee using puppeteer', function () {

  // MOCK SERVICE
  var mockIssueService = nock("https://api.github.ncsu.edu")
    .persist() // This will persist mock interception for lifetime of program.
    .get("/repos/asmalunj/test_repo/issues")
    .reply(200, JSON.stringify(mockIssues) );

  var mockUserService = nock("https://api.github.ncsu.edu")
    .persist() // This will persist mock interception for lifetime of program.
    .get("/repos/asmalunj/test_repo/collaborators")
    .reply(200, JSON.stringify(mockUsers) );

  var mockAssignService = nock("https://api.github.ncsu.edu")
    .persist() // This will persist mock interception for lifetime of program.
    .patch("/repos/asmalunj/test_repo/issues/" + mockNewIssue.issue_id)
    .reply(200, JSON.stringify(mockUsers) );

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

  it('Should show assignee recommendations', async () => {

    var expectedMsg1 = "Ciao! I see that you recently created an issue " + mockNewIssue.issue_id;

    await page.waitForSelector('#sidebarItem_'+ config.channelName);
    await page.click('#sidebarItem_'+ config.channelName);
   
    msgId = await assignee_recommend.recommendAssignee(mockNewIssue);

    var postId = "postMessageText_" + msgId;

    await page.waitForSelector('#postMessageText_' + msgId);

    const textEle = await page.$x(`//*[contains(@id, "${postId}")]/p`);
    const text = await (await textEle[0].getProperty('textContent')).jsonValue();

    expect(text).to.eql(expectedMsg1);

    await browser.close();
  });

  it('Should ignore assignee recommendations', async () => {

    var expectedMsg3 = "All those CPU cycles for nothing? Okay ";

    var postId = "messageAttachmentList_" + msgId;

    await page.waitForSelector('#sidebarItem_'+ config.channelName);
    await page.click('#sidebarItem_'+ config.channelName);

    let selector = `#${postId} > div > div.attachment__content > div > div > div.attachment__body.attachment__body--no_thumb > div.attachment-actions > button`;

    await page.waitForSelector(selector);

    await page.click(selector);

    // await page.evaluate((selector) => document.querySelector(selector).click(), selector);

    var ignore_msgId = await assignee_recommend.ignoreRecommendations(mockNewIssue.creator);

    var ignore_post = "postMessageText_" + ignore_msgId;

    console.log(ignore_post);

    const textEle = await page.$x(`//*[contains(@id, "${ignore_post}")]/p`);
    const text = await (await textEle[0].getProperty('textContent')).jsonValue();

    expect(text).to.eql(expectedMsg3);

    await browser.close();
  });

  it('Should set assignee to Issue', async () => {

    var expectedMsg4 = "Done and dusted!";

    var postId = "messageAttachmentList_" + msgId;
    console.log("postid:"+postId);

    await page.waitForSelector('#sidebarItem_'+ config.channelName);
    await page.click('#sidebarItem_'+ config.channelName);

    let selector = `#${postId} > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(2)`;

    await page.waitForSelector(selector);
    //await page.focus(selector);
    //page.keyboard.type('asmalunj');

    await page.evaluate(() => document.querySelector(`#${postId} > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > input:nth-child(2)`).setAttribute('value', 'asmalunj'));

    var assign_msgId = await assignee_recommend.assign(mockNewIssue.creator, mockNewIssue.repo, mockNewIssue.issue_id, mockNewIssue.creator, mockAssignee);

    var assign_post = "postMessageText_" + assign_msgId;

    console.log(assign_post);

    const textEle = await page.$x(`//*[contains(@id, "${ignore_post}")]/p`);
    const text = await (await textEle[0].getProperty('textContent')).jsonValue();

    expect(text).to.eql(expectedMsg4);

    await browser.close();
  });

});