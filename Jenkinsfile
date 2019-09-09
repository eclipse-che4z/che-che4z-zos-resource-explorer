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
            }
            steps {
                
                container('node') {
                    sh "pwd"
                    echo "${env.WORKSPACE}"
                    sh "npm i --no-bin-links"
                    // sh "npm ci"
                    // sh "npm cache clean --force"
                    sh "npm i vsce"
                    // sh "npm rebuild"
                    // sh "npm i vsce"
                    // sh "npm test"

                }
            }
        }
    }
}
