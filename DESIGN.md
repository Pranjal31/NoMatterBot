# Design

# Problem Statement

Issue Tracking Software like JIRA and Github Issues allow users to create issues for managing tasks and bugs in software engineering projects. However, most of the time managing issues itself becomes a taxing task. Managers spend a lot of time creating, assigning, maintaining and closing these issues. Even if a part of this process can be automated, it could lead to significant time savings. 

Some of the problems that are prevalent with issue management are:

+ **Closing Stale Issues:**
Some issues are created and kept on hold because of lack of resources among other things. Over time, these issues become stale and continue to remain in the open issues list. Manually closing the issues can prove to be burdensome. 

+ **Changing Issue Status:**
An assignee / manager / scrum master has to manually change an issue’s status from one state to another. For example, if a the pull request related to an issue has been approved, merged, and closed, the status must be changed from "In Review" to "In Test". 

+ **Status Change Notifications:**
Most of the issue tracking systems either do not notify watchers about changes in issue status or send it over email which is not always convenient
 
+ **Assignee Recommendation:**
 For assigning a new issue to someone, one has to manually go through potential assignees' current load (e.g. number of issues currently being worked upon) or talk to them directly to get some idea about their current workload. It tends to takes up a lot of time to figure out who could be the best fit for the new issue. 

 # Bot Description

A bot is an ideal solution to the above described problem because the tasks listed in the problem statement are mundane and repetitive, and hence could easily be offloaded to a bot. This would allow Manager/Scrum master to spend their time on more important things. Furthermore, the bot can be easily integrated with collaboration tools like Mattermost and Slack, which makes it a lot more convenient to use, as these tools are already being used for chats, file transfers etc.

The "NoMatterBot" performs the following tasks:

+ It cleans up the stale issues (issues which have had no activity on them for a long time). The bot asks the assignee if the stale issue can be closed. After getting confirmation from assignee, it closes the stale issue. 

+ It changes the status of an issue based on triggers (For example, as soon as a Pull Request (PR) is approved, merged, and closed the bot automatically changes the status of the issue to "In Test". If the PR is rejected then the bot does not change the status).

+ It notifies the assignee about the status change of an Issue.
NoMatterBot can respond to occurence of events like creation of PR, merge of PR for the issue etc by messaging the assignee on Mattermost/Slack

+ It provides possible suggestions regarding whom to assign the issue based on bandwidth/load for each team member. To make a good call, the bot looks at open issue count for each team member. On receiving a response with an assignee's name, it will assign the issue to the requested assignee.

"NoMatterBot" can respond to events and can have limited conversations with user (conversations can only be started by "NoMatterBot"). It is a Chat-Dev Bot because it mediates as well as performs software engineering tasks.

# Use Cases

## Use case: Closing Stale Issues
Preconditions: \
Bot must have GitHub API token and a Mattermost access token. GithHub users must also have an account on Mattermost

Main flow: \
Once every day, the bot will scan through all the open issues and ping assignees if they have any stale issues (issues which have had no activity in six months). The bot asks if assignee wants to close the stale issues. Assignee can select the issues to be closed or choose to ignore the request.

Sub-flows:\
[S1] Bot scans through all the open issues \
[S2] Bot filters out stale issues and simultaneously groups them by assignee\
[S3] Bot pings the assignees to ask if their stale issues can be closed\
[S4] Assignees can select the issues they want to close and hit 'Close Issue(s)' button. Bot closes the issues and acknowledges\
[S5] Otherwise assignees can hit 'Ignore' button to ignore the issues for a day. Bot acknowledges it

## Use Case: Change Issue Status

