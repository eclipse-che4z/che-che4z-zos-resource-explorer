#!groovy

def kubernetes_config = """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:12.10.0-alpine
    tty: true
    resources:
      limits:
        memory: "2Gi"
        cpu: "1"
      requests:
        memory: "2Gi"
        cpu: "1"
  - name: jnlp
    volumeMounts:
    - name: volume-known-hosts
      mountPath: /home/jenkins/.ssh
  volumes:
  - name: volume-known-hosts
    configMap:
      name: known-hosts
"""

def projectName = 'zos-resource-explorer'
def kubeLabel = projectName + '_pod_' + env.BRANCH_NAME + '_' + env.BUILD_NUMBER

pipeline {
    agent {
        kubernetes {
            label kubeLabel
            yaml kubernetes_config
        }
    }    
    options {
        disableConcurrentBuilds()
        timestamps()
        timeout(time: 3, unit: 'HOURS')
        skipDefaultCheckout(false)
        buildDiscarder(logRotator(numToKeepStr: '30', artifactNumToKeepStr: '30'))
    }
    environment {
       branchName = "${env.BRANCH_NAME}"
       workspace = "${env.WORKSPACE}"
    }
    stages {
        stage('Install & Test') {
            environment {
                npm_config_cache = "${env.WORKSPACE}"
            }
            steps {
                container('node') {
                    sh "npm ci"
                    sh "npm test"
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
                    sh '''
                        npx vsce package
                        mv zosexplorer*.vsix zosexplorer_latest.vsix
                    '''
                }
            }
        }
        stage('Deploy') {
            steps {
                script {
                    path = 'download.eclipse.org/che4z/snapshots/' + projectName
                    echo path
                    if (branchName == 'master' || branchName == 'development') {
                        container('jnlp') {
                            sshagent ( ['projects-storage.eclipse.org-bot-ssh']) {
                                sh '''
                                ssh genie.che4z@projects-storage.eclipse.org rm -rf /home/data/httpd/download.eclipse.org/che4z/snapshots/zos-resource-explorer/$branchName
                                ssh genie.che4z@projects-storage.eclipse.org mkdir -p /home/data/httpd/download.eclipse.org/che4z/snapshots/zos-resource-explorer/$branchName
                                scp -r $workspace/*.vsix genie.che4z@projects-storage.eclipse.org:/home/data/httpd/download.eclipse.org/che4z/snapshots/zos-resource-explorer/$branchName
                                '''
                                echo "Deployed to https://download.eclipse.org/che4z/snapshots/zos-resource-explorer/$branchName"
                            }
                        }
                    } else {
                        echo "Deployment skipped for branch: ${branchName}"
                        container('jnlp') {
                            sshagent ( ['projects-storage.eclipse.org-bot-ssh']) {
                                sh '''
                                ssh genie.che4z@projects-storage.eclipse.org rm -rf /home/data/httpd/$path/$branchName
                                
                                '''
                                echo "Deployed to https://$path/$branchName"
                            }
                        }
                    }
                }
            }
        }
    }
}
