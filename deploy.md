# Deployment
### Adding the secrets

```shell
 kubectl create secret generic accounts-db \
--from-literal=POSTGRES_USER="asd" \
--from-literal=POSTGRES_PASSWORD="asd"

 kubectl create secret generic auth \
--from-literal=JWT_SECRET="sad"
```

