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

properties([pipelineTriggers([githubPush()])])
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


                    // sh "npm ci"
                    // sh "npm test"
                    // sh "sudo npm i -g vsce"
                }
            }
        }
    }
}
