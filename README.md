## PART A - Unit Test
See *src/__tests__/Counter.test.tsx*. Execute it using `npm test`.
The Github Action is defined in ``.github/workflows``

## PART B - Continuous Integration

### Create Azure Container Registry
1. Log in to azure using your browser, ensure to be part of [ipt Sandbox subscription](https://app.happeo.com/pages/1e1oopl952ukqf9e0h/AzureAmpDu/1e5g766dso0ms8i9mp)
2. Create your own [azure container registry](https://portal.azure.com/#browse/Microsoft.ContainerRegistry%2Fregistries) \
    a) You will need to create a new resource group. Use default configs for resource group and container registry. \
    b) Use your initials (e.g. SZE) as prefix for Resource Group
3. Get password of your ACR from your Codespace Terminal. For the moment, we are using the ACR Admin credentials for publishing images to the ACR.
```
az login
az acr update --name <My-Azure-ACR> --admin-enabled true
az acr credential show --name <My-Azure-ACR>
```
4. save (first) password as ACR_PASSWORD in github project settings &rarr; Secrets and variables &rarr; Actions &rarr; Repository secrets

### Publish your Webapp to ACR using gitlab pipelines
See ``docker-publish.yml``

### Run ACR image on your local machine (optional)
If Docker is available on your local machine, you can try to run your ACR image locally
```
az acr credential show --name <My-Azure-ACR>
sudo docker login <My-Azure-ACR>.azurecr.io -u <My-Azure-ACR>
sudo docker run -p 3000:3000 <My-Azure-ACR>.azurecr.io/ipt-spins:latest
```

## PART B.2 - Security
Use OIDC instead of Admin Credentials.

## PART C - Continuous Deployment

1. Define a new plan which uses the free azure plan F1
```bash
az appservice plan create --name <your-plan-name> --resource-group <your-resource-groupe-name> --sku F1 --is-linux
```

2. Create a webapp using this plan. Make sure to specify your resource-group and set a name
```bash
az webapp create \
     --resource-group <your-resource-groupe-name>  \
     --plan <your-plan-name> \
     --name <your-webapp-name> \
     --deployment-container-image-name lrengineering.azurecr.io/ipt-spins:latest
```

3. Create credentials which GitHub Action will use to deploy the application
```bash
az ad sp create-for-rbac --name "<your-service-principal-name>" --role contributor \
    --scopes /subscriptions/<subscription-id>/resourceGroups/<resource-group> \
    --sdk-auth
```

Store the returned json as secret in Github: ``<your-repository> ->Settings->Secrets And Variables->Actions secrets and variables``. Use the name ``AZURE_RESOURCEGROUP_CONTRIBUTOR_SERVICEPRINICIPAL``. Create another Action secret or variable
for the application name with ``AZURE_WEBAPP_NAME`` containing ``<your-webapp-name> `` .

## PART D - Code Quality

### Create SonarCloud Project
1. Login to SonarCloud.io using your **Github Account**
2. Create a new SonarCloud project (within your private SonarCloud organisation) for your github repository (stored in your private github account)
    a) Select 'Previous version' when prompted
3. Create a Security Token (My Account &rarr; Security) and store it in your github project settings as SONAR_TOKEN
4. In the SonarCloud project settings under 'Analysis Method', disable 'Automatic Analysis'. This allows us to use CI Analysis, which provides more control over when the repository is analysed and which data is incorporated (for example test coverage reports).
5. Optional: Check the "Quality Gates" section in your SonarCloud organisation. Your can add and customize your own quality gates.

### Extend your GitHub Actions to use SonarCloud
1. See docker-publish.yml on how to enable SonarCloud analysis for each new Pull Request. \
  a) Use the Project Key and Organization Key found in your SonarCloud project under 'Information'
2. Observe your issues in SonarCloud  ((SonarCloud Project &rarr; Main Branch &rarr; Overall Code &rarr; Maintainability / Security Hotspots).: \
  a) Issue in **App.tsx** (in Maintainability) \
  b) Issue in **Dockerfile** (in Security Hotspots)

## PART F - GitOps (Requires Part B)

### Use ArgoCD
(Build your own solution ;-) )


## PART G - Dependency Management

### Manage Dependencies
Try using Dependabot

## PART H - AI Code Review
There are multiple different ways to implement a AI code review. An example with a prePushHook is provided at /.githooks