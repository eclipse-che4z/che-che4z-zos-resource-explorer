#!groovy

pipeline {
    agent any
    stages {
        stage('Checkout') {
            // Checkout code from repository
            checkout scm
        }

        stage('Install') {
            sh 'npm ci'
        }

        stage('Compile') {
            sh 'npm run compile'
        }

        stage('Package') {
            sh 'vsce package'
            archiveArtifacts '*.vsix'
        }
    }
}
