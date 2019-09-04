#!groovy

def kubernetes_config = """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:12
    tty: true
"""

pipeline {
    agent {
        kubernetes {
            label 'explorer-for-zos'
            yaml kubernetes_config
        }
    }
    stages {
        stage('Checkout') {
            steps {
                // Checkout code from repository
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'yarn install'
            }
        }

        stage('Compile') {
            steps {
                sh 'yarn run compile'
            }
        }
    }
}
