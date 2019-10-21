const chai = require("chai");
const expect = chai.expect;
const nock = require("nock");

const assignee_recommend = require("../assignee_recommend.js");

// Load mock data
const issueList = require("../mockIssues.json");
const userList = require("../mockUsers.json");

///////////////////////////
// TEST SUITE FOR MOCHA
///////////////////////////

describe('test_assignee_recommender_getWorkLoad', function () {

    // MOCK SERVICE
  var mockService = nock("https://api.github.ncsu.edu")
    .persist() // This will persist mock interception for lifetime of program.
    .get("/repos/asmalunj/test_repo/issues")
    .reply(200, JSON.stringify(issueList) );

  var mockService = nock("https://api.github.ncsu.edu")
    .persist() // This will persist mock interception for lifetime of program.
    .get("/repos/asmalunj/test_repo/collaborators")
    .reply(200, JSON.stringify(userList) );

    describe('#getWorkLoad()', function () {
    // TEST CASE
    it('should return workload of assignees to recommend', async function() {

      let workLoad = await assignee_recommend.getWorkLoad("asmalunj", "test_repo");
      expect(workLoad.length).to.equal(4);

    });

  });

});