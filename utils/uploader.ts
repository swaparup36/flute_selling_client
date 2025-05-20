"use server";

import cloudinary from "@/lib/cloudinary";

export default async function uploadProductImages(formData: FormData, numberOfImages: number) {
    try {
        const imageURLs = [];

        for(let i = 0; i < numberOfImages; i++) {
            const file = formData.get(`file-${i}`) as File | null;
            if(!file) return JSON.stringify({ success: false, error: 'File not provided' });

            let imageURL = '';

            console.log(file.name);

            const fileExtension = file.name.toLowerCase().split('.')[file.name.toLowerCase().split('.').length-1];

            if (fileExtension === "png" || fileExtension === "jpg" ||  fileExtension === "jpeg") {
                // Convert file to a buffer
                const fileBuffer = await fileToBuffer(file);

                // Upload the file to Cloudinary
                const uploadResult:any = await new Promise((resolve) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: "product_images", // Optional: Organize images in a specific folder
                        resource_type: "image", // Specify resource type as image
                    },
                    (error, uploadResult) => {
                        return resolve(uploadResult);
                }).end(fileBuffer);
                });

                imageURL = uploadResult.secure_url;

                imageURLs.push(imageURL);
            }else{
                return JSON.stringify({ success: false, error: "Only .png, .jpg, .jpeg files are allowed"});
            }
        }

      return JSON.stringify({ success: true, message: 'File uploaded to object store', imageURLs: imageURLs });
    } catch (error) {
      console.error("Error uploading Image:", error);
      return JSON.stringify({ success: false, error: error });
    }
}

// Helper function to convert a File to a Buffer
async function fileToBuffer(file: File): Promise<Buffer> {
  return Buffer.from(await file.arrayBuffer());
}