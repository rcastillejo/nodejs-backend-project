#Despliegue en openshift
## Crear Ambiente
oc login -u developer -p developer  2886795276-8443-kota03.environments.katacoda.com
oc get project myproject

oc new-project myproject
oc new-app rcastillejo/techu-project --name techu-project
oc expose svc/techu-project

## Configurar pipeline bitbucket - Deploy to Openshift
oc login -u developer -p developer  2886795276-8443-kota03.environments.katacoda.com
oc project myproject
oc rollout latest dc/techu-project -n myproject
### Ver url del backend desplegado
oc get -o template route techu-project --template={{.spec.host}}
