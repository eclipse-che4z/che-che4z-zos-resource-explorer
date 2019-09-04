#!groovy

def kubernetes_config = """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:12.9-alpine
    tty: true
"""

pipeline {
agent {
        kubernetes {
            label label 'explorer-for-zos-pod'
            yaml kubernetes_config
        }
    }
    options {
        buildDiscarder logRotator(numToKeepStr: '15')
    }
    stages {
        stage('Build') {
            environment {
                SPAWN_WRAP_SHIM_ROOT = "${env.WORKSPACE}"
                YARN_ARGS = "--cache-folder ${env.WORKSPACE}/yarn-cache --global-folder ${env.WORKSPACE}/yarn-global"
            }
            steps {
                container(node) {
                    sh "yarn ${env.YARN_ARGS} install"
                    sh "yarn ${env.YARN_ARGS} test"
                }
            }
        }
    }
}
