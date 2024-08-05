const dotenv = require('dotenv')
const url = require('url')
const path = require('path')

if (process.env.NODE_ENV === "development") {
	dotenv.config({ path: ".env.development.local" });
} else {
	dotenv.config();
}


const AWS = require('aws-sdk')
AWS.config.update({ region: 'us-east-2' });

AWS.config.update({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
  });


//Name of Bucket
const S3_BUCKET = process.env.S3_BUCKET

const multer = require('multer')

//  make sure to set environment variables in production for:
//  AWS_ACCESS_KEY_ID
//  AWS_SECRET_ACCESS_KEY
//  and aws will automatically use those environment variables

const s3 = new AWS.S3({ apiVersion: "2006-03-01", region: 'us-east-2' })

//------------------------Public Upload---------------

const singlePublicFileUpload = async (file) => {
	const { originalname, mimetype, buffer } = await file;
	const data = await file
	//name of the file in your s3 bucket will be the date in ms plus the extension name
	const Key = new Date().getTime().toString() + path.extname(originalname);

	const uploadParams = {
		Bucket: S3_BUCKET,
		Key: Key,
		Body: buffer,
		ACL: 'public-read'
	};
	const result = await s3.upload(uploadParams).promise();

	//save name of file in your bucket as the key in your db

	return result.Location;
}

const multiplePublicFileUpload = async (files) => {
	return await Promise.all(
		files.map((file) => {
			return singlePublicFileUpload(file);
		})
	);
};

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

const storage = multer.memoryStorage({
	destination: function (req, file, callback) {
		callback(null, "");
	},
});


const singleMulterUpload = (nameOfKey) =>
	multer({ storage: storage }).single(nameOfKey);

const multipleMulterUpload = (nameOfKey) =>
	multer({ storage: storage }).array(nameOfKey);

module.exports = {
	s3,
	singlePublicFileUpload,
	singleMulterUpload,
	multiplePublicFileUpload,
	multipleMulterUpload
};
