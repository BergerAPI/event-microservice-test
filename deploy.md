# Deployment
### Adding the secrets

```shell
 kubectl create secret generic postgres \
--from-literal=POSTGRES_USER="<change-this>" \
--from-literal=POSTGRES_PASSWORD="<change-this>"

 kubectl create secret generic auth \
--from-literal=JWT_SECRET="<change-this>"
```

