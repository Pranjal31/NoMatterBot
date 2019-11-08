# PROCESS

## Process
To develop NoMatterBot, we have divided our tasks into total 9 atomic stories based on user perspective. While assigning these stories to the team members, we took previous work done, skills of the team members and dependencies from work of the other teammates in consideration. We used a kanban board to track and manage the stories. It can be found here in its current state: [NoMatterBot-Kanban](https://github.ncsu.edu/csc510-fall2019/CSC510-12/projects/1)

We have two sprints for developing our bot:
+ Wed Oct 23 -- Fri Nov 1
+ Sat Nov 2 -- Fri Nov 8th

Before beginning of first iterations the state of the kanban board was 
![ ](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/dev/scrumban/Iteration1/start.png)

##### Iteration 1 (Wed Oct 23 -- Fri Nov 1)
The stories created and worked on during this iteration are:
+ Story 2: *"As an Issue Assignee, I want to receive notifications for issue status changes, so that I can track it conveniently".* 

   Assignee: Sridhar Kulkarni. 

   Story points: 3

+ Story 3: *"As an Issue owner, I want stale issues to be identified among all issues, so that actions can be taken on them".* 

   Assignee: Vaishakh Bhadrappanavar. 

   Story points: 3
+ Story 6: *"As an Issue Creator, I want the assignee recommendations to take into account each team member's skillset and current workload, so that better assignment decision can be taken".* 

   Assignee: Pranjal Sharma

   Story points: 5
+ Story 7: *"As an Issue Creator, I want to have an automated mechanism to prepare assignee recommendations, so that best assignment decision can be taken".*

   Assignee: Anjali Malunjkar

   Story points: 3
+ Story 8: *"As an Issue Creator, I want to be presented with top 3 assignee recommendations with an option to assign whenever I create a new issue, so that the best recommendation can be chosen".*

   Assignee: Anjali Malunjkar

   Story points: 1

When assignees start working on their stories, they move the cards to "In progress" column. The kanban board status:\
![ ](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/dev/scrumban/Iteration1/Process-26_10.png)

Once the assignees have finished developing and testing the stories on their local machines, they create a pull request to merge their respective branches in the dev branch. Other developers from the team review their code and approve the merge request or recommend changes if needed. During this phase the story cards are moved from "In progress" to "In review" column, our kanban board status was:\
![ ](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/dev/scrumban/Iteration1/Process_Sprint_1_In_Review.png)

If the changes are recommended on the pull request, the assignee keeps working on them until the pull request is approved. Once it is approved, the story cards move from "In review" to "Done" column. 

The final state of the kanban board at the end of the iteration 1:\
![ ](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/dev/scrumban/Iteration1/Process_Sprint_1_Done.png)

##### Iteration 2 (Sat Nov 2 -- Fri Nov 8th)
The stories created and worked on during this iteration are:
+ Story 1: *"As an Issue Assignee/Manager, I don't want to  change the status of the issue manually, so that my time is saved".* 

   Assignee: Pranjal Sharma

   Story points: 3

+ Story 4: *"As an Issue owner, I want issue assignees to be notified of their stale issues with an option to close them every day, so that the number of stale issues can be kept at a minimum.".*

   Assignee:  Vaishakh Bhadrappanavar

   Story points: 3

+ Story 5: *"As an Issue owner, I want issue assignees' response/action on stale issues to be reflected on GitHub automatically, so that their time is saved".*

   Assignee: Sridhar Kulkarni

   Story points: 3

+ Story 9: *"As an Issue Creator, I want my response/action to be reflected on GitHub automatically, so that my time is saved".*

   Assignee: Anjali Malunjkar

   Story points: 3

In the beginning, when all the story cards of this iteration were moved to "In progress" column, the kanban board status was:\
![ ](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/dev/scrumban/Iteration%202/Process_Sprint_2_In_Progress.png)

When the developers finished working on their stories and created a pull request, all the respective cards were moved to "In review" column on the kanban board:\
![ ](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/dev/scrumban/Iteration%202/Process_Sprint_2_In_Review.png)

Once all the pull requests were merged, the cards were moved to "Done" column of the kanban board. \
![ ](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/dev/scrumban/Iteration%202/Process_Srint_2_Done.png)

In summary, each one of us were assigned following stories with associated story points:

| Assignee | Stories | Story points |
| --- | --- | --- |
| Pranjal Sharma | 1, 6 | 8 |
| Sridhar Kulkarni | 2, 5 | 6 |
| Vaishakh Bhadrappanavar | 3, 4 | 6 |
| Anjali Malunjkar | 7, 8, 9 | 7 |


## Practices
### Primary Practices

We have followed a combination of Scrum and Kanban practices. Some of the primary practices that we have introduced in our methodology are:

* **Stories**: We assigned stories to developers which represented some value to the user. We made sure that the stories represented a small part of whole iteration's work.
* **Weekly Cycle**: We completed the milestone over the course of two weekly iterations.
* **Code Reviews**: We diligently followed code reviews for merging feature branches to the developer branch. We mandated that each pull request needed at least two approvals before merging. This has helped ensure quality of code delivered. All the pull requests can be found [here](https://github.ncsu.edu/csc510-fall2019/CSC510-12/pulls?q=is%3Apr+is%3Aclosed). 
* **Incremental Design**: We have followed an incremental design by 
    * Building simple things that could possibly work (Assignee Recommendations use case was initially implemented considering only developer workload. It was later extended to include skillset match also as a factor in recommendation. Similarly, at the end of iteration 1, stale issues usecase only supported finding stale issues. Stale issue presentation part was added as part of iteration 2)
    * Refactoring and testing (For all use cases, refactoring has been done to simplify code, add abstraction, remove duplicate code by introducing a library of helper functions that can be shared across use cases.)
