#Despliegue en openshift
## Definir las variables del repositorio
* OPS_INSTANCE: instancia de conexión al servidor openshift
* OPS_TOKEN: token de conexion al servidor openshift
## Crear Ambiente
oc login https://<OPS_INSTANCE>.environments.katacoda.com:443 --token=<OPS_TOKEN>
oc get project myproject

oc new-project myproject
oc new-app rcastillejo/techu-project --name techu-project
oc expose svc/techu-project

## Configurar pipeline bitbucket - Deploy to Openshift
oc login https://<OPS_INSTANCE>.environments.katacoda.com:443 --token=<OPS_TOKEN>
oc project myproject
oc rollout latest dc/techu-project -n myproject
### Ver url del backend desplegado
oc get -o template route techu-project --template={{.spec.host}}
