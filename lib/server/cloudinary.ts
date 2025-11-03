import { UploadApiResponse } from "cloudinary";
import { v2 as cloudinary } from "cloudinary";

interface uploadImageParams {
  filePath: string;
  product_id: string;
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const uploadImagesInBulk = async (files: uploadImageParams[]) => {
  try {
    const results = await Promise.all(
      files.map((image) =>
        uploadImageToCloudinary({
          filePath: image.filePath,
          product_id: image?.product_id,
        })
      )
    );

    return results;
  } catch (error) {
    console.log("CLOUDINARY::IMAGE:UPLOAD:ERROR", error);
  }
};

export const uploadImageToCloudinary = async ({
  filePath,
  product_id,
}: uploadImageParams) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      folder: `munna-mart/products/${product_id}`, // organize images by product ID
      use_filename: true,
      unique_filename: false,
      resource_type: "image",
    });

    return uploadResult.secure_url;
  } catch (error) {
    console.log("upload_Image_To_Cloudinary::Error ", error);
  }
};

export const deleteAllImageWithFolder = async ({
  product_id,
}: {
  product_id: string;
}) => {
  try {
    // 1. for deleting all images with the prefix (all images of a product) to empty the folder
    await cloudinary.api.delete_resources_by_prefix(
      `munna-mart/products/${product_id}/`
    );

    // 2. then delete the folder itself
    // for deleting the folder if needed (deletes all images in the folder)
    await cloudinary.api.delete_folder(`munna-mart/products/${product_id}`);
  } catch (error) {
    console.log("delete_ImageFolder_From_Cloudinary:Error ", error);
  }
};

export const uploadImageBufferToCloudinary = async ({
  images,
  product_id,
}: {
  images: File[];
  product_id: string;
}) => {
  const uploadedImages: UploadApiResponse[] = [];
  try {
    for (const img of images) {
      if (img instanceof File) {
        const arrayBuffer = await img.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadRes: UploadApiResponse = await new Promise(
          (resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: `munna-mart/products/${product_id}` },
              (err, result) => {
                if (err) reject(err);
                else resolve(result as UploadApiResponse);
              }
            );
            stream.end(buffer);
          }
        );

        uploadedImages.push(uploadRes);
      }
    }

    return uploadedImages.map((img) => img.secure_url);
  } catch (error) {
    throw new Error("Failed to upload images to Cloudinary", error as Error);
  }
};
