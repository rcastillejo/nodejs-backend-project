#Despliegue en openshift
## Definir las variables del repositorio
* OPS_INSTANCE: instancia de conexión al servidor openshift
## Crear Ambiente
oc new-project myproject
oc new-app rcastillejo/techu-project --name myproject
oc expose svc/myproject

## Configurar pipeline bitbucket - Deploy to Openshift
oc login https://<OPS_INSTANCE>.environments.katacoda.com:443 -u developer -p developer
oc project myproject
oc tag rcastillejo/techu-project myproject:latest

# oc set triggers dc/myproject --from-image=myproject:latest -c myproject
### Ver url del backend desplegado
oc get -o template route myproject --template={{.spec.host}}
