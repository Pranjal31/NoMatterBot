This document provides final report for our project - NoMatterBot.

## The Problem solved by the Bot
Issue Tracking Software like JIRA and Github Issues allow users to create issues for managing tasks and bugs in software engineering projects. However, most of the time managing issues itself becomes a taxing task. A considerable amount of a team's time is spent on the following issue management tasks: 

**Stale Issue Management:** Some issues are created and kept on hold because of lack of resources among other things. Over time, these issues become stale and continue to remain in the open issues list. Manually following up on these issues can prove to be burdensome.

**Assignee Recommendation:** For assigning a new issue to someone, one has to manually go through potential assignees' current load (e.g. number of issues currently being worked upon) or talk to them directly to get some idea about their current workload. To make good a good assignment, skillset of potential assignees must also be considered. Figuring out the best assignee could take up a some time.

**Changing Issue Status:** An assignee / manager / scrum master has to manually change an issue’s status from one state to another. For example, if a Pull Request (PR) related to an issue has been approved, merged, and closed, the status must be changed to "in test".

**Status Change Notifications:** Most of the issue tracking systems either do not notify watchers about changes in issue status or send it over email which is not very convenient.

All the tasks mentioned above are repetitive and mundane. A team's valuable time can be freed up if the above tasks are offloaded to another entity. **Enter: NoMatterBot** - A ChatDevBot designed for efficient management of issues on GitHub by automating mundane tasks.

## Primary features and screenshots

The detailed explaination related to the design of the bot and usecases can be found [here](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/DESIGN.md).
 
Furthermore, details related to acceptance testing for each usecase can be found [here](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/DEPLOY.md).
 
The primary features of NoMatterBot are as follows:

### Stale Issue Management
 
The bot is configured with a cron job which runs every day and finds the Stale Issues (Issues which have had no activity on them in the last 6 months) and presents it to the assignees/creator on mattermost with the option to Close the individual Issues, Close All Issues and Ignore All issues.
  
Note: To simplify the testing process, the cron job is scheduled to run every minute and if there is no activity on an issue for more than 2 minutes, the Issue is considered as a stale issue.
  
The following screen captures depict Stale Issue Management
  - Stale Issue Message Posted on Mattermost, depicting all the stale Issues with Issue Name, Issue Number and the repository with the option to `Close`, `Close All`, `Ignore All`. 
  ![Stale Issue Message on Mattermost](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/stale-1.png)
  
  - The user may click on `Close` to close individual issues, the screen capture below depics the response received from bot upon closing a stale Issue.
  ![Close and Individual Issue](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/stale-single-close.png)
  
  - The User may click on `Ignore All` to ignore the stale issue Message. The screen capture below depicts the response received from the bot on clicking `Ignore All`.
  ![Ignore All](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/stale-ignore.png)
  
  - The User may click on `Close All Issues` to close all the issues displayed in the message. The bot closes all the issues and displays the following message.
  ![Close All Issues](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/stale-close-all.png)
  
  
 ### Assignee Recommendation
 
Upon Issue creation the bot takes in to account 1) skills required for the issue (mentioned in issue body) and the skillset of assignment candidates and 2) workload of candidates and provides top recommendations to the issue creator
  
The screen captures below depicts the assignee recommendation message received on Mattermost upon issue creation
  - Assignee Recommendation message on Mattermost, the dropdown contains the list of recommendations.
  ![Assignee Recommend Message](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/assignee-recom-1.png)
  
  - The dropdown showing top 3 assignee recommendations
  ![Assignees in Assignee Recommend Message](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/assignee-recom-2.png)
  
  - The issue creator may click on `Show More` upon which the following message is received on Mattermost.
  ![Show All message](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/show-all-message.png)
  
  - The dropdown lists all the assignees for the Issue.
  ![All Assignee listed](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/assign-all.png)
  
  - Once the issue creator selects a candidate, the bot assigns the issue to that candidat. The following message is then received on Mattermost.
  ![Assigned](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/assigned.png)
 
 
 ###  Automatic Issue Status change

Issue status gets updated automatically based on some Pull Request(PR) events. When a new PR is created referencing an existing issue on GitHub, the status of that issue gets changed to "in review". This is done by addition/update of status label on the issue. Similarly, if a PR referencing an issue gets merged, the status of the corresponding issue gets changed to "in test".

- A new issue is created
![New Issue](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/stat-change-new-issue.png)

- A new PR is created that references the issue
![New PR](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/stat-change-pr-create.png)

- Issue status changes to "in review"
![In review](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/stat-changed-ir.png)

- The PR is merged
![PR merged](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/stat-change-pr-merge.png)

- Issue status changes to "in test"
![In test](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/stat-changed-ir.png)


### Issue Status Change Notification

For each issue status change, a notification is sent to the assignee (or the issue creator, if there is no assignee) on Mattermost. 

- Issue status changes (status change notification messages can be triggered due to automatic status change usecase as well as due to manual change) 
    - The notifications generated due to Automatic Status Change usecase can be seen below:
        PR creation:
        ![notify-ir](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/notify-ir.png)

        PR merge:
        ![notify-it](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/notify-it.png)

    - The notifications generated due to manual Status Change usecase can be seen below:
        Issue being closed:
        ![Closed](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/notify-close.png)

        Status Change Notification is sent to assignee/issue creator
        ![Closed message](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/notify-close-msg.png)

## Our reflection on the development process and project
 - We followed many software design processes and testing methodologies during the course of the project which helped ensure efficient and stream-lined flow of our work. 
 - The Integration testing and mocking frame-work we created, helped us to visualize the overall working and flow of the Bot’s software. 
 - We utilized this as the base to fill-in the missing parts of our software and make it work in real time.
 - We followed Scrum framework and Kanban workflow practice during the development phase of the project. 
 - Breaking down the whole project into smaller chunks in the form of short user stories made our work plan oriented and manageable. It also helped us distribute work-load equally among ourselves. 
 - Since Kanban stories focus on value addition to the user, we used these stories as metrics to gauge our use cases. This helped us improve upon our use-cases and provide for better user experience with NoMatterBot. 
 - Meeting with team-mates every day, reporting our work and future plan ensure that we made steady progress developing NoMatterBot software.
 - Most of the things we learnt during the development of this project are suitable to be used in our future projects as well. This project gave us a very good exposure to many technical as well as Software development cycle practices like Agile etc.   Overall, it was an engaging project, with lots of new things to learn and many opportunities to implement and use them as we designed, built, tested and deployed NoMatterBot.

## Any limitations and future work
 The following are the limitations observed in the bot:
 - Addition of a new User to the bot's database and the Github repository. The new user cannot be added in real time.
 - Addition of new skills for a user to the database.
 - Removal of User and his skill sets once the User moves to a different project or leaves the organization.
 - We have assumed in our use cases that there is always a single assignee per issue. The cases of multiples assignees per issue in case of stale issues management and assigning a single Issue to multiple assignees havent been covered.
 
The above limiattions can be addressed in the upcoming Future work as decribed below:
- Create API to add new Users to the database. 
- Create API to update the skills of the User.
- Create API to remove the User and Skill set once the User leaves the project/ organization.
- Update the API's and implement the code to handle the cases for multiple assignees per issue.

The link for the final presentation video can be found [here]. 

[here]:https://www.youtube.com/watch?v=qvxAgteq4dg
