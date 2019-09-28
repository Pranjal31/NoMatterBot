# Design

# Problem Statement

Issue Tracking Software like JIRA and Github Issues allow users to create issues for managing tasks and bugs in software engineering projects. However, most of the time managing issues itself becomes a taxing task. Managers spend a lot of time creating, assigning, maintaining and closing these issues. Even if a part of this process can be automated, it could lead to significant time savings. 

Some of the problems that are prevalent with issue management are:

+ **Closing stale issues:**
Some issues are created and kept on hold because of lack of resources among other things. Over time, these issues become stale and continue to remain in the open issues list. Manually closing the issues can prove to be burdensome. 

+ **Changing issue status:**
An assignee / manager / scrum master has to manually change an issue’s status from one state to another. For example, if a the merge request related to an issue has been approved and merged, the status must be changed from "In Development" to "Test". 

+ **Status change notifications:**
Most of the issue tracking systems either do not notify watchers about changes in issue status or send it over email which is not always convenient
 
+ **Issue Assignment:**
 For assigning a new issue to someone, one has to manually go through potential assignees' current load (e.g. number of issues currently being worked upon) or talk to them directly to get some idea about their current workload. It tends to takes up a lot of time to figure out who could be the best fit for the new issue. 

 # Bot Description

A bot is an ideal solution to the above described problem because the tasks listed in the problem statement are mundane and repetitive, and hence could easily be offloaded to a bot. This would allow Manager/Scrum master to spend their time on more important things. Furthermore, the bot can be easily integrated with collaboration tools like Mattermost and Slack, which makes it a lot more convenient to use, as the these tools are already being used for chats, file transfers etc.

The "NoMatterBot" performs the following tasks:

+ It cleans up the stale issues (issues which have had no activity on them for a long time). The bot asks the assignee if the stale issue can be closed. After getting confirmation from assignee, it deletes the stale issue. 

+ It changes the status of an issue based on triggers (For example, as soon as a Pull Request(PR) is approved and merged, the bot automatically changes the status of the issue to "Test". If the PR is rejected then the bot does not change the status).

+ It notifies the assignee about the status change of an Issue.
NoMatterBot can respond to occurence of events like creation of an issue, merge of a pull request for the issue etc by messaging the watchers on Mattermost/Slack

+ It provides possible suggestions regarding whom to assign the issue based on bandwidth/load for each team member. To make a good call, the bot looks at open issue count for each team member. On receiving a response with an assignee's name, it will assign the issue to the requested assignee.

"NoMatterBot" can respond to events and can have limited conversations with user (conversations can only be started by "NoMatterBot"). It is a Chat-Dev Bot because it mediates as well as performs software engineering tasks.

# Use Cases

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

![welcome](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/mattermost_welcome.png =100x20)

# Architecture Design
NoMatterBot uses both GitHub Events and User Input on Mattermost as triggers to spring into action and do its thing. To this end, it uses Mattermost websocket and GitHub webhook + REST APIs. We have designed the architecture and Component Interaction keeping this in mind and it goes as follows.\
\
Two of the use cases (Assignee recommendation and Change in Issue Status) discussed above start with an Event in GitHub which it posts to the server running in Bot software as an HTTP POST message. The server parses this raw message data and passes it onto the Event Handler, which is the heart of our Bot. The third use case (deleting stale Issues) involves directly invoking Event Handler once every day via system timers. Event Handler is responsible to identify the trigger and call appropriate modules to respond to it.\
\
Assignee recommender implements logic needed to come up with a list of potential assignees to a newly created Issue based on their current work-load and return it to the Event handler. REST client is used to get details related to GitHub issues and Pull Requests which is used by the handler to update Issue status and also to update the local database containing Issue data.\
\
One other major component relates to handling Mattermost Events. Mattermost provides websockets to send and receive real-time data using HTTP GET and POST. So, when the Event Handler receives the list of potential assignees from Assignee Recommender, it uses HTTP message composer and Mattermost client to send the list as a private message to Issue creator.  When the user responds to this message, the handler uses parsed data from message parser and forwards it to the REST client which then updates the Assignee field on GitHub using a REST call. After this, the Bot notifies the Issue creator about successful status change.\
\
For clarity, we show the work-flow of our design for all three test cases below. We have numbered the interactions so that if you follow the arrows in numerical order you can see the pieces of the puzzle coming together!

**************************Use-case pictures go here*************************************

There are several constraints and feature dependencies that we stick to, to be in-line with the working of our design. We assume that there can be a single assignee per Issue to simplify Mattermost message interaction. We also create several custom status labels that our Bot uses to track Issue progress. NoMatterBot cannot open or close an Issue. They are done by a team member and a tester respectively.


**Tagline:**
I will manage your issues no matter what!
