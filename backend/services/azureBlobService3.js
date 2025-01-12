import { BlobServiceClient } from '@azure/storage-blob';
const containerName = process.env.CONTAINER_NAME;

export async function uploadPdf(filePath) {
  const containerClient = new BlobServiceClient(containerName);
  const blobName = `pdfs/${path.basename(filePath)}`; // Store PDFs in a separate "pdfs" folder
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  // Upload the file
  await blockBlobClient.uploadFile(filePath);

  // Set HTTP headers for the blob
  const headers = {
    blobContentType: "application/pdf", // Ensures it is treated as a PDF
    blobContentDisposition: `attachment; filename="${path.basename(filePath)}"`, // Forces download with correct filename
  };
  await blockBlobClient.setHTTPHeaders(headers);

  console.log(`Uploaded PDF ${blobName} successfully`);

  return blockBlobClient.url;
}
