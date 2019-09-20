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
                    // sh "npm ci --no-bin-links"
                    // sh "npm i --no-bin-links"
                    sh "npm ci"
                    sh "ls"
                    // sh 'ci-scripts/package.sh'
                    // sh "npm cache clean --force"
                    // sh "webpack --mode production"
                    // sh "npm install -g webpack"
                    sh "npm run aprepublish1"
                    // sh "npm i vsce -prefix $HOME/agent/workspace/che-che4z-explorer-for-zos_cicd"
                    sh "npm i vsce -prefix $HOME/agent/workspace/che-che4z-explorer-for-zos_cicd/tools"
                    // sh "npm rebuild"
                    // sh "npm i vsce"
                    // sh "npm test"
                    // sh "$HOME/agent/workspace/che-che4z-explorer-for-zos_cicd/node_modules/vsce/out/vsce package"
                    sh "$HOME/agent/workspace/che-che4z-explorer-for-zos_cicd/tools/node_modules/vsce/out/vsce package"
                }
            }
        }
    }
}
