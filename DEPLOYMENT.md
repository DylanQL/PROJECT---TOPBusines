# Deployment Guide - AWS Lambda

Guía completa para desplegar la aplicación en AWS Lambda con Serverless Framework.

## 📋 Requisitos Previos

- Cuenta de AWS activa
- AWS CLI instalado y configurado
- Serverless Framework instalado globalmente
- Permisos IAM adecuados

## 🔧 Configuración Inicial

### 1. Instalar AWS CLI

```bash
# macOS
brew install awscli

# Linux
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Windows
# Descargar desde: https://aws.amazon.com/cli/
```

### 2. Configurar credenciales de AWS

```bash
aws configure
```

Proporcionar:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (ej: `us-east-1`)
- Default output format: `json`

### 3. Instalar Serverless Framework

```bash
npm install -g serverless
```

## 🗄️ Configuración de Base de Datos RDS

### Opción 1: MySQL en RDS (Recomendado para producción)

1. **Crear instancia RDS MySQL**
   ```bash
   aws rds create-db-instance \
     --db-instance-identifier seidor-db \
     --db-instance-class db.t3.micro \
     --engine mysql \
     --master-username admin \
     --master-user-password YourSecurePassword123! \
     --allocated-storage 20 \
     --vpc-security-group-ids sg-xxxxxxxxx \
     --db-subnet-group-name your-subnet-group \
     --publicly-accessible
   ```

2. **Obtener el endpoint**
   ```bash
   aws rds describe-db-instances --db-instance-identifier seidor-db
   ```

3. **Ejecutar script de BD**
   ```bash
   mysql -h seidor-db.xxxxx.us-east-1.rds.amazonaws.com -u admin -p < database/schema.sql
   ```

### Opción 2: Base de datos externa (PlanetScale, etc.)

Si usas un proveedor externo, solo necesitas el connection string.

## 🔐 Gestión de Secretos

### Opción 1: AWS Systems Manager Parameter Store

1. **Guardar secretos**
   ```bash
   aws ssm put-parameter \
     --name "/seidor/db/host" \
     --value "seidor-db.xxxxx.us-east-1.rds.amazonaws.com" \
     --type "String"

   aws ssm put-parameter \
     --name "/seidor/db/user" \
     --value "admin" \
     --type "String"

   aws ssm put-parameter \
     --name "/seidor/db/password" \
     --value "YourSecurePassword123!" \
     --type "SecureString"

   aws ssm put-parameter \
     --name "/seidor/db/name" \
     --value "seidor_database" \
     --type "String"
   ```

2. **Actualizar serverless.yml**
   ```yaml
   provider:
     environment:
       DB_HOST: ${ssm:/seidor/db/host}
       DB_USER: ${ssm:/seidor/db/user}
       DB_PASSWORD: ${ssm:/seidor/db/password~true}
       DB_NAME: ${ssm:/seidor/db/name}
   ```

### Opción 2: Variables en serverless.yml

Para desarrollo/staging:
```yaml
provider:
  environment:
    DB_HOST: your-db-host.com
    DB_USER: admin
    DB_PASSWORD: ${env:DB_PASSWORD}  # Via variable de entorno local
    DB_NAME: seidor_database
```

## 🌐 Configuración de VPC (si usas RDS)

Si tu RDS está en VPC privada, Lambda necesita acceso:

```yaml
# serverless.yml
provider:
  vpc:
    securityGroupIds:
      - sg-xxxxxxxxx  # Security group que permite acceso a RDS
    subnetIds:
      - subnet-xxxxxxxxx  # Subnet privada 1
      - subnet-yyyyyyyyy  # Subnet privada 2
```

**Nota:** Lambda en VPC necesita NAT Gateway o VPC Endpoints para acceder a internet.

## 📦 Despliegue

### Despliegue a Development

```bash
npm run deploy
```

Esto ejecuta:
```bash
serverless deploy --stage dev
```

### Despliegue a Production

```bash
npm run deploy:prod
```

Esto ejecuta:
```bash
serverless deploy --stage prod
```

### Despliegue personalizado

```bash
serverless deploy --stage staging --region eu-west-1
```

## 🔍 Verificación Post-Despliegue

### 1. Obtener información del deployment

```bash
serverless info
```

