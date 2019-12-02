# DEPLOY

## Deployment scripts

The bot is hosted on Google Cloud Platform. We are using two Ubuntu Virtual Machine(VM) instances for the deployment, one of which is used for Mattermost server and the other VM is being used to host NoMatterBot and the database required by the bot. The server is configured to accept all the incoming traffic from Github.

To deploy and run this bot, numerous packages need to be installed, the latest code for the bot needs to cloned from Github and some environment variables need to be set. All these tasks are automated using an ansible playbook [main.yml](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/deploy/main.yml). The inventory file for the same could be found [here](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/deploy/inventory).

When this playbook is run using `ansible-playbook main.yml -i inventory`, it prompts the user to provide the values of environment variables. The playbook ensures that the VM hosting the bot has all the necessary environment variables set and then installs all the necessary packages. It also clones the latest code from the master branch of the bot's repository and installs (if not already installed) and configures the MySQL database.

The bot is kept up and running using `forever`.

## User Acceptance testing

For acceptance testing, TA user accounts have been created on Mattermost. The login details are as given below:\
Login can be done [here](http://35.231.138.79:8065/login)
username: yshi26@ncsu.edu / ffahid@ncsu.edu\
Password: @Bcde12345 (For both accounts).

The following three repos must be used for testing: `psharma9/test-repo-1`, `psharma9/test-repo-2` and `psharma9/test-repo-3`. TAs have been added as collaborators in each. This should enable the TAs to perform various actions like creating an issue, updating issue labels, updating issues and closing the issues.

Note: 
+ This setup has been done on NCSU enterprise GitHub (github.ncsu.edu)
+ `psharma9` represents the bot account (bot's actions would show up as psharma9's actions)

## Acceptance tests to evaluate the Use Cases's of the Bot

### Assignee Recommendations

|1|Get top 3 assignee recommendations|
|:-----:|:---:|
|Purpose|Ensure that Computation of `top 3` assignee recommendations is working as expected|
|Pre-Conditions| None |
|Process|a) Create an issue on one of the test repos <br> b) Give comma separated skills required for the issue at the end of the issue body.<br> For e.g. `skills: <skill1>, <skill2>`. A comprehensive mapping of user and their skills is present in DESIGN.md. c) to receive recommendations, it is necessary that no assignee is selected during issue creation |
|Output| Issue creator receives a message with `top 3` recommendations in the order of their recommendation scores (for details of recommendation score computation, DESIGN.md can be referred) <br> Note: The recommendation score is not displayed. If only three or less than three collaborators are available on the repo then only those will be shown. `Show more` button will not be displayed|

|2|Show more assignee recommendations|
|:-----:|:---:|
|Purpose|More recommendations should be displayed if 'Show more' button is clicked|
|Pre-Conditions| None|
|Process| a) Create an issue on one of the test repos <br> b) Give comma separated skills required for the issue at the end of the issue body.<br> For e.g. `skills: <skill1>, <skill2>`. A comprehensive mapping of user and their skills is present in DESIGN.md. c) to receive recommendations, it is necessary that no assignee is selected during issue creation <br> d) Issue creator clicks on the `Show more` button |
|Output| Issue creator receives a message with all collaborators in the test repo as recommendations |

|3|Assign an issue|
|:-----:|:---:|
|Purpose|The issue should be assigned to the collaborator selected from the recommendations|
|Pre-Conditions| None |
|Process| a) Create an issue on one of the test repos <br> b) Give comma separated skills required for the issue at the end of the issue body.<br> For e.g. `skills: <skill1>, <skill2>`. A comprehensive mapping of user and their skills is present in DESIGN.md. c) to receive recommendations, it is necessary that no assignee is selected during issue creation <br> d) Issue creator selects an assignee from the recommendation drop-down |
|Output|The issue is assigned to the selected collaborator, issue creator receives the message `Done and dusted!`|

|4|Ignore the recommendations|
|:-----:|:---:|
|Purpose|If the user clicks ignore, the issue is not assigned to anyone|
|Pre-Conditions| None |
|Process| a) Create an issue on one of the test repos <br> b) Give comma separated skills required for the issue at the end of the issue body.<br> For e.g. `skills: <skill1>, <skill2>`. A comprehensive mapping of user and their skills is present in DESIGN.md. c) to receive recommendations, it is necessary that no assignee is selected during issue creation <br> d) Issue creator clicks on the `Ignore` button|
|Output| Issue Creator receives the message `All those CPU cycles wasted for nothing? Okay :(`|

### Stale Issues

