const puppeteer = require('puppeteer')
const assignee_recommend = require('../assignee_recommend.js')
const lib = require('../lib.js');
const mockStatChange = require('../mock_statChange.json')
const chalk = require('chalk');

const chai = require("chai");
const expect = chai.expect;
const nock = require("nock");

const mockRepos = require('../mockRepos.json');
const mockIssues = require('../mockIssues.json');
const mockUsers = require('../mockUsers.json');
const mockGetIssue = require('../mockGetIssue.json');
const mockNewIssue = require('../mockNewIssue.json');
const mockAssignee = "psharma9";

const dbConnManager = require('../dbConnManager.js')
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
    .get("/repos/psharma9/test1/issues")
    .reply(200, JSON.stringify(mockIssues) );

  var mockRepoService = nock("https://api.github.ncsu.edu")
    .persist() // This will persist mock interception for lifetime of program.
    .get("/user/repos?affiliation=owner")
    .reply(200, JSON.stringify(mockRepos) );

  var mockUserService = nock("https://api.github.ncsu.edu")
    .persist() // This will persist mock interception for lifetime of program.
    .get("/repos/psharma9/test1/collaborators")
    .reply(200, JSON.stringify(mockUsers) );

    var mockGetIssueService = nock("https://api.github.ncsu.edu")
    .persist() // This will persist mock interception for lifetime of program.
    .get("/repos/psharma9/test1/issues/" + mockGetIssue.number)
    .reply(200, JSON.stringify(mockGetIssue));

  var mockAssignService = nock("https://api.github.ncsu.edu")
    .persist() // This will persist mock interception for lifetime of program.
    .patch("/repos/psharma9/test1/issues/" + mockNewIssue.issue_id)
    .reply(200, JSON.stringify(mockNewIssue) );

  let browser;
  let page;
  let msgId;

  this.timeout(5000000);

  beforeEach(async () => {
      browser = await puppeteer.launch({headless: true, args: ["--no-sandbox","--disable-web-security"]});
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

    var expectedMsg1 = "Ciao! I see that you recently created an issue #" + mockNewIssue.issue_id + " with title: " + mockNewIssue.issue_title;

    await page.waitForSelector('#sidebarItem_'+ config.channelName);
    await page.click('#sidebarItem_'+ config.channelName);

    msgId = await assignee_recommend.recommendAssignee(mockNewIssue,3);

    var postId = "postMessageText_" + msgId;
    await page.waitForSelector('#postMessageText_' + msgId);

    const textEle = await page.$x(`//*[contains(@id, "${postId}")]/p`);
    const text = await (await textEle[0].getProperty('textContent')).jsonValue();

    expect(text).to.eql(expectedMsg1);

    await browser.close();
  });

  it('Should ignore assignee recommendations', async () => {

    var expectedMsg3 = "All those CPU cycles wasted for nothing? Okay ";

    var postId = "messageAttachmentList_" + msgId;

    await page.waitForSelector('#sidebarItem_'+ config.channelName);
    await page.click('#sidebarItem_'+ config.channelName);

    let selector = `#${postId} > div > div.attachment__content > div > div > div.attachment__body.attachment__body--no_thumb > div.attachment-actions > button`;

    await page.waitForSelector(selector);

    await page.click(selector);

    var ignore_msgId = await assignee_recommend.ignoreRecommendations(mockNewIssue.creator);

    var ignore_post = "postMessageText_" + ignore_msgId;

    const textEle = await page.$x(`//*[contains(@id, "${ignore_post}")]/p`);
    const text = await (await textEle[0].getProperty('textContent')).jsonValue();

    expect(text).to.eql(expectedMsg3);

    await browser.close();
  });

  it('Should set assignee to Issue', async () => {

    var expectedMsg2 = "Done and dusted!";

    var postId = "messageAttachmentList_" + msgId;

    await page.waitForSelector('#sidebarItem_'+ config.channelName);
    await page.click('#sidebarItem_'+ config.channelName);

    let selector = `div#${postId} > div > div.attachment__content > div > div > div.attachment__body.attachment__body--no_thumb > div.attachment-actions > div > div > div > input`;

    await page.waitForSelector(selector);
    await page.focus(selector);
    await page.keyboard.type(mockAssignee);
    await page.keyboard.enter;

    var assign_msgId = await assignee_recommend.assign(mockNewIssue.creator, mockNewIssue.repo, mockNewIssue.issue_id, mockNewIssue.creator, mockAssignee);

    var assign_post = "postMessageText_" + assign_msgId;

    const textEle = await page.$x(`//*[contains(@id, "${assign_post}")]/p`);
    const text = await (await textEle[0].getProperty('textContent')).jsonValue();

    expect(text).to.eql(expectedMsg2);

    await browser.close();
  });

});