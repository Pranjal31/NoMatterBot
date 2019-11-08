# PROCESS

## Process

We have two sprints for developing our bot:
+ Wed Oct 23-- Fri Nov 1
+ Sat Nov 2--Fri Nov 8th

We have divied our tasks into total 9 stories. Each of us were assigned following stories with associated stoey points:
+ Pranjal Sharma:\
	Story: 1, 6\
	Story points: 8
+ Sridhar Kulkarni:\
	Story: 2, 5\
	Story points: 6
+ Vaishakh Bhadrappanavar:\
	Story: 3, 4\
	Story points: 6
+ Anjali Malunjkar:\
	Story: 7, 8, 9\
	Story points: 7

For every iteration, we assigned tasks to ourselves. The scrumban board for the beginning of each iteratoin is as follows:
+ [Iteration 1](https://github.ncsu.edu/csc510-fall2019/CSC510-12/tree/dev/scrumban/Iteration1)
+ [Iteration 2](https://github.ncsu.edu/csc510-fall2019/CSC510-12/tree/dev/scrumban/Iteration1)

When a developer starts working on a story, they move their card to "In progress" column. The scrumban board status was as follows for each iteration:
+ [Iteration 1](https://github.ncsu.edu/csc510-fall2019/CSC510-12/tree/dev/scrumban/Iteration1)
+ [Iteration 2](https://github.ncsu.edu/csc510-fall2019/CSC510-12/tree/dev/scrumban/Iteration1)

Once a developer finsihes working and testing the code on local, they create a pull request and move the card to "In review". The scrumban board status was as follows for each iteration:
+ [Iteration 1](https://github.ncsu.edu/csc510-fall2019/CSC510-12/tree/dev/scrumban/Iteration1)
+ [Iteration 2](https://github.ncsu.edu/csc510-fall2019/CSC510-12/tree/dev/scrumban/Iteration1)

When the pull request has been approved by other devlopers, the card is moved to "Done" column. The scrumban board status was as follows for each iteration:
+ [Iteration 1](https://github.ncsu.edu/csc510-fall2019/CSC510-12/tree/dev/scrumban/Iteration1)
+ [Iteration 2](https://github.ncsu.edu/csc510-fall2019/CSC510-12/tree/dev/scrumban/Iteration1)


For every iteration, we had daily standup meetings and we logged the minutes of meeting in a google doc every day. They are as follows:

+ [Iteration 1](https://github.ncsu.edu/csc510-fall2019/CSC510-12/tree/dev/scrumban/Iteration1)
+ [Iteration 2](https://github.ncsu.edu/csc510-fall2019/CSC510-12/tree/dev/scrumban/Iteration1)


### 

## Practices

### Corollary Practices

In addition to Primary pracitces of Software Design, we followed Corollary practices as well. These practices ensured that everyone in the team had a very good understanding in each others codes and there were no wasted efforts trying to reinvent the wheel. In addition, allowing multiple team members work on each other's code gave a sense of collective responsibility and a stronger commitment to maintain code standards and their successful functionality. It also helped keep our code-base streamlined and linear. Specifically, we used Shared code and Single Code Base in our Bot Software Design process.  

#### Shared Code
An overall knowledge of the whole Software system enabled us to work on and/or help with each other's code. There were many instances during the Software Development process where one of us helped another debug their code and keep the wheel spinning. However, we will mention two major instances of Shared Code practice that helped shape our software.  
For Assignee Recommendation use-case, we used the work-load assigned to every team-member to come with a list of potential assignees to an Issue and one of our developers implemented the code accordingly. However, we later decided to enhance this feature to include the team-member's skills in deciding the list of potential assignees. Another developer was assigned to do this enhancement in the already existing code. He could easily identify the code changes required and where to implement those changes without changing or affecting other codes dependent on this feature. This was only possible because of the knowledge he had about the previous code and how it interacted with the rest of the system.  
Another instance of a shared code practice in action was in Stale Issues use-case. There were many sub-modules in the code for this use-case each having to deal with different sub-flows. One of the developers worked on identifying the stale issues and posting the reminders on Mattermost, while another developer worked on code to close the stale GitHub issues. Since these sub-modules were inter-dependent with each others, knowing each other's codes and their functionality was needed.  
Both these instances of collective code ownership helped us improve our software standards and make sure they were performing their expected tasks the expected way.  

#### Single Code Base
Keeping the code-base free of redundant functionality and always moving forward is essential for a clean and well-maintained code. We used a single code-base in the form of GitHub repo to achieve this, where all our team-members pushed their part of the code. We created separate branches for each use-case (feature) so that there would not be unintentional code overwrites or conflicts. These branches were kept alive only for the duration of feature implementation, unit test and limited integration tests by the developer. After this was done, the code was reviewed and if approved by all other team-members, it was merged with the main code-base. This ensured that the main code-base always had the most recent approved changes and free of code conflicts if any. Short-lived branches helped identify multiple versions or duplicate implementations of the same code early and remove redundancies.

