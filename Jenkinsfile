#!groovy

def kubernetes_config = """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:12.9.1-alpine
    tty: true
"""

properties([pipelineTriggers([githubPush()])])
pipeline {
    agent {
        kubernetes {
            label 'explorer-for-zos-pod'  
            yaml kubernetes_config
        }
    }
    // triggers {
	// 	gitlab(
	// 		triggerOnPush: true,
	// 		triggerOnMergeRequest: true,
	// 		triggerOpenMergeRequestOnPush: "both",
	// 		triggerOnNoteRequest: true,
	// 		noteRegex: "REBUILD",
	// 		skipWorkInProgressMergeRequest: false,
	// 		ciSkip: true,
	// 		setBuildDescription: true,
	// 		addNoteOnMergeRequest: true,
	// 		addCiMessage: true,
	// 		addVoteOnMergeRequest: true,
	// 		acceptMergeRequestOnSuccess: false,
	// 		branchFilterType: "All",
	// 		includeBranchesSpec: "",
	// 		excludeBranchesSpec: ""
	// 	)
	// }
    stages {
        stage('Compile & Test') {
            environment {
                npm_config_cache = "${env.WORKSPACE}"
            }
            steps {
                
                container('node') {
                    sh "npm ci"
                    // sh "npm test"
                    sh "sudo npm i -g vsce"
                }
            }
        }
    }
}
