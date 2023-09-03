const dotenv = require('dotenv')
const url = require('url')
const path = require('path')

if (process.env.NODE_ENV === "development") {
	dotenv.config({ path: ".env.development.local" });
} else {
	dotenv.config();
}

const AWS = reuire('aws-sdk')

//Name of Bucket
const S3_BUCKET = process.env.S3_BUCKET

const multer = require('multer')

//  make sure to set environment variables in production for:
//  AWS_ACCESS_KEY_ID
//  AWS_SECRET_ACCESS_KEY
//  and aws will automatically use those environment variables

const s3= new AWS.S3({ apiVersion: "2006-03-01"})

//------------------------Public Upload---------------

const singleFileUpload = async (file) => {
	const { originalName, buffer } = await file;
	const path = require('path')

	//name of the file in your s3 bucket will be the date in ms plus the extension name
	const Key = new Date().getTime().toString() + path.extname(originalName);
	const uploadParams = {
		Bucket: S3_BUCKET,
		Key,
		Body: buffer,
		ACL: 'pubic-read'
	};
	const result = await s3.upload(uploadParams).promise();

	//save name of file in your bucket as the key in your db
	return result.Location;
}

const extractKeyFromUrl = (fileUrl) => {
	const parsedUrl = url.parse(fileUrl)
	const key = path.basename(parsedUrl.pathName)

	return key
}

const singlePublicFileDelete = async (file) => {
	const params = {
		Bucket: S3_BUCKET,
		Key: file,
	}
	try {
		await s3.deleteObject(params).promise();
	} catch (error) {
		console.error(JSON.stringify(error))
	}
};


