# DEPLOY

### Deployment scripts

The bot is hosted on Google Cloud Platform. We are using two Ubuntu VM instances for the deployment one of which is used for Mattermost server and the other one is hosting NoMatterBot and the database that the bot needs. The server is configured to accepts all the incoming traffic from Github.

To deploy and run this bot, numerous packages need to be installed, the latest code for the bot needs to cloned from Github and some environment variables need to be set. All these tasks are automated using an ansible playbook [main.yml](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/deploy/main.yml). The inventory file for the same could be found [here](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/deploy/inventory).

When this playbook is run using `ansible-playbook main.yml -i inventory`, it prompts the user to set the environment variables. The playbook ensures that all the variables are set and then installs all the necessary packages. It also clones the latest code from the master branch of the bot's repository and installs (if not already installed) and configures the MySQL database.

The bot is kept up and running using `forever`.

### Acceptance testing

For acceptance testing, TA user accounts were created on Mattermost. The login credentials are:\
Login username: Unity ID(yshi26, ffahid)\
Password: @Bcde12345 (For both accounts).

Also the TAs were added as collaborators on the test repo: `Enter test repo name`. This would enable them to perform various actions like creating an issue, updating issue labels, updating issues and closing the issues. Login to [Github](https://github.ncsu.edu/) using NCSU's unity ID credentials.\
(Note: Do not remove `psharma9` from the collaborators' list, the bot is using that account's access token for Github. If the new repo is created for testing, add `psharma9` in the collaborators and update the webhook in settings to send all notifications to `http://34.74.118.49:3000/events/`).


Acceptance tests for the bot:

- Notifying and closing stale issues UAT:

	|1|Identify stale issues|
	|:-----:|:---:|
	|Purpose|Ensuring stale Issues( Issues which have had no activity on them in past 2 mins) are getting recognized and being Posted on Mattermost|
	|Pre-Conditions|a) Bot account is the owner of the repository, the other users have been added as collaborators on the repository. b) Ensure that the users/colloborators have some Issues assigned to them or create the Issue and assign to the collaborators (not Bot Account)|
	|Input|User need not provide any input. This activity is triggered from cron job every minute. As per the design.md, cron job is supposed to run every 24hours. This time is reduced to 1 minute for faster testing.|
	|Process|User need not do any action.|
	|Output|It takes 2 minutes for the Issue to get flagged as stale Issue. Cron Job runs every Minute. So after a max period of 3 minutes, the assignee of the Issue should get a message on Mattermost with Issue Name, Issue Number,  Repository name and Close, Close All/Ignore all options.|

	|2|Close a stale issue|
	|:-----:|:---:|
	|Purpose||
	|Pre-Conditions||
	|Input||
	|Process||
	|Output||

	|3|Close all stale issues|
	|:-----:|:---:|
	|Purpose||
	|Pre-Conditions||
	|Input||
	|Process||
	|Output||

	|4|Ignore all stale issues|
	|:-----:|:---:|
	|Purpose||
	|Pre-Conditions||
	|Input||
	|Process||
	|Output||

- Change Issue status UAT:

	|1|Label an issue as 'In progress'|
	|:-----:|:---:|
	|Purpose||
	|Pre-Conditions||
	|Input||
	|Process||
	|Output||
	
	|2|Change an issue label from 'In progress' to 'In review'|
	|:-----:|:---:|
	|Purpose|To Ensure that once a PR(Pull request) is created, the Issue status (label) is changed from in progress to in review.|
	|Pre-Conditions|a) Ensure that webhooks are configured. b) Issue Number is present at the beginning of the PR. c) The Github has the labels: in review and in test. d) There is mapping for Github user to mattermost user. e) User has manually set the label in progress on the issue|
	|Input|No-Input needed.|
	|Process|Create a Pull request. Ensure that the title of the issue contains the Issue number and is of format example - PR title: "132 - Concurrency Bug"|
	|Output|Issue Status label changes from in progress to in review once the Pull request is created. User receives a notification on mattermost: `The issue is in review`|

	|3|Change an issue label from 'In review' to 'In test'|
	|:-----:|:---:|
	|Purpose|To ensure that once the PR is approved the Issue status label changes from in review  to in-test.|
	|Pre-Conditions|a) Ensure that webhooks are configured. b) Ensure that there is an Issue in review status. c) Github has labels in review and in test. d) There is mapping for Github user to mattermost user.|
	|Input|No input|
	|Process|Close a Pull request/ Approve a pull request on the Github.|
	|Output|Issue Status label changes to in-test once the PR is closed/approved. User receives a notification on mattermost : `The issue is in test`|

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
	|Pre-Conditions|a) Github user has corresponding account on mattermost. b) The server has BotAccess token to post messages on mattermost. c) There is a mapping between Github User id and Mattermost user available. d) Github webhooks are configured.|
	|Input||
	|Process|a) Create an issue on Github. b) Give comma separated skills required for the issue at the end of the issue body.c) DOn't assign it to anyone.|
	|Output|User/ creator receives a message with top 3 recommendations orderd by recommendation score calculated by the bot. (Note: The recommendation score is not displayed. If only three or less than three collaborators are available on the repo then only those will be shown. No 'Show more' button).|

	|2|Show more assignee recommendations|
	|:-----:|:---:|
	|Purpose|More recommendations should be displayed if 'Show more' button is clicked|
	|Pre-Conditions|a) Github user has corresponding account on mattermost. b) The server has BotAccess token to post messages on mattermost. c) There is a mapping between Github User id and Mattermost user available. d) There are more than three collaborators available on the repository e) The newly created issue is not assigned to anybody|
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