Output esperado:
```
Service Information
service: seidor-swapi-api
stage: dev
region: us-east-1
stack: seidor-swapi-api-dev
endpoints:
  ANY - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev
  ANY - https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/{proxy+}
functions:
  api: seidor-swapi-api-dev-api
```

### 2. Probar el endpoint

```bash
# Health check
curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/health

# Obtener personajes
curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/api/characters

# Crear favorito
curl -X POST https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/api/favorites \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Luke Skywalker",
    "height": "172",
    "mass": "77",
    "hair_color": "blond",
    "skin_color": "fair",
    "eye_color": "blue",
    "birth_year": "19BBY",
    "gender": "male"
  }'
```

### 3. Ver logs

```bash
# Logs en tiempo real
serverless logs -f api -t

# Logs de las últimas X horas
serverless logs -f api --startTime 2h
```

## 📊 Monitoreo

### CloudWatch

AWS CloudWatch se configura automáticamente. Acceder desde:
- AWS Console → CloudWatch → Logs → `/aws/lambda/seidor-swapi-api-dev-api`

### Métricas importantes

- **Invocations**: Número de llamadas a la función
- **Duration**: Tiempo de ejecución
- **Errors**: Número de errores
- **Throttles**: Invocaciones limitadas

## 🔄 Actualización

### Actualizar código

```bash
# 1. Hacer cambios en el código
# 2. Compilar TypeScript
npm run build

# 3. Redesplegar
npm run deploy
```

### Actualizar solo la función (más rápido)

```bash
serverless deploy function -f api
```

## 🗑️ Eliminación

### Eliminar stack completo

```bash
serverless remove --stage dev
```

**⚠️ ADVERTENCIA:** Esto elimina toda la infraestructura de Lambda y API Gateway, pero NO la base de datos RDS.

## 💰 Estimación de Costos

### AWS Lambda
- **Free Tier**: 1M requests/mes + 400,000 GB-segundos
- **Después**: $0.20 por 1M requests

### API Gateway
- **Free Tier**: 1M requests/mes (primeros 12 meses)
- **Después**: $3.50 por 1M requests

### RDS MySQL (db.t3.micro)
- **Costo**: ~$15-20/mes
- **Free Tier**: 750 horas/mes (primeros 12 meses)

### Estimación para 100K requests/mes:
- Lambda: Gratis (dentro del free tier)
- API Gateway: Gratis (dentro del free tier)
- RDS: ~$15-20/mes (o gratis si free tier)
- **Total**: ~$0-20/mes

## 🔒 Seguridad

### Mejores Prácticas

1. **Usar Parameter Store para secretos**
   ```bash
   aws ssm put-parameter --type SecureString ...
   ```

2. **Restringir permisos IAM**
   ```yaml
   provider:
     iamRoleStatements:
       - Effect: Allow
         Action:
           - ssm:GetParameter
         Resource: "arn:aws:ssm:*:*:parameter/seidor/*"
   ```

3. **Habilitar API Key (opcional)**
   ```yaml
   functions:
     api:
       events:
         - http:
             path: /
             method: ANY
             private: true
   ```

4. **CORS restringido**
   ```yaml
   functions:
     api:
       events:
         - http:
             cors:
               origin: 'https://yourdomain.com'
               headers:
                 - Content-Type
                 - Authorization
   ```

## 🐛 Troubleshooting

### Error: "Unable to import module 'index'"
- **Solución**: Verificar que `serverless-plugin-typescript` esté instalado
- Ejecutar `npm run build` manualmente

### Error: "Task timed out after 30.00 seconds"
- **Solución**: Aumentar timeout en serverless.yml
  ```yaml
  provider:
    timeout: 60
  ```

### Error de conexión a base de datos
- Verificar security groups de RDS
- Verificar que Lambda esté en la VPC correcta
- Verificar credentials en Parameter Store

### Cold start lento
- **Solución**: Usar Provisioned Concurrency
  ```yaml
  functions:
    api:
      provisionedConcurrency: 1
  ```

## 📚 Recursos Adicionales

- [Documentación Serverless Framework](https://www.serverless.com/framework/docs/)
- [AWS Lambda Best Practices](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- [AWS RDS MySQL Documentation](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_MySQL.html)

## 🆘 Soporte

Para problemas o preguntas:
1. Revisar logs en CloudWatch
2. Ejecutar `serverless info` para verificar deployment
3. Verificar permisos IAM
4. Consultar documentación de AWS
