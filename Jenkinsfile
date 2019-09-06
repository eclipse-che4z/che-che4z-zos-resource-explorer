#!groovy

def kubernetes_config = """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:12.9.1-alpine
    tty: true
"""

pipeline {
    agent {
        kubernetes {
            label 'explorer-for-zos-pod'  
            yaml kubernetes_config
        }
    }
    stages {
        // stage('Delete dir') {
        //     steps {
        //         // delete workspace
        //         deleteDir()   
        //     }
        // }
        // stage('npm install') {
        //     steps {
        //         npm_config_cache='/path/to/cache'
        //         sh 'npm install'
        //     }
        // }
        stage('Build') {
            environment {
                npm_config_cache = "${env.WORKSPACE}"
                // YARN_ARGS = "--cache-folder ${env.WORKSPACE}/yarn-cache --global-folder ${env.WORKSPACE}/yarn-global"
            }
            steps {
                container('node') {
                    sh "npm ci"
                    sh "npm test"
                }
            }
        }
    }
}
