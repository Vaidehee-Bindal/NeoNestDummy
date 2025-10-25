const AWS = require('aws-sdk');
const multer = require('multer');
const path = require('path');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images and documents are allowed'));
    }
  },
});

// Upload file to S3
const uploadToS3 = async (file, folder = 'documents') => {
  try {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: `${folder}/${Date.now()}-${file.originalname}`,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'private', // Private by default for security
    };

    const result = await s3.upload(params).promise();
    return result.Location;
  } catch (error) {
    console.error('S3 upload error:', error);
    throw error;
  }
};

// Delete file from S3
const deleteFromS3 = async (fileUrl) => {
  try {
    const key = fileUrl.split('/').slice(-2).join('/'); // Extract key from URL
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
    };

    await s3.deleteObject(params).promise();
    return true;
  } catch (error) {
    console.error('S3 delete error:', error);
    throw error;
  }
};

// Generate signed URL for private file access
const getSignedUrl = async (fileUrl, expiresIn = 3600) => {
  try {
    const key = fileUrl.split('/').slice(-2).join('/');
    const params = {
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Expires: expiresIn,
    };

    return s3.getSignedUrl('getObject', params);
  } catch (error) {
    console.error('S3 signed URL error:', error);
    throw error;
  }
};

module.exports = {
  upload,
  uploadToS3,
  deleteFromS3,
  getSignedUrl,
};
