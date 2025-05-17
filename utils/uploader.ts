"use server"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as dotenv from "dotenv";
dotenv.config();

const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_KEY_ID!,
    },
});

const bucketName = process.env.S3_BUCKET_NAME;

export default async function uploadProductImages(formData: FormData, numberOfImages: number) {
    try {
      const imageURLs: string[] = [];

      for (let i = 0; i < numberOfImages; i++) {
        const file = formData.get(`file-${i}`) as File | null;
        if(!file) return JSON.stringify({ success: false, error: 'File not provided' });

        let imageURL = '';
        console.log(file.name);

        const fileExtension = file.name.toLowerCase().split('.')[file.name.toLowerCase().split('.').length-1];

        if (fileExtension === "png" || fileExtension === "jpg" ||  fileExtension === "jpeg") {
            const buffer = Buffer.from(await file.arrayBuffer());
    
            // Configure the upload parameters
            const uploadParams = {
                Bucket: bucketName,
                Key: file.name,
                Body: buffer,
                ContentType: `image/${fileExtension}`,
            };
        
            // Upload the file
            const data = await s3Client.send(new PutObjectCommand(uploadParams));

            console.log("Upload successful: ", data);

            const signedUrl = `https://satyam-gift-store.s3.ap-south-1.amazonaws.com/${file.name}`;
            imageURL = signedUrl;

            imageURLs.push(imageURL);
        }else{
            return JSON.stringify({ success: false, error: "Only .png, .jpg, .jpeg files are allowed"});
        }
      }

      return JSON.stringify({ success: true, message: 'File upload to object store', imageURLs: imageURLs });
    } catch (error) {
      console.error("Error uploading Image:", error);
      return JSON.stringify({ success: false, error: error });
    }
}