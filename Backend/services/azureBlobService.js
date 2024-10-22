import { BlobServiceClient } from '@azure/storage-blob';
import path from 'path';

const sasToken = 'sp=racwd&st=2024-10-17T07:01:54Z&se=2024-11-20T15:01:54Z&spr=https&sv=2022-11-02&sr=c&sig=KFsqnmsnzeXUW2wNAI7k%2B7DsDFOe%2BpgUEE0qnKgr%2BTU%3D';
const accountName = 'storevedioslikeudemy';
const containerName = 'udemyy';

const blobServiceClient = new BlobServiceClient(
  `https://${accountName}.blob.core.windows.net?${sasToken}`
);

async function uploadVideo(filePath) {
  const containerClient = blobServiceClient.getContainerClient(containerName);
  const blobName = path.basename(filePath);
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  const uploadBlobResponse = await blockBlobClient.uploadFile(filePath);
  console.log(`Uploaded block blob ${blobName} successfully`, uploadBlobResponse.requestId);

  return blockBlobClient.url;
}

export { uploadVideo };
