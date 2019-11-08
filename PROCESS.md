# PROCESS

## Process

We have two sprints for developing our bot:
+ Wed Oct 23-- Fri Nov 1
+ Sat Nov 2--Fri Nov 8th

We have divided our tasks into total 9 stories. Each of us were assigned following stories with associated story points:
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

For every iteration, we assigned tasks to ourselves. The scrumban board for the beginning of each iteration is as follows:
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

## Practices
### Primary Practices

We have followed a combination of Scrum and Kanban practices. Some of the primary practices that we introduced in our methodology was:

* **Stories**: We assigned stories to developers which represented some value to the user. We made sure that the stories represent a small part of whole iteration's work.
* **Weekly Cycle**: We completed the milestone over the course of two weekly iterations.
* **Code Reviews**: We diligently followed code reviews for merging feature branches to the developer branch. We mandated that each pull request needed at least two approvals before merging. This has helped ensure quality of code delivered. All the pull requests can be found [here](https://github.ncsu.edu/csc510-fall2019/CSC510-12/pulls?q=is%3Apr+is%3Aclosed). 
* **Incremental Design**: We have followed an incremental design by 
    * Building simple things that could possibly work (Assignee Recommendations use case was initially implemented considering only developer workload. It was later extended to include skillset match also as a factor in recommendation. Similarly, at the end of iteration 1, stale issues usecase only supported finding stale issues. Stale issue presentation part was added as part of iteration 2)
    * Refactoring and testing (For all use cases, refactoring has been done to simplify code, add abstraction, remove duplicate code by introducing a library of helper functions that can be shared across use cases.)
