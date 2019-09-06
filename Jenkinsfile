#!groovy

def kubernetes_config = """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:12.10.0-alpine
    tty: true
"""

// properties([pipelineTriggers([githubPush()])])
pipeline {
    agent {
        kubernetes {
            label 'explorer-for-zos-pod'  
            yaml kubernetes_config
        }
    }
    options {
        skipDefaultCheckout(true) 
    }
    stages {
        stage('Compile & Test') {
            environment {
                npm_config_cache = "${env.WORKSPACE}"
            }
            steps {
                
                container('node') {
                    sh "pwd"
                    echo "${env.WORKSPACE}"
                    // sh "ls"
                    // sh "hostnamectl"
                    // sh 'yum install sudo -y'
                    // sh 'sudo yum install -y gcc-c++ make'
                    // sh 'sudo curl -sL https://rpm.nodesource.com/setup_6.x | sudo -E bash -'
                    // sh 'sudo yum install nodejs'

                    // sh "npm ci"
                    // sh "npm test"

                    sh "npm i vsce"
                }
            }
        }
    }
}
