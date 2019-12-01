# DEPLOY

### Deployment scripts

The bot is hosted on Google Cloud Platform. We are using two Ubuntu VM instances for the deployment one of which is used for Mattermost server and the other one is hosting NoMatterBot and the database that the bot needs. The server is confifured to accepts all the incoming traffic from Github.\\
To deploy and run this bot, numerous packages need to be installed, the latest code for the bot needs to cloned from Github and some environment variables need to set. All these tasks are automated using an ansible playbook [main.yml](https://github.ncsu.edu/csc510-fall2019/CSC510-12/blob/master/deploy/main.yml).\\
When this playbook is run on the remote server using `ansible-playbook main.yml -i inventory`, it prompts the user to set the environment variables. The playbook ensures that all the variables are set and then installs all the necessary packages. It also clones the latest code from the master branch of the bot's repository and installs (if not already installed) and configures the MySQL database.\
The bot is kept up and running using `forever`.

### Acceptance testing



### Exploratory testing and final code

### Continuous Integration (CI) Server