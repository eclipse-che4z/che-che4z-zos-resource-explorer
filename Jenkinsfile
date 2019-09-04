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
            label label 'explorer-for-zos-pod'
            yaml kubernetes_config
        }
    }
    stages {
        stage('Build') {
            steps {
                container('node') {
                    sh "npm ci"
                    sh "npm t"
                }
            }
        }
    }
}
