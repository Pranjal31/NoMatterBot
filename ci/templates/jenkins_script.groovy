#!groovy

import jenkins.model.*
import hudson.security.*
import hudson.util.*;
import jenkins.install.*;


def instance = Jenkins.getInstance()

def hudsonRealm = new HudsonPrivateSecurityRealm(false)

hudsonRealm.createAccount("{{jenkins_user}}","{{jenkins_password}}")
instance.setSecurityRealm(hudsonRealm)

instance.setInstallState(InstallState.INITIAL_SETUP_COMPLETED)

instance.save()
