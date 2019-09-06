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
        stage('Compile & Test') {
            environment {
                npm_config_cache = "${env.WORKSPACE}"
            }
            steps {
                container('node') {
                    sh "npm ci"
                    // sh "npm test"
                }
            }
        }
        stage('Build') {
            steps {
                container('node') {
                    sh 'npm ci vsce'
                    sh 'vsce package'
                }
            }
        }
    }
}
