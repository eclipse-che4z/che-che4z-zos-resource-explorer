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
    def customImage = docker.build("my-image:${env.BUILD_ID}")
        customImage.inside {
        sh 'echo "container inside"'
        }
    options {
        skipDefaultCheckout(true) 
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
                    // sh "npm i --no-bin-links"
                    // sh "npm ci"
                    // sh 'ci-scripts/package.sh'
                    // sh "npm cache clean --force"
                    // sh "npm i vsce"
                    // sh "npm rebuild"
                    // sh "npm i vsce"
                    // sh "npm test"
                    

                }
            }
        }
    }
}