Preconditions: \
Bot must have GitHub API token. Pull Requests (PR) must include GitHub Issue number at the start of PR title Issue (Example PR title: "132 - Concurrency Bug". This way the new PR will be linked with issue# 132). 

Main Flow: \
User will create a PR (or close an approved PR). It would change the issue’s status label to "in review" (if closing PR, to "in test").

Sub-flows: \
[S1] Bot identifies the triggered event (PR creation / PR closure)\
[S2] Bot identifies the corresponding issue from the issue ID embedded in PR title\
[S3] If the identified event is PR creation, Bot changes the issue status to "in review"\
[S4] If the identified event is PR closure, Bot changes the issue status to "in test"

Alternative Flows: \
PR is not approved. Bot doesn't take any action.

Note: By default, GitHub Issues supports only "open" and "closed" issue status. We introduce three new statuses "in progress", "in review" and "in test". The new statuses are represented using issue labels. While events PR creation/closure lead to issues being labelled "in review"/"in test", "in progress" has to be manually configured by the developer once they start the assigned task.

The following table summarizes the effective status of the issue based on original status and label status:

|Original Status| Status Label|Effective Status|
|---|---|---|
| open | N/A | open |
| open | in progress | in progress |
| open | in review | in review |
| open | in test | in test |
| closed | * | closed |
			
## Use Case: Notify Change in Issue Status

Preconditions: \
Bot must have a Mattermost access token. GithHub users must also have an account on Mattermost

Main Flow: \
Any change in GitHub issue status would create an event. The Bot captures the event and notifies the assignee about the change on Mattermost 

Sub-flows: \
[S1] Bot identifies the issue status change event\
[S2] Bot identifies the assignee of the issue\
[S3] Bot notifies the assignee of the status change on Mattermost

## Use Case: Assignee Recommendation

Preconditions: \
Bot must have GitHub API token, Mattermost access token and the permissions to set assignees for GitHub Issues. **The skills required by an issue (if any), must be provided in the format: "skills: skill1, skill2, .... skilln" at the end of the issue body.**

Main flow:\
A user creates an issue. Bot analyses developer workloads and skillset and recommends top three potential assignees to the issue creator on Mattermost. The user can select an assignee or ask for more recommendations or ignore the message altogether. The bot sets an assignee, if one is chosen.

Sub-flows:\
[S1] User creates an issue with no assignee set\
[S2] The bot compares the workload of different developers based on their number of open issues\
[S3] The bot matches the skillset of different developers with the skills required by the issue\
[S4] Based on previous analysis, the bot suggests top three potential assignees to issue creator on Mattermost\
[S5] Issue creator selects an assignee. The bot sets the chosen assignee for the issue and confirms it to issue creator\
[S6] If the issue creator is not satisfied with the suggestion, they can ask for more suggestions by clicking "Show more".\
[S7] The bot comes up with more suggestions, Issue creator selects an assignee and the bot will assign the issue to the chosen assignee.\
[S8] Otherwise, issue creator can ignore the recommendation. The bot would acknowledge it.

Alternative flows:\
If more than three developers have the same workload, a tie-breaking mechanism would be used to decide the top three.

Note: 
+ The skillset for each team member is listed below:

|Team member| Skills|
|---|---|
| Pranjal | java, networking, python , js | 
| Sridhar | sql, js, python, java | 
| Vaishakh | js, c, python , networking | 
| Anjali | ai, js, java, python | 
| Fahmid | ai, se, devops | 
| Yang | ml, js, se | 

+ Issue creators see recommendations in the descending order of recommendation scores. For a recommendation candidate, the score is computed as follows: 

```RecommendationScore = SkillScore + WorkloadScore```

```RecommendationScore = (SkillWeight * NumberOfMatchedSkills) + (WorkloadWeight * 1 / Workload),``` 

```where 'NumberOfMatchedSkills' are the number of candidate's skills that match those required for the issue, 'Workload' is the number of issues already assigned to the candidate. 'SkillWeight' and WorkloadWeight' are the weights for skills and workload respectively. If a candidate has zero workload, their workload score is two times the 'WorkloadWeight'```

# Design Sketches

## Wireframe Mockups
### Welcome
![welcome](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/Welcome.png)

### Stale Issues
![stale issues closed](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/Stale%20Issues%20-%20Close.png) 

![stale issues ignored](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/Stale%20Issues%20-%20Ignore.png)

### Status Change Notifications
![status change notification](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/Status%20Change%20Notifications.png)

### Assignee Recommendations
![assignee recommendation accepted](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/Assignee%20Recommendations%20-%20Assigned.png) 

![assignee recommendation ignored](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/Assignee%20Recommendations%20-%20Ignored.png)

## Storyboard
Storyboard represents a flow in the different sections of a software. Here are the different primary tasks user undergoes with NoMatterBot:


<div style = "float: left, width: 300"> 
	<img src="https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/mattermost_welcome.png" width="300">
	<br>Note: Welcome message sent to the user when added to a repository
</div>

\
Use case to close stale issues:

| Scene-Stale Issues | Scene-Close Issues | Scene-Ignore |
| --- | --- | -- |
| ![ ](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/Close_stale_issue.png) | ![ ](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/Close_stale_issue_done.png) | ![ ](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/Ignore_stale_issues.png)|
| Note: Everyday NoMatterBot will send a list of stale issue with options to close or ignore | Note: Note: If the user selects some issues and clicks on "close issues", an acknowledgement will be send to the user | Note: If the user selects ignore, an acknowledgement will be sent.|

\
Use case to recommend assignees for newly created issue:


| Scene-Assignee Recommendation| Scene-Select and Assign | Scene-Ignore |
| --- | --- | -- |
| ![ ](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/Suggest_assignee.png) | ![ ](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/assigned.png) | ![ ](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/assignee_ignored.png)|
| Note: Every time a new issue is created, NoMatterBot will recommend a list of assignees with options to assign or ignore | Note:If the user selects some assignee and clicks on "assign", an acknowledgement will be send to the user| Note: If the user selects ignore, an acknowledgement will be sent.|

\
Use case to get notifications based on event on issues:


| Scene-Status change on github| Scene-Getting notification | 
| --- | --- | 
| ![ ](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/status_change_github.png) | ![ ](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/review_update.png) | 
| Note: When the status or label of the issue is changed, a notification will be sent to the user | Note: A notification should contain the status details| 
| ![ ](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/github_closed.png) | ![ ](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/closed_update.png) | 
| Note: When an issue is closed a notification will be sent to the assignee| Note: A notification should contain the status details| 



# Architecture Design
NoMatterBot uses both GitHub Events and User Input on Mattermost as triggers to spring into action and do its thing. To this end, it uses Mattermost websocket and GitHub webhook + REST APIs. We have designed the architecture and Component Interaction keeping this in mind and it goes as follows.\
\
Two of the use cases (Assignee recommendation and Change in Issue Status) discussed above start with an Event in GitHub which it posts to the server running in Bot software as an HTTP POST message. The server parses this raw message data and passes it onto the Event Handler, which is the heart of our Bot. The third use case (deleting stale Issues) involves directly invoking Event Handler once every day via system timers. Event Handler is responsible to identify the trigger and call appropriate modules to respond to it.\
\
Assignee recommender implements logic needed to come up with a list of potential assignees to a newly created Issue based on their current work-load and return it to the Event handler.\
\
One other major component relates to handling Mattermost Events. Mattermost provides websockets to send and receive real-time data using HTTP GET and POST. So, when the Event Handler receives the list of potential assignees from Assignee Recommender, it uses HTTP message composer and Mattermost client to send the list as a private message to Issue creator.  When the user responds to this message, the handler uses parsed data from message parser and forwards it to the REST client which then updates the Assignee field on GitHub using a REST call. After this, the Bot notifies the Issue creator about successful status change.\
\
For clarity, we show the work-flow of our design for all three test cases below. We have numbered the interactions so that if you follow the arrows in numerical order you can see the pieces of the puzzle coming together!

![Arch1](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/Architecture.png)
![Arch1](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/Basic.png)

![UC1](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/Use%20case%201.png)
![UC1](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/Use%20case%202.png)
![UC1](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/Use%20case%203.png)
![UC1](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/Use%20case%204.png)

There are several constraints and feature dependencies that we stick to, to be in-line with the working of our design. We assume that there can be a single assignee per Issue to simplify Mattermost message interaction. We also create several custom status labels that our Bot uses to track Issue progress. NoMatterBot cannot open or close an Issue. They are done by a team member and a tester respectively.


**Tagline:**
I will manage your issues no matter what!
