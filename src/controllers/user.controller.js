import cloudinary from "../config/cloudinary.js";
import { User } from "../models/User.model.js";

export const uploadProfileImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  // Upload to Cloudinary
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "profiles",
  });

  // Save URL in DB
  const user = await User.findByIdAndUpdate(
    req.user.id,
    { profileImage: result.secure_url },
    { new: true }
  ).select("username profileImage");

  res.json({
    message: "Profile image updated",
    user,
  });
};

export const removeProfileImage = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("username profileImage");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Attempt to remove image from Cloudinary if we have a URL
    if (user.profileImage) {
      try {
        const parts = user.profileImage.split('/profiles/');
        if (parts[1]) {
          const publicPart = parts[1].split('.')[0];
          const publicId = `profiles/${publicPart}`;
          await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
        }
      } catch (err) {
        // Log but don't block removal from DB
        console.warn('Failed to destroy image on Cloudinary', err.message || err);
      }
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { profileImage: null },
      { new: true }
    ).select("username profileImage");

    res.json({ message: "Profile image removed", user: updated });
  } catch (err) {
    next(err);
  }
};
