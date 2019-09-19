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
        skipDefaultCheckout(false) 
    }
    stages {
        stage('Compile & Test') {
            environment {
                npm_config_cache = "${env.WORKSPACE}"
                // sh "echo ${env.WORKSPACE}"  
            }
            steps {
                container('node') {
                    sh "pwd"
                    sh "npm ci"
                    sh "sudo chown -R $USER /usr/local/lib/node_modules"
                    sh "npm i vsce -g"
                    // sh "npm rebuild"
                    // sh "npm i vsce"
                    // sh "npm test"
                    

                }
            }
        }
    }
}
