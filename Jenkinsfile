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
                sh '/shared/common/yarn/1.15.2/bin/yarn install'
            }
        }

        stage('Compile') {
            steps {
                sh '/shared/common/yarn/1.15.2/bin/yarn run compile'
            }
        }
    }
}
