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

pipeline {
    agent {
        kubernetes {
            label 'explorer-for-zos-pod'  
            yaml kubernetes_config
        }
    }
    
    options {
        skipDefaultCheckout(true) 
    }
    stages {
        stage('Compile & Test') {
            environment {
                npm_config_cache = "${env.WORKSPACE}"
                branchName = "${env.BRANCH_NAME}"
            }
            steps {
                container('node') {
                    sh "pwd"
                    sh "echo $branchName"
                    // sh "wget https://github.com/tomascechatbroadcomcom/che-devfile/releases/download/ZE_0.8.0/broadcomMFD.zosexplorer-0.8.0.vsix"
                    // sh "npm ci"
                    // sh "npm test"
                    // sh "npm run webpack-production"
                    // sh "npm i vsce -prefix $HOME/agent/workspace/che-che4z-explorer-for-zos_cicd/tools"
                    // sh "$HOME/agent/workspace/che-che4z-explorer-for-zos_cicd/tools/node_modules/vsce/out/vsce package"
                }
            }
        }
        stage('Deploy') {
            steps {
                container('jnlp') {
                    sshagent ( ['projects-storage.eclipse.org-bot-ssh']) {
                        // branch = "${env.BRANCH_NAME}"
                        sh "echo $branchName"
                        // sh '''
                        // ssh genie.che4z@projects-storage.eclipse.org rm -rf /home/data/httpd/download.eclipse.org/che4z/snapshots
                        // ssh genie.che4z@projects-storage.eclipse.org mkdir -p /home/data/httpd/download.eclipse.org/che4z/snapshots                        
                        // '''

                        // sh '''
                        // ssh genie.che4z@projects-storage.eclipse.org rm -rf /home/data/httpd/download.eclipse.org/che4z/snapshots
                        // ssh genie.che4z@projects-storage.eclipse.org mkdir -p /home/data/httpd/download.eclipse.org/che4z/snapshots
                        // pwd
                        // ls
                        // scp -r /home/jenkins/agent/workspace/e4z-explorer-for-zos_cicd-deploy/*zosexplorer*.vsix genie.che4z@projects-storage.eclipse.org:/home/data/httpd/download.eclipse.org/che4z/snapshots
                        // '''
                    }
                }
            }
        }
    }
}
