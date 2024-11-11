import { BlobServiceClient } from '@azure/storage-blob';
import path from 'path';

const sasToken = process.env.SAS_TOKEN;
const accountName = process.env.VEDIO_ACCOUNT_NAME;
const containerName = process.env.CONTAINER_NAME;

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net?${sasToken}`
);

export async function uploadVideo(filePath) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobName = path.basename(filePath);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const uploadBlobResponse = await blockBlobClient.uploadFile(filePath);
  console.log(`Uploaded video ${blobName} successfully`, uploadBlobResponse.requestId);

  return blockBlobClient.url;
}

// Upload image
export async function uploadImage(filePath) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobName = path.basename(filePath);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const uploadBlobResponse = await blockBlobClient.uploadFile(filePath);
  console.log(`Uploaded image ${blobName} successfully`, uploadBlobResponse.requestId);

  return blockBlobClient.url;
}


