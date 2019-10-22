# Bot

## Bot Implementation

### Bot Platform:
+ Set up Mattermost server on Ubuntu Server 16.04 LTS VM.
+ Created a bot account for NoMatterBot on the Mattermost server. Added it to team's default channel
+ Implemented a Bot server component that listens to events/triggers on a particular port on the localhost. Used ngrok to make the server publically accessible (over the web). 

### Bot Integration
+ For all use cases, NoMatterBot initiates conversations with users. 
+ All the conversations are event-based. Bot server catches events (e.g. issue creation on GitHub) and posts relevant messages on a direct channel on Mattermost. 
+ While some messages require user action (assignee recommendation, closing stale issues), no user action is needed for certain messages (status change notification). The user actions are triggers that need to be listened for by Bot server.

Note: 
1) Responses to NoMatterBot's messages are interactive (button click, dropdown selection). Such responses initiate triggers. In fact, the response to NoMatterBot neither needs nor processes text messages.
2) Essentially, the Bot server is a Mattermost Integration (can receive triggers)

## Use Cases Refinement

### Use case: Closing Stale Issues
Preconditions: \
Bot must have GitHub API token and a Mattermost access token. GithHub users must also have an account on Mattermost

Main flow: \
Once every day, the bot will scan through all the open issues and ping assignees if they have any stale issues (issues which have had no activity in the last six months). The bot asks if an assignee wants to close all their stale issues. The assignee can choose to close all stale issues or ignore them for a day.

Sub-flows:\
[S1] Bot scans through all the open issues \
[S2] Bot filters out stale issues and groups them by assignee\
[S3] Bot pings the assignees to ask if all of their stale issues can be closed\
[S4] Assignees can choose to close all issues by 'Close All Issues' button. Bot closes the issues and acknowledges\
[S5] Otherwise assignees can hit 'Ignore' button to ignore the issues for a day. Bot acknowledges it

Note: In the design milestone, presenting a checkbox to user was proposed so that they could choose a subset of stale issues to close. However, this could not be implemented because of an existing [issue](https://forum.mattermost.org/t/cannot-open-dialog/7842/3) with Mattermost.

### Use Case: Change Issue Status

Preconditions: \
Bot must have GitHub API token. Pull Requests (PR) must include GitHub Issue number at the start of PR title Issue (separated by '-')
Example title: '4-Bot server fails to handle triggers'

Main Flow: \
User will create a PR (or close an approved PR). It would change the issue’s status to "in review" (if closing PR, from "in review" to "test").

Sub-flows: \
[S1] Bot identifies the triggered event (PR creation / PR closure)\
[S2] Bot identifies the corresponding issue from the issue ID embedded in PR title\
[S3] If the identified event is PR creation, Bot changes the issue status to "in review"\
[S4] If the identified event is PR closure, Bot changes the issue status from "in review" to "test"

Alternative Flows: \
PR is not approved. Bot doesn't take any action.
			
### Use Case: Notify Change in Issue Status

Preconditions: \
Bot must have a Mattermost access token. GithHub users must also have an account on Mattermost

Main Flow: \
Any change in GitHub issue status would create an event. The Bot captures the event and notifies the assignee about the change on Mattermost 

Sub-flows: \
[S1] Bot identifies the issue status change event\
[S2] Bot identifies the assignee of the issue\
[S3] Bot notifies the assignee of the status change on Mattermost

### Use Case: Assignee Recommendation

Preconditions: \
Bot must have GitHub API token, Mattermost access token and the permissions to set assignees for GitHub Issues.

Main flow:\
A user creates an issue without selecting an assignee. Bot analyses developer workloads and recommends top three potential assignees to the issue creator on Mattermost. The user can select an assignee or ignore the message altogether. The bot sets an assignee, if one is chosen.

Sub-flows:\
[S1] User creates an issue with no assignee set.\
[S2] The bot compares the workload of different developers based on their number of open issues\
[S3] Based on previous analysis, the bot suggests top three potential assignees to issue creator on Mattermost\
[S3] Issue creator selects an assignee. The bot sets the chosen assignee for the issue and confirms it to issue creator\
[S4] Otherwise, issue creator can ignore the recommendation. The bot would acknowledge it.

Alternative flows:\
[A1] If the user creates an issue with an assignee, Bot won't take any action\
[A2] If more than three developers have the same workload, a lexograhic tie-breaking mechanism is used to decide the top three.

## Mocking infrastructure





## Selenium testing of each use case



## Screencast
