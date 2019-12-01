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

- Notifying and closing stale issues UAT:

	|1|Identify stale issues|
	|:-----:|:---:|
	|Purpose|Ensuring stale Issues(for the demo purpose, these represent the issues which have had no activity on them in past 2 mins) are getting recognized and being posted on Mattermost|
	|Pre-Conditions| a) For the tester who expects to see stale issues, there must be some Issues assigned to them on the mentioned test repos. (one can create Issues and assign to one of the testers) <br>|
	|Process|User need not take any action. This activity is triggered from cron job every minute. As per the design, the cron job is supposed to run every 24hours. However, this time has been reduced to 1 minute for ease of demonstration.|
	|Output|It takes 2 minutes for the issue(s) to get flagged as stale. Cron Job runs every Minute. So after a max period of 3 minutes, the assignee of issue(s) should get a message on Mattermost with issue status details with an option to close or ignore issue(s)|

	|2|Close a stale issue|
	|:-----:|:---:|
	|Purpose|Ensuring close Stale Issue button/option on mattermost closes the stale Issue.
	|Pre-Conditions| a) Bot has the BOTACCESS token to post messages on mattermost <br> b) Bot has GITHUBTOKEN to interact with the Github <br> c) Ensure user has a stale Issue. Issue which has had not activity in past 2 mins <br> d) User has received a stale issue message on mattermost, with the options to Close, Close All, Ignore All.|
	|Input|No input necessary. User chooses Close Button/option.| 
	|Process|User clicks on button Close.|
	|Output|The issue is closed on GitHub. The user gets notification on mattermost ""|

	|3|Close all stale issues|
	|:-----:|:---:|
	|Purpose|Ensuring Close All button/option on mattermost closes All the stale Issue.|
	|Pre-Conditions|a) Bot has the BOTACCESS token to post messages on mattermost.<br> b) Bot has GITHUBTOKEN to interact with the Github. <br> c) User has received a stale issue message on mattermost, with the options to Close, Close All, Ignore All.|
	|Input|No input necessary. User chooses Close All.|
	|Process|User clicks on Close All.|
	|Output|All the issues listed in the message are closed on the Github. User gets notification on Mattermost “”|

	|4|Ignore all stale issues|
	|:-----:|:---:|
	|Purpose|Ensuring Ignore All button on mattermost does not close any Issues and ignores the recognized stale issues.|
	|Pre-Conditions|a) Bot has the BOTACCESS token to post messages on mattermost.<br> b) Bot has GITHUBTOKEN to interact with the Github.<br>c) User has received a stale issue message on mattermost, with the options to Close, Close All, Ignore All. |
	|Input|No input necessary.User clicks on Ignore All.|
	|Process| a) User receives a message on Mattermost showing the list of stale Issues. Option to close Individual stale Issues, Close All, Ignore All.<br> b) User clicks on Ignore All.|
	|Output|All the issues listed in the message are ignored/not closed. User gets a message on Mattermost “ ”|

- Change Issue status UAT:


	|1|Change issue status to 'In review'|
	|:-----:|:---:|
	|Purpose|To Ensure that once a PR(Pull request) is created, the Issue status (label) changes to “in review”|
	|Pre-Conditions|a) Ensure that GitHub webhooks are configured properly<br> b) Ensure that there is an open issue in the Repo<br> c)Ensure that all required status labels are configured|
	|Input|No input|
	|Process|Create a Pull request and reference the open Issue number in its title|
	|Output|If not already present, “in review” label is added to the Issue. All other status labels will be deleted from the Issue, if there were any|
	

	|2|Change issue status to 'In test'|
	|:-----:|:---:|
	|Purpose|To ensure that once a Pull Request is approved the Issue status changes to “in test”|
	|Pre-Conditions|a) Ensure that GitHub webhooks are configured properly <br> b) Ensure that there is a Pull Request referencing an open issue in the Repo <br> c) Ensure that all required status labels are configured|
	|Input|No input|
	|Process|Close Pull request by merging/rebasing it|
	|Output|If not already present, “in-test” label is added to the Issue referenced in the PR. All other status labels will be deleted from the Issue, if there were any|

