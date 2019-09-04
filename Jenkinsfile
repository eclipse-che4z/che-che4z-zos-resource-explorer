#!groovy

def kubernetes_config = """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:8.12
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
                sh 'npm ci'
            }
        }

        stage('Compile') {
            steps {
                sh 'npm run compile'
            }
        }
    }
}
