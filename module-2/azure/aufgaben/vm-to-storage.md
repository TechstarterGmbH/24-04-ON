### Step 1: Create ARM Template

#### Substep 1: Create ARM Template for Virtual Machine

- Create a file named `vm-template.json`:
```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachines",
      "apiVersion": "2021-04-01",
      "name": "[parameters('vmName')]",
      "location": "[resourceGroup().location]",
      "properties": {
        "hardwareProfile": {
          "vmSize": "[parameters('vmSize')]"
        },
        "osProfile": {
          "computerName": "[parameters('vmName')]",
          "adminUsername": "[parameters('adminUsername')]",
          "adminPassword": "[parameters('adminPassword')]"
        },
        "storageProfile": {
          "imageReference": {
            "publisher": "Canonical",
            "offer": "UbuntuServer",
            "sku": "18.04-LTS",
            "version": "latest"
          }
        },
        "networkProfile": {
          "networkInterfaces": [
            {
              "id": "[resourceId('Microsoft.Network/networkInterfaces', concat(parameters('vmName'), '-nic'))]"
            }
          ]
        }
      }
    }
  ],
  "parameters": {
    "vmName": {
      "type": "string"
    },
    "vmSize": {
      "type": "string",
      "defaultValue": "Standard_D2s_v3"
    },
    "adminUsername": {
      "type": "string"
    },
    "adminPassword": {
      "type": "securestring"
    }
  }
}
```

#### Substep 2: Create ARM Template for Storage Blob Container

- Create a file named `storage-template.json`:
```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Storage/storageAccounts",
      "apiVersion": "2021-04-01",
      "name": "[parameters('storageAccountName')]",
      "location": "[resourceGroup().location]",
      "sku": {
        "name": "Standard_LRS"
      },
      "kind": "StorageV2",
      "properties": {}
    },
    {
      "type": "Microsoft.Storage/storageAccounts/blobServices/containers",
      "apiVersion": "2021-04-01",
      "name": "[concat(parameters('storageAccountName'), '/default/containerName')]",
      "dependsOn": [
        "[resourceId('Microsoft.Storage/storageAccounts', parameters('storageAccountName'))]"
      ],
      "properties": {}
    }
  ],
  "parameters": {
    "storageAccountName": {
      "type": "string"
    }
  }
}
```

#### Substep 3: Integrate Both ARM Templates into a Single Deployment File

- Create a file named `main-template.json`:
```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2021-04-01",
      "name": "vmDeployment",
      "properties": {
        "mode": "Incremental",
        "template": "[concat(parameters('vmTemplate'))]",
        "parameters": {
          "vmName": {
            "value": "[parameters('vmName')]"
          },
          "vmSize": {
            "value": "[parameters('vmSize')]"
          },
          "adminUsername": {
            "value": "[parameters('adminUsername')]"
          },
          "adminPassword": {
            "value": "[parameters('adminPassword')]"
          }
        }
      }
    },
    {
      "type": "Microsoft.Resources/deployments",
      "apiVersion": "2021-04-01",
      "name": "storageDeployment",
      "properties": {
        "mode": "Incremental",
        "template": "[concat(parameters('storageTemplate'))]",
        "parameters": {
          "storageAccountName": {
            "value": "[parameters('storageAccountName')]"
          }
        }
      }
    }
  ],
  "parameters": {
    "vmTemplate": {
      "type": "string"
    },
    "storageTemplate": {
      "type": "string"
    },
    "vmName": {
      "type": "string"
    },
    "vmSize": {
      "type": "string",
      "defaultValue": "Standard_D2s_v3"
    },
    "adminUsername": {
      "type": "string"
    },
    "adminPassword": {
      "type": "securestring"
    },
    "storageAccountName": {
      "type": "string"
    }
  }
}
```

### Step 2: Implement Node.js Script

#### Substep 1: Write a Node.js Script to Upload a File

- Create a Node.js script named `upload_to_blob.js`:
```javascript
const { BlobServiceClient } = require('@azure/storage-blob');
const fs = require('fs');

async function main() {
  const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
  const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

  const containerName = 'containerName';
  const containerClient = blobServiceClient.getContainerClient(containerName);

  const blobName = 'sample-file.txt';
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const filePath = './sample-file.txt';
  const uploadBlobResponse = await blockBlobClient.uploadFile(filePath);
  console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);
}

main().catch((err) => console.error("Error running sample:", err.message));
```

#### Substep 2: Integrate the Node.js Script into the VM Creation Process

