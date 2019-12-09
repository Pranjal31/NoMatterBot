This document provides the report of our project.

## The Problem solved by the Bot
Considerable amount of Managers time is spent in issue management activities like: follow up on issues, finding the developer with right skillset and bandwidth to takeup issues, tracking of issue. 

Clearly the above tasks are repeatative and mundane. The managers valuable time can be freed up if the above tasks could be offloaded. In our Project NoMatter Bot performs all the above tasks so that the manager can focus on other tasks.

## Primary features and screenshots

 Following are the features of the bot. The detailed explaination, artchitecture, Main and Subflows of the bot can be found in our design [document](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/DESIGN.md).
 
 For in detail steps to test each Use case and the acceptance criteria for the same, please refer the deploy [document](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/DEPLOY.md).
 
 The final project presentation video demonstrates all the below Primary features, the video can be found [here].
 ### Stale Issue Management
  The bot is configured with a cron job which runs every day and finds the Stale Issues (Issues which have had no activity on them in the last 6 months) and presents it to the assignees/creator on mattermost with the option to Close the individual Issues, Close All Issues and Ignore All issues.
  
  Note: To simplify the testing process, the cron job is scheduled to run every minute and if there is no activity on an issue for more than 2 minutes, the Issue is considered as stale issue.
  
  The following screen captures depicts the feature of Stale Issue Management
  - Stale Issue Message Posted on Mattermost, depicting all the stale Issues with Issue Name,Number and the repository with the option to close, Close All, Ignore All. 
  ![Stale Issue Message on Mattermost](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/stale-1.png)
  
  - The User may click on `close` to close Individual Issues, the screen capture below depics the response received from bot upon closing a stale Issue.
  ![Close and Individual Issue](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/stale-single-close.png)
  
  - The User may click on `Ignore All` to Ignore the stale Issue Message. The screen capture below depicts the response received from the bot on clicking `Ignore All`.
  ![Ignore All](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/stale-ignore.png)
  
  - The User may click on `Close All Issues` to close all the Issues displayed in the message. The bot closes all the Issues and displays the following message.
  ![Close All Issues](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/stale-close-all.png)
  
  
 ### Assignee Recommendation
  Upon Issue creation the bot takes in to account, the Skills mentioned in issue body if any, the workload of the users and suggests the assignees for the issue.
  
  The screen captures below depicts the assignee recommendation message received on mattermost upon issue creation
  
  - Assignee Recommendation message on mattermost, the drop down contains the list of assignees.
  ![Assignee Recommend Message](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/assignee-recom-1.png)
  
  - The dropdown showing the top 3 assignee recommendation
  ![Assignees in Assignee Recommend Message](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/assignee-recom-2.png)
  
  - The User may click on `Show More` upon which the following message is received on mattermost.
  ![Show All message](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/show-all-message.png)
  
  - The drop down lists all the assignees for the Issue.
  ![All Assignee listed](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/img/report-images/assign-all.png)
  
  - Once the user clicks on an assignee, the bot assigns the issue to assignee and the user receives the following message on masttermost.
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
