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
                    // sh "ls"
                    // sh "hostnamectl"
                    // sh 'yum install sudo -y'
                    // sh 'sudo yum install -y gcc-c++ make'
                    // sh 'sudo curl -sL https://rpm.nodesource.com/setup_6.x | sudo -E bash -'
                    // sh 'sudo yum install nodejs'

                    // withEnv([
                    //         /* Override the npm cache directory to avoid: EACCES: permission denied, mkdir '/.npm' */
                    //         'npm_config_cache=npm-cache',
                    //         /* set home to our current directory because other bower
                    //         * nonsense breaks with HOME=/, e.g.:
                    //         * EACCES: permission denied, mkdir '/.config'
                    //         */
                    //         'HOME=.',
                    //     ]) {
                    //             // your code
                    //     }
                    sh "npm i"
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
