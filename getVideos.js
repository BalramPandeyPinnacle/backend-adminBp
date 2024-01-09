const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

const accessKeyId = 'AKIAUCB5IL64P3INY3NX'; 
const secretAccessKey = '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'; 
const region = 'ap-south-1'; 
const bucketName = 'videocoursespinnacle';

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

const generatePresignedUrl = async (key) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  return signedUrl;
};

module.exports = { generatePresignedUrl };