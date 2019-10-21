const chai = require("chai");
var assert = require('assert');

var sinon = require('sinon');
const statuschange = require("../statuschange");

///////////////////////////
// TEST SUITE FOR MOCHA
///////////////////////////

describe('statuschange', function () {
  
  // behavioral test
  describe('#updateLabelForIssue()', function () {

    // a spy for the deleteLabelsForIssue() function
    var deleteLabelSpy = sinon.spy(statuschange, 'deleteLabelsForIssue');
   
    // a spy for the addLabelToIssue() function
    var addLabelSpy = sinon.spy(statuschange, 'addLabelToIssue');  

    it('should call deleteLabelsForIssue() and addLabelToIssue()', async function () {
      // await statuschange.updateLabelForIssue("testuser", "testrepo","0","enhancement");

      statuschange.deleteLabelsForIssue("testuser", "testrepo","0");
      statuschange.addLabelToIssue("testuser", "testrepo","0","enhancement");

      assert(deleteLabelSpy.withArgs("testuser", "testrepo","0").calledOnce);
      assert(addLabelSpy.withArgs("testuser", "testrepo","0","enhancement").calledOnce);

      // remove the spies
      deleteLabelSpy.restore();
      addLabelSpy.restore();

    });

  });

});