|1|Identify stale issues|
|:-----:|:---:|
 |Purpose|Ensuring stale Issues(for the demo purpose, these represent the issues which have had no activity on them in past 2 mins) are getting recognized and being posted on Mattermost|
|Pre-Conditions| For the tester who expects to see stale issues, there must be some Issues assigned to them on the mentioned test repos. (one can create Issues and assign to one of the testers)|
|Process|Tester need not take any action. This activity is triggered from cron job every minute. As per the design, the cron job is supposed to run every 24hours. However, this time has been reduced to 1 minute for ease of demonstration.|
|Output|It takes 2 minutes for the issue(s) to get flagged as stale. Cron Job runs every Minute. So after a max period of 3 minutes, the assignee of issue(s) should get a message on Mattermost with stale issue details with an option to close issue (options to `Ignore all` and `Close all` issues will also be provided if there is more than one stale issue)|

|2|Close a stale issue|
|:-----:|:---:|
|Purpose|Ensuring close Stale Issue button on mattermost closes the stale Issue.|
|Pre-Conditions| a) Ensure tester has at least one stale Issue. <br> b) tester has received a stale issue message on mattermost, with option to `Close` (and possibly `Close All` and `Ignore All`, if there are multiple stale issues)|
|Process|Tester clicks on button `Close`|
|Output|The issue is closed on GitHub|

|3|Close all stale issues|
|:-----:|:---:|
|Purpose|Ensuring `Close All` button on mattermost closes all the stale Issue.|
|Pre-Conditions| a) Tester must have more than one issue which are stale b)Tester has received a stale issue message on mattermost, with the options to `Close`, `Close All`, `Ignore All`. Tester must wait for at least two issues to go stale before proceeding |
|Process|Tester clicks on `Close All`|
|Output|All the issues listed on the message are closed on Github |

|4|Ignore all stale issues|
|:-----:|:---:|
|Purpose|Ensuring Ignore All button on mattermost does not close any stale issues|
|Pre-Conditions|a) Tester must have more than one issue which are stale b) Tester has received a stale issue message on mattermost, with the options to `Close`, `Close All`, `Ignore All`. Tester must wait for at least two issues to go stale before proceeding |
|Process| Tester clicks on `Ignore All`|
|Output| None of the issues listed in the message are closed|

### Issue Status Change

|1|Change issue status to `in review`|
|:-----:|:---:|
|Purpose| Ensuring that PR (Pull Request) creation changes the issue status to `in review` (label addition/update)|
|Pre-Conditions| a) Ensure that there is an open issue in the repo |
|Process| Create a Pull request and reference the open Issue number in its title.  <br> For e.g. `<Issue Number> - <PR Title> `|
|Output| The only status label on the referenced issue should be `in review`|
	

|2|Change issue status to `in test`|
|:-----:|:---:|
|Purpose| Ensuring that PR approval changes the issue status to `in test` (label addition/update)|
|Pre-Conditions|a) Ensure that there is a Pull Request referencing an open issue in the Repo <br>|
|Process|Close Pull request by merging it|
|Output|The only status label on the referenced issue should be `in test`|

### Issue Status Change Notification:

|1|Notify Change in Issue Status|
|:-----:|:---:|
|Purpose|Ensure that the changes in an Issue status (including status label changes) are getting posted to the issue assignee (or owner, if no assignee) on mattermost|
|Pre-Conditions|a) Ensure that there is an open Issue in one of the test repos with the tester as Issue creator or Issue assignee|
|Process|The tester should receive a message on Mattermost specifying the Issue number, title, the repo in which Issue was created and its new status. The new status will be based on added/updated label if tester has manually added the label (or it will be closed if the Issue is closed)|	

### Exploratory testing and final code

+ Github webhooks are configured to receive any real time event data about issues from Github. All the mockups have been removed.
+ The messages that are being displayed to the users on Mattermost are kept separate in a file. 
+ Access token for the bot, github user name and password, database username and password are entered via command line when the app is deployed.
+ Github username to mattermost user mapping is saved in the database and fetched in real time. Simillaryly user skills for assignee recommendations are also saved in database and fetched in real time whenever needed.

The architecture of this project is entirely event-based. NoMatterBot does not accept any textual input from the user and the conversation is always initiated by the bot based on the events. 

NoMatterBot follows 'call and return' model. When an event occurs(issue is created on github or time to show stale issue has occured), the server of the NoMatterBot is notified [Layer 1]. This component then invokes a function specific to the event that has occured[Layer 2]. To complete the processing some general-purpose methods defined in `lib.js` may be called by the use-case function [Layer 3]. 

By using the mixture of the two above-mentioned patterns, we could process real-time event based data and make our software resusable and scalable.


### Continuous Integration (CI) Server
