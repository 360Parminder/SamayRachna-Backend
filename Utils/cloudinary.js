const { v2: cloudinary } = require('cloudinary');

// Cloudinary configuration
cloudinary.config({ 
    cloud_name: 'dvo4tvvgb', 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET // Make sure this is correctly set in the environment variables
});

 const uploadImage = async (filePath, fileName) => {
    console.log('Uploading image:', fileName, filePath);
    try {
        if (!filePath || !fileName) {
            throw new Error('File path and file name are required');
        }
        const sanitizedPublicId = fileName.split('.')[0].replace(/[^a-zA-Z0-9-_]/g, '');
        console.log('Sanitized Public ID:', sanitizedPublicId);

        // Upload the image to Cloudinary in the "Products" folder
        const uploadResult = await cloudinary.uploader.upload(filePath, {
            folder: 'Profile',
            public_id: sanitizedPublicId, // Use the sanitized public ID
            use_filename: true,
        });
        // Return the secure URL of the uploaded image
        return {
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
        };
    } catch (error) {
       return error;
    }
};

 async function uploadToCloudinary(filePath) {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: 'raw', // Use 'raw' for non-media files like PDFs
            folder: 'Timetable',      // Optional: Specify a folder in Cloudinary
            flags: 'attachment',  // Optional: Add the 'attachment' flag for content disposition
        });
        // console.log('Upload Successful:', result);
        return result.secure_url; // The publicly accessible URL
    } catch (error) {
       return error;
    }
}

module.exports = {
    uploadToCloudinary,
    uploadImage
};