- Notify change in an issue status UAT:

	|1|Notify Change in Issue Status|
	|:-----:|:---:|
	|Purpose|Ensure that the changes on an Issue status are getting posted to the corresponding user on mattermost.|
	|Pre-Conditions|a) Github user has corresponding account on mattermost. b) The server has BotAccess token to post messages on mattermost. c) There is a mapping between Github User id and Mattermost user available.|
	|Input|No input|
	|Process|Close an Issue on Github.|
	|Output|User receives the Message: `Issue Number is closed`|	

- Assignee recommendations for newly created issues UAT:

	|1|Get top 3 assignee recommendations|
	|:-----:|:---:|
	|Purpose|Ensure that Computation of top 3 assigness is working as expected.|
	|Pre-Conditions|a) Github user has corresponding account on mattermost.<br> b) The server has BOTACCESSTOKEN to post messages on mattermost.<br> c) There is a mapping between Github User id and Mattermost user available.<br> d) Github webhooks are configured.|
	|Input||
	|Process|a) Create an issue on Github. <br> b) Give comma separated skills required for the issue at the end of the issue body.<br> c) Don't assign it to anyone.|
	|Output|User/ creator receives a message with top 3 recommendations orderd by recommendation score calculated by the bot. (Note: The recommendation score is not displayed. If only three or less than three collaborators are available on the repo then only those will be shown. No 'Show more' button).|

	|2|Show more assignee recommendations|
	|:-----:|:---:|
	|Purpose|More recommendations should be displayed if 'Show more' button is clicked|
	|Pre-Conditions|a) Github user has corresponding account on mattermost.<br> b) The server has BotAccess token to post messages on mattermost.<br> c) There is a mapping between Github User id and Mattermost user available. <br> d) There are more than three collaborators available on the repository. <br> e) The newly created issue is not assigned to anybody.|
	|Input|Click on `Show more` button|
	|Process|User clicks on the `Show more` button|
	|Output|User receives a message with all the possible assignee recommendations for that issue.|

	|3|Assign an issue|
	|:-----:|:---:|
	|Purpose|The issue should be assigned to the assignee user selects from the recommendations made by the bot|
	|Pre-Conditions|a) Github user has corresponding account on mattermost. b) The server has BotAccess token to post messages on mattermost. c) There is a mapping between Github User id and Mattermost user available. d) Bot has github access to assign an issue to a collaborator|
	|Input|Select an assignee from the recommendations.|
	|Process|User selects an assignee from the recommendation drop-down box (Note: There is no `Assign` button. Just select one assignee)|
	|Output|The issue is assigned to the selected assignee, user receives a message `Done and dusted!`.|

	|4|Ignore the recommendations|
	|:-----:|:---:|
	|Purpose|If the user clicks ignore, the assignee recommendations are ignored. The issue is not assigned to anybody and all the buttons are disabled.|
	|Pre-Conditions|The server has BotAccess token to post messages on mattermost.|
	|Input|Click on `Ignore` button|
	|Process|User clicks on the `Ignore` button|
	|Output|User receives the message `All those CPU cycles wasted for nothing? Okay :(`|

### Exploratory testing and final code

+ Github webhooks are configured to receive any real time event data about issues from Github. All the mockups have been removed.
+ The messages that are being displayed to the users on Mattermost are kept separate in a file. 
+ Access token for the bot, github user name and password, database username and password are entered via command line when the app is deployed.
+ Github username to mattermost user mapping is saved in the database and fetched in real time. Simillaryly user skills for assignee recommendations are also saved in database and fetched in real time whenever needed.

The architecture of this project is entirely event-based. NoMatterBot does not accept any textual input from the user and the conversation is always initiated by the bot based on the events. 

NoMatterBot follows 'call and return' model. When an event occurs(issue is created on github or time to show stale issue has occured), the server of the NoMatterBot is notified [Layer 1]. This component then invokes a function specific to the event that has occured[Layer 2]. To complete the processing some general-purpose methods defined in `lib.js` may be called by the use-case function [Layer 3]. 

By using the mixture of the two above-mentioned patterns, we could process real-time event based data and make our software resusable and scalable.


### Continuous Integration (CI) Server