- Modify the `vm-template.json` to run the Node.js script after the VM is created:
```json
{
  "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
  "contentVersion": "1.0.0.0",
  "resources": [
    {
      "type": "Microsoft.Compute/virtualMachines",
      "apiVersion": "2021-04-01",
      "name": "[parameters('vmName')]",
      "location": "[resourceGroup().location]",
      "properties": {
        "hardwareProfile": {
          "vmSize": "[parameters('vmSize')]"
        },
        "osProfile": {
          "computerName": "[parameters('vmName')]",
          "adminUsername": "[parameters('adminUsername')]",
          "adminPassword": "[parameters('adminPassword')]",
          "customData": "[base64(concat('#!/bin/bash\n', 'apt-get update\n', 'apt-get install -y nodejs\n', 'apt-get install -y npm\n', 'npm install @azure/storage-blob\n', 'echo \"export AZURE_STORAGE_CONNECTION_STRING=', parameters('storageConnectionString'), '\" >> ~/.bashrc\n', 'source ~/.bashrc\n', 'node upload_to_blob.js\n'))]"
        },
        "storageProfile": {
          "imageReference": {
            "publisher": "Canonical",
            "offer": "UbuntuServer",
            "sku": "18.04-LTS",
            "version": "latest"
          }
        },
        "networkProfile": {
          "networkInterfaces": [
            {
              "id": "[resourceId('Microsoft.Network/networkInterfaces', concat(parameters('vmName'), '-nic'))]"
            }
          ]
        }
      }
    }
  ],
  "parameters": {
    "vmName": {
      "type": "string"
    },
    "vmSize": {
      "type": "string",
      "defaultValue": "Standard_D2s_v3"
    },
    "adminUsername": {
      "type": "string"
    },
    "adminPassword": {
      "type": "securestring"
    },
    "storageConnectionString": {
      "type": "securestring"
    }
  }
}
```

#### Substep 3: Test the Entire Process

- Deploy the ARM template using the Azure CLI:
```sh
az deployment group create --resource-group yourResourceGroup --template-file main-template.json --parameters @parameters.json
```

- Ensure that the VM is created, the Storage Blob container is set up, and the Node.js script runs to upload the file.

This guide provides the steps to create a VM and a Storage Blob container using ARM templates, and then upload a file using Node.js on the VM. If you need further assistance, please let me know!


I couldn't find specific examples in the repositories searched. Here is a step-by-step guide to achieve this using Node.js.

### Example: Upload a File from a VM to an Azure Blob Storage Container Using Node.js

#### Step 1: Set Up the Azure Blob Storage

1. **Create a Storage Account**:
   - Use the Azure portal or Azure CLI to create a Storage Account.
   - Create a Blob container in the Storage Account.

2. **Get the Connection String**:
   - Navigate to the Storage Account in the Azure portal.
   - Go to "Access keys" and copy the connection string.

#### Step 2: Set Up the VM

1. **Create a Virtual Machine**:
   - Use the Azure portal or Azure CLI to create a Virtual Machine.

2. **Install Node.js and Azure Storage SDK**:
   - Connect to your VM via SSH or RDP.
   - Install Node.js on your VM.
   - Install the Azure Storage SDK:
     ```sh
     npm install @azure/storage-blob
     ```

#### Step 3: Write a Script to Upload Files

1. **Node.js Script to Upload Files**:
   - Create a Node.js script (e.g., `upload_to_blob.js`) on your VM:
     ```javascript
     const { BlobServiceClient } = require('@azure/storage-blob');
     const fs = require('fs');

     async function main() {
         const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
         const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);

         const containerName = 'your-container-name';
         const containerClient = blobServiceClient.getContainerClient(containerName);

         const blobName = 'sample-file.txt';
         const blockBlobClient = containerClient.getBlockBlobClient(blobName);

         const filePath = './sample-file.txt';
         const uploadBlobResponse = await blockBlobClient.uploadFile(filePath);
         console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);
     }

     main().catch((err) => console.error("Error running sample:", err.message));
     ```

2. **Set the Connection String as an Environment Variable**:
   - On your VM, set the connection string as an environment variable:
     ```sh
     export AZURE_STORAGE_CONNECTION_STRING="your-connection-string"
     ```

3. **Run the Script**:
   - Run the Node.js script to upload the file:
     ```sh
     node upload_to_blob.js
     ```

This guide should help you set up a VM and upload a file to an Azure Blob Storage container using Node.js. If you need further assistance, please let me know!
