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

// var lib.config = {};

// // retrieve api tokens
// lib.config.mmurl = process.env.MATTERMOSTURL;
lib.config.channelName = lib.config.BOTUSERID + "_" + lib.config.CHANNELUSERID
lib.config.loginEmail = process.env.MATTERMOST_EMAIL;
lib.config.loginPassword = process.env.MATTERMOST_PWD;

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


async function login(browser, url) {
    const page = await browser.newPage();
  
    await page.goto(url, {waitUntil: 'networkidle0'});
  
    // Login
    await page.type('input[id=loginId]', lib.config.loginEmail);
    await page.type('input[id=loginPassword]', lib.config.loginPassword);
    await page.click('button[id=loginButton]');
  
    // Wait for redirect
    await page.waitForNavigation();
    return page;
  }

  async function navigateTo(page, channelName) {
    await page.waitForSelector('#sidebarItem_'+channelName)
    await page.click('#sidebarItem_'+channelName)
  }

  async function hasMsg(page, msgId, expectedMsg)
  {
    var postId = "postMessageText_" + msgId;
    try
    {
      await page.waitForSelector('#postMessageText_' + msgId);
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

      respBody = {}

      // await page.setRequestInterception(true);
      // await page.on('request', request => {
      //   if (request.url().endsWith('/triggers/'))
      //   {
      //       respBody = request.body();
      //   }
      //       request.continue();
      // });

      // console.log(JSON.stringify(respBody));
      return respBody;
    }
    catch(err)
    {
      throw err;
    }
  }

  (async () => {

    try
    {
      // var msgId = await assignee_recommend.recommendAssignee(mockNewIssue);

      // var expectedMsg1 = "Ciao! I see that you recently created an issue " + mockNewIssue.issue_id;
      // var expectedMsg2 = "Done and dusted!";
      // //var expectedMsg3 = "All those CPU cycles for nothing? Okay :(";
      
      // //console.log(msgId);

      // const browser = await puppeteer.launch({headless: false, args: ["--no-sandbox", "--disable-web-security"]});
      // let page = await login( browser, `${lib.config.mmurl}/login` );
      // await navigateTo(page, lib.config.channelName);
      // var respBody = await hasInteractiveMsg(page, msgId, expectedMsg1);

      // // var msgId = await assignee_recommend.assign(mockNewIssue.owner, mockNewIssue.repo, mockNewIssue.issue_id, mockNewIssue.creator, mockAssignee);
      // // await hasMsg(page, msgId, expectedMsg2);

      // console.log(chalk.green('Test Case Assignee Recommend Successful!'));
     }
     catch(err)
     {
        console.log(err);
        console.log(chalk.red('Test Case Assignee Recommend Failed!!!'));
     }
    
  })()