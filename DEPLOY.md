# DEPLOY

## Deployment scripts

The bot is hosted on Google Cloud Platform (GCP). We are using two Ubuntu Virtual Machines (VM), one hosts the Mattermost server and the other machine hosts NoMatterBot and database that the bot needs. The server is configured to accept all the traffic of interest from Github.

To deploy and run this bot, numerous tasks are needed which are automated using ansible. The ansible playbook can be found [here](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/deploy/main.yml). The inventory file for the same can be found [here](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/deploy/inventory).

The playbook can be run from any machine which can connect to GCP instance using ssh. When the playbook is run using `ansible-playbook -i inventory main.yml`, it prompts the user to provide values for certain variables needed for deployment and setup. The playbook ensures that the VM hosting the bot has all the necessary environment variables set. It also clones the latest code from the the bot's repository, installs all the necessary packages, installs (if not already installed) and configures the MySQL server and runs the bot app. 

The bot is kept up and running using `forever`.

The screencast demonstrating deployment can be found [here](https://drive.google.com/file/d/1WfuhSx52t4QCqpAmt5ifNq3G0N1tgrXW/view).

## User Acceptance testing

For acceptance testing, TA user accounts have been created on Mattermost. The login details are as given below:\

Login can be done [here](http://35.231.138.79:8065/login)\
Username: yshi26@ncsu.edu / ffahid@ncsu.edu\
Password for TA accounts have been shared over email.

The following three repos must be used for testing: `psharma9/test-repo-1`, `psharma9/test-repo-2` and `psharma9/test-repo-3`. TAs have been added as collaborators in each.  
These three test repos have been configured to allow the TAs to run Acceptance and Exploratory tests without worrying about repo-specific settings. GitHub hooks on these repos have been set up and the repos have been configured to send Issue related events to the bot server hosted on GCP. All the team members and TAs have been added as collaborators to these repos. `psharma9/test-repo-3` is a private repo while the other two are public, therefore, allowing test cases that can cover both repository types offered by GitHub. For all these reasons, we recommend using the above mentioned repos for testing.

Note: 
+ This setup has been done on NCSU enterprise GitHub (github.ncsu.edu)
+ `psharma9` represents the bot account (bot's actions would show up as psharma9's actions)

## Acceptance tests to evaluate the Use Cases of the Bot

### Assignee Recommendations

|1|Get top 3 assignee recommendations|
|:-----:|:---:|
|Purpose|Ensure that Computation of `top 3` assignee recommendations is working as expected|
|Pre-Conditions| None |
|Process|a) Create an issue on one of the test repos <br> b) Give comma separated skills required for the issue at the end of the issue body.<br> For e.g. `skills: <skill1>, <skill2>`. A comprehensive mapping of user and their skills is present in DESIGN.md. <br> c) to receive recommendations, it is necessary that no assignee is selected during issue creation |
|Output| Issue creator receives a message with `top 3` recommendations in the order of their recommendation scores (for details of recommendation score computation, DESIGN.md can be referred) <br> Note: The recommendation score is not displayed. If only three or less than three collaborators are available on the repo then only those will be shown. `Show more` button will not be displayed|

|2|Show more assignee recommendations|
|:-----:|:---:|
|Purpose|More recommendations should be displayed if 'Show more' button is clicked|
|Pre-Conditions| None|
|Process| a) Create an issue on one of the test repos <br> b) Give comma separated skills required for the issue at the end of the issue body.<br> For e.g. `skills: <skill1>, <skill2>`. A comprehensive mapping of user and their skills is present in DESIGN.md.<br> c) to receive recommendations, it is necessary that no assignee is selected during issue creation <br> d) Issue creator clicks on the `Show more` button |
|Output| Issue creator receives a message with all collaborators in the test repo as recommendations |

|3|Assign an issue|
|:-----:|:---:|
|Purpose|The issue should be assigned to the collaborator selected from the recommendations|
|Pre-Conditions| None |
|Process| a) Create an issue on one of the test repos <br> b) Give comma separated skills required for the issue at the end of the issue body.<br> For e.g. `skills: <skill1>, <skill2>`. A comprehensive mapping of user and their skills is present in DESIGN.md. <br> c) to receive recommendations, it is necessary that no assignee is selected during issue creation <br> d) Issue creator selects an assignee from the recommendation drop-down |
|Output|The issue is assigned to the selected collaborator, issue creator receives the message `Done and dusted!`|

|4|Ignore the recommendations|
|:-----:|:---:|
|Purpose|If the user clicks ignore, the issue is not assigned to anyone|
|Pre-Conditions| None |
|Process| a) Create an issue on one of the test repos <br> b) Give comma separated skills required for the issue at the end of the issue body.<br> For e.g. `skills: <skill1>, <skill2>`. A comprehensive mapping of user and their skills is present in DESIGN.md. <br> c) to receive recommendations, it is necessary that no assignee is selected during issue creation <br> d) Issue creator clicks on the `Ignore` button|
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

### Final code

The architecture of the bot is entirely event-based. For all use cases, NoMatterBot is the one who initiates conversations. Furthermore, users can provide input to NoMatterBot only through interactive messages (like buttons, dropdown). 

The bot follows a layered software architecture. The layers are described below:
+ Layer 1: When an event occurs (e.g. an issue is created on github), NoMatterBot server captures the event. 
+ layer 2: Server component then invokes a function specific to the use case to handle the event. 
+ Layer 3: The use-case specific methods might rely on helper methods defined in `lib.js` to perform the required task

There's another layer of database functionality that could be invoked by Layer 3 methods to handle DB queries. The DB holds the following data mapping:
    + GitHub username to Mattermost user id  -  Helps identify correct message recipients
    + Github username to user's skills  -  Helps compute recommendation score for potential assignees
    
Although we are using forever to ensure bot is up and running all the time, we also take care of other system resources to ensure that the infrastructure does not go down and affect the bot's uptime. We use nodejs mysql module’s connection pools for Database connections. This provides a robust interface to make concurrent connections with the DB by leveraging reusable connection threads. We also make use of  nodejs runtime’s event loops to achieve gracious shutdowns. If the bot is killed inadvertantly, it closes all database connections before exiting, thus avoiding idle connections with the DB.  
    
Miscellaneous: 
+ Mock data is used only for Integration Testing. Github webhooks are configured to receive any real time event data about issues from Github. 
+ The interaction messages used by the bot are kept together in a single file. 
+ We rely on environment variables to store secrets.

### Continuous Integration (CI) Server

+ A jenkins server was setup on a local VM. The files necessary for VM creation (baker.yml) and Jenkins setup (roles.yml, main.yml, inventory and templates/jenkins_script.groovy) are present in `ci/` directory. 
+ The build job configuration details are present in CI.xml
    + It uses SCM polling insead of SCM-initiated triggers (because of insufficient privileges on the repo to create webhooks) and checks for commits once every minute. It starts a build job on detecting a commit.
    + A build task was added which installs all dependencies and runs the integration tests

The screencast for CI can be found [here](https://drive.google.com/file/d/1Kc6uXSV_dJ3QLiZ17DVmN0x6nZSFQGby/view)
