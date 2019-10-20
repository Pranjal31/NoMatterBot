const chai = require("chai");
const expect = chai.expect;
const nock = require("nock");

const assignee_recommend = require("../assignee_recommend.js");

// Load mock data
const issueList = require("../mockIssues.json")

///////////////////////////
// TEST SUITE FOR MOCHA
///////////////////////////

describe('test_assignee_recommender', function () {

    // MOCK SERVICE
  var mockService = nock("https://api.github.ncsu.edu")
    .persist() // This will persist mock interception for lifetime of program.
    .get("/repos/asmalunj/test_repo/issues")
    .reply(200, JSON.stringify(issueList) );

    describe('#recommendAssignee()', function () {
    // TEST CASE
    it('should return top three assignees to recommend', function(done) {

      main.recommendAssignee("asmalunj", "test_repo", "asmalunj").then(function (results) 
      {
        expect(results).to.have.property("userName");
        expect(results).to.have.property("count");

        let userName = results.userName;
        let count    = results.count;

        // Call back to let mocha know that test case is done. Need this for asychronous operations.
        done();
      });

    });

});