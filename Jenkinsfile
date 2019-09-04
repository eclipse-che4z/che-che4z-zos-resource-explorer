#!groovy

pipeline {
    agent any
    tools {
        node 'node-v10.15.3-linux-x64'
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

        stage('Package') {
            steps {
                sh 'vsce package'
                archiveArtifacts '*.vsix'
            }
        }
    }
}
