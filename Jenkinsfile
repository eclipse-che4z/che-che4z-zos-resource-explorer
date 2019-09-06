#!groovy

def kubernetes_config = """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: centos:latest
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
    stages {
        stage('Compile & Test') {
            environment {
                npm_config_cache = "${env.WORKSPACE}"
            }
            steps {
                
                container('node') {
                    // sh "hostnamectl"
                    sh 'yum install -y gcc-c++ make'
                    sh 'curl -sL https://rpm.nodesource.com/setup_6.x | sudo -E bash -'
                    sh 'yum install nodejs'


                    sh "npm ci"
                    sh "npm test"
                    // sh "sudo npm i -g vsce"
                }
            }
        }
    }
}
