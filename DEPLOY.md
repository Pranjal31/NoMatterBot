# DEPLOY

### Deployment scripts

The bot is hosted on Google Cloud Platform. We are using two Ubuntu VM instances for the deployment one of which is used for Mattermost server and the other one is hosting NoMatterBot and the database that the bot needs. The server is configured to accepts all the incoming traffic from Github.

To deploy and run this bot, numerous packages need to be installed, the latest code for the bot needs to cloned from Github and some environment variables need to be set. All these tasks are automated using an ansible playbook [main.yml](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/deploy/main.yml). The inventory file for the same could be found [here](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/deploy/inventory).

When this playbook is run using `ansible-playbook main.yml -i inventory`, it prompts the user to set the environment variables. The playbook ensures that all the variables are set and then installs all the necessary packages. It also clones the latest code from the master branch of the bot's repository and installs (if not already installed) and configures the MySQL database.

The bot is kept up and running using `forever`.

### Acceptance testing

For acceptance testing, TA user accounts were created on Mattermost. The login credentials are:\
Login username: yshi26@ncsu.edu / ffahid@ncsu.edu\
Password: @Bcde12345 (For both accounts).

The following three repos must be used for testing: `psharma9/test-repo-1`, `psharma9/test-repo-2` and `psharma9/test-repo-3`. TAs have been added as collaborators in each. This should enable the TAs to perform various actions like creating an issue, updating issue labels, updating issues and closing the issues.

Note: 
+ This setup has been done NCSU enterprise GitHub (github.ncsu.edu)
+ `psharma9` represents the bot account (bot's actions actions would show up as psharma9's actions)

Acceptance tests for the bot:
##### Stale Issues

	|1|Identify stale issues|
	|:-----:|:---:|
	|Purpose|Ensuring stale Issues(for the demo purpose, these represent the issues which have had no activity on them in past 2 mins) are getting recognized and being posted on Mattermost|
	|Pre-Conditions| a) For the tester who expects to see stale issues, there must be some Issues assigned to them on the mentioned test repos. (one can create Issues and assign to one of the testers) <br>|
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

##### Issue Status Change

	|1|Change issue status to `in review`|
	|:-----:|:---:|
	|Purpose| Ensuring that PR (Pull Request) creation changes the issue status to `in review` (label addition/update)|
	|Pre-Conditions| a) Ensure that there is an open issue in the repo |
	|Process| Create a Pull request and reference the open Issue number in its title. For e.g. `<Issue Number> - <PR Title> `|
	|Output| The only status label on the issue should be `in review`|
	

	|2|Change issue status to `in test`|
	|:-----:|:---:|
	|Purpose| Ensuring that PR approval changes the issue status to `in test` (label addition/update)|
	|Pre-Conditions|a) Ensure that there is a Pull Request referencing an open issue in the Repo <br>|
	|Process|Close Pull request by merging it|
	|Output|The only status label on the issue should be `in test`|

##### Issue Status Change Notification:

	|1|Notify Change in Issue Status|
	|:-----:|:---:|
	|Purpose|Ensure that the changes on an Issue status are getting posted to the corresponding user on mattermost.|
	|Pre-Conditions|a) Github user has corresponding account on mattermost. b) The server has BotAccess token to post messages on mattermost. c) There is a mapping between Github User id and Mattermost user available.|
	|Input|No input|
	|Process|Close an Issue on Github.|
	|Output| Tester receives the Message: `Issue Number is closed`|	

- Assignee recommendations for newly created issues UAT:

	|1|Get top 3 assignee recommendations|
	|:-----:|:---:|
	|Purpose|Ensure that Computation of top 3 assigness is working as expected.|
	|Pre-Conditions|a) Github user has corresponding account on mattermost.<br> b) The server has BOTACCESSTOKEN to post messages on mattermost.<br> c) There is a mapping between Github User id and Mattermost user available.<br> d) Github webhooks are configured.|
	|Input||
	|Process|a) Create an issue on Github. <br> b) Give comma separated skills required for the issue at the end of the issue body.<br> c) Don't assign it to anyone.|
	|Output| Tester / creator receives a message with top 3 recommendations orderd by recommendation score calculated by the bot. (Note: The recommendation score is not displayed. If only three or less than three collaborators are available on the repo then only those will be shown. No 'Show more' button).|

	|2|Show more assignee recommendations|
	|:-----:|:---:|
	|Purpose|More recommendations should be displayed if 'Show more' button is clicked|
	|Pre-Conditions|a) Github user has corresponding account on mattermost.<br> b) The server has BotAccess token to post messages on mattermost.<br> c) There is a mapping between Github User id and Mattermost user available. <br> d) There are more than three collaborators available on the repository. <br> e) The newly created issue is not assigned to anybody.|
	|Input|Click on `Show more` button|
	|Process| Tester clicks on the `Show more` button|
	|Output|User receives a message with all the possible assignee recommendations for that issue.|

	|3|Assign an issue|
	|:-----:|:---:|
	|Purpose|The issue should be assigned to the assignee user selects from the recommendations made by the bot|
	|Pre-Conditions|a) Github user has corresponding account on mattermost. b) The server has BotAccess token to post messages on mattermost. c) There is a mapping between Github User id and Mattermost user available. d) Bot has github access to assign an issue to a collaborator|
	|Input|Select an assignee from the recommendations.|
	|Process| Tester selects an assignee from the recommendation drop-down box (Note: There is no `Assign` button. Just select one assignee)|
	|Output|The issue is assigned to the selected assignee, user receives a message `Done and dusted!`.|

	|4|Ignore the recommendations|
	|:-----:|:---:|
	|Purpose|If the user clicks ignore, the assignee recommendations are ignored. The issue is not assigned to anybody and all the buttons are disabled.|
	|Pre-Conditions|The server has BotAccess token to post messages on mattermost.|
	|Input|Click on `Ignore` button|
	|Process| Tester clicks on the `Ignore` button|
	|Output| Tester receives the message `All those CPU cycles wasted for nothing? Okay :(`|

### Exploratory testing and final code

+ Github webhooks are configured to receive any real time event data about issues from Github. All the mockups have been removed.
+ The messages that are being displayed to the users on Mattermost are kept separate in a file. 
+ Access token for the bot, github user name and password, database username and password are entered via command line when the app is deployed.
+ Github username to mattermost user mapping is saved in the database and fetched in real time. Simillaryly user skills for assignee recommendations are also saved in database and fetched in real time whenever needed.

The architecture of this project is entirely event-based. NoMatterBot does not accept any textual input from the user and the conversation is always initiated by the bot based on the events. 

NoMatterBot follows 'call and return' model. When an event occurs(issue is created on github or time to show stale issue has occured), the server of the NoMatterBot is notified [Layer 1]. This component then invokes a function specific to the event that has occured[Layer 2]. To complete the processing some general-purpose methods defined in `lib.js` may be called by the use-case function [Layer 3]. 

By using the mixture of the two above-mentioned patterns, we could process real-time event based data and make our software resusable and scalable.


### Continuous Integration (CI) Server
