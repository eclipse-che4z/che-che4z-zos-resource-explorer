#!groovy

pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                // Checkout code from repository
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh 'yarn'
            }
        }

        stage('Compile') {
            steps {
                sh 'yarn run compile'
            }
        }
    }
}
