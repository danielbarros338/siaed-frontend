pipeline {
    agent any

    environment {
        GIT_BRANCH          = "${env.BRANCH_NAME ?: 'main'}"
        PROD_HOST           = 'logosnext.com.br'
        PROD_USER           = 'root'
        SSH_CREDENTIALS     = 'ssh-prod-server'
        REMOTE_APP_DIR      = '/root/siaed-client'

        NEXT_PUBLIC_API_URL = credentials('siaed_url_api')

        HOME                = '/tmp'
        NPM_CONFIG_CACHE    = '/tmp/.npm'
    }

    stages {
        stage('Install & Verify') {
            agent {
                docker {
                    image 'node:24.12.0-alpine'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    mkdir -p /tmp/.npm
                    npm ci
                    npm run lint
                    npm run build
                '''
            }
        }

        stage('Deploy to Production') {
            steps {
                sshagent(credentials: [env.SSH_CREDENTIALS]) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${PROD_USER}@${PROD_HOST} '
                        set -e

                        if [ ! -d "${REMOTE_APP_DIR}/.git" ]; then
                            echo "Diretorio nao encontrado. Clonando repositorio..."
                            git clone https://github.com/danielbarros338/siaed-frontend.git ${REMOTE_APP_DIR}
                        fi

                        cd ${REMOTE_APP_DIR}

                        echo "Commit antes:"
                        git rev-parse --short HEAD

                        git fetch origin
                        git reset --hard origin/${GIT_BRANCH}

                        echo "Commit depois:"
                        git rev-parse --short HEAD

                        export NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL}"
                        docker compose down --remove-orphans || true
                        CONTAINERS_ON_PORT=\$(docker ps -q --filter "publish=9090")
                        if [ -n "\$CONTAINERS_ON_PORT" ]; then
                            echo "Parando containers na porta 9090..."
                            docker stop \$CONTAINERS_ON_PORT
                        fi
                        docker compose build --no-cache
                        docker compose up -d --force-recreate
                        '
                    """
                }
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
