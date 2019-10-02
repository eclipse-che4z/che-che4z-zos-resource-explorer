#!groovy

def kubernetes_config = """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:12.10.0-alpine
    tty: true
  - name: jnlp
    volumeMounts:
    - name: volume-known-hosts
      mountPath: /home/jenkins/.ssh
  volumes:
  - name: volume-known-hosts
    configMap:
      name: known-hosts
"""

def kubeLabel= 'explorer-for-zos-pod_' + env.BRANCH_NAME + '_' + env.BUILD_NUMBER

pipeline {
    agent {
        kubernetes {
            label kubeLabel
            // label 'explorer-for-zos-pod_' + env.BRANCH_NAME + '_' + env.BUILD_NUMBER
            yaml kubernetes_config
        }
    }    
    options {
        // disableConcurrentBuilds()
        timestamps()
        timeout(time: 3, unit: 'HOURS')
        skipDefaultCheckout(false)
        // skipDefaultCheckout(true)
    }
    environment {
       branchName = "${env.BRANCH_NAME}"
       dirPath = "${kubeLabel}"
    }
    stages {
        stage('Install & Test') {
            environment {
                npm_config_cache = "${env.WORKSPACE}"
                    dirPath = "${env.WORKSPACE}"
            }
            steps {
                container('node') {
                    sh "echo ${dirPath}"
                    sh "echo $npm_config_cache"
                    sh "echo ${env.WORKSPACE}"
                    sh "npm ci"
                    // sh "npm test"
                }
            }
        }
        stage('Package') {
            environment {
                npm_config_cache = "${env.WORKSPACE}"
            }
            steps {
                container('node') {
                    sh "npm run webpack-production"
                    sh "npm i vsce -prefix $HOME/agent/workspace/$kubeLabel/tools -g"
                    sh "$HOME/agent/workspace/$kubeLabel/tools/lib/node_modules/vsce/out/vsce package"
                    // sh "npm i vsce -prefix $HOME/agent/workspace/*/tools -g"
                    // sh "$HOME/agent/workspace/*/tools/lib/node_modules/vsce/out/vsce package"
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    if (branchName == 'master' || branchName == 'development') {
                        container('jnlp') {
                            sshagent ( ['projects-storage.eclipse.org-bot-ssh']) {
                                sh '''
                                ssh genie.che4z@projects-storage.eclipse.org rm -rf /home/data/httpd/download.eclipse.org/che4z/snapshots/zos-resource-explorer/$branchName
                                ssh genie.che4z@projects-storage.eclipse.org mkdir -p /home/data/httpd/download.eclipse.org/che4z/snapshots/zos-resource-explorer/$branchName
                                scp -r /home/jenkins/agent/workspace/*/*.vsix genie.che4z@projects-storage.eclipse.org:/home/data/httpd/download.eclipse.org/che4z/snapshots/zos-resource-explorer/$branchName
                                '''
                            }
                        }
                    } else {
                        echo "Deployment skipped for branch: ${branchName}"
                        container('jnlp') {
                            sshagent ( ['projects-storage.eclipse.org-bot-ssh']) {
                                sh '''
                                ssh genie.che4z@projects-storage.eclipse.org rm -rf /home/data/httpd/download.eclipse.org/che4z/snapshots/zos-resource-explorer/$branchName
                                ssh genie.che4z@projects-storage.eclipse.org mkdir -p /home/data/httpd/download.eclipse.org/che4z/snapshots/zos-resource-explorer/$branchName
                                scp -r $dirPath/*.vsix genie.che4z@projects-storage.eclipse.org:/home/data/httpd/download.eclipse.org/che4z/snapshots/zos-resource-explorer/$branchName
                                '''
                            }
                        }
                    }
                }
            }
        }
    }
}
