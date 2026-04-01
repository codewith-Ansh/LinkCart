const db = require("../config/db");
const cloudinary = require("../config/cloudinary");
const { getUserProfileByCustomId } = require("../utils/userProfile");

const uploadBufferToCloudinary = (buffer, folder, publicId) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder,
                public_id: publicId,
                overwrite: true,
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(result);
            }
        );

        stream.end(buffer);
    });

exports.getUserById = async (req, res) => {
  try {
    const { custom_id } = req.params;

    const userResult = await db.query(
      `SELECT 
          u.custom_id,
          u.full_name,
          COALESCE(u.profile_pic, '') AS profile_pic,
          COALESCE(u.tagline, '') AS tagline,
          up.city,
          up.state,
          up.address
       FROM users u
       LEFT JOIN user_profiles up ON up.user_id = u.custom_id
       WHERE u.custom_id = $1`,
      [custom_id]
    );

    if (userResult.rows.length === 0)
      return res.status(404).json({ error: "User not found" });

    const productsResult = await db.query(
      `SELECT 
          p.*,
          u.full_name AS seller_name,
          COALESCE(u.profile_pic, '') AS seller_profile_pic
       FROM products p
       JOIN users u ON u.custom_id = p.user_id
       WHERE p.user_id = $1 AND p.visibility = 'public'
       ORDER BY p.created_at DESC`,
      [custom_id]
    );

    res.json({ user: userResult.rows[0], products: productsResult.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
    const client = await db.connect();

    try {
        const { custom_id } = req.user;
        const { name, tagline, phone } = req.body;

        if (name !== undefined && !String(name).trim()) {
            return res.status(400).json({ error: "Name cannot be empty." });
        }

        if (tagline !== undefined && String(tagline).length > 50) {
            return res.status(400).json({ error: "Tagline must be 50 characters or fewer." });
        }

        await client.query("BEGIN");

        const userFields = [];
        const userValues = [];
        let paramIndex = 1;

        if (name !== undefined) {
            userFields.push(`full_name = $${paramIndex++}`);
            userValues.push(String(name).trim());
        }

        if (tagline !== undefined) {
            userFields.push(`tagline = $${paramIndex++}`);
            userValues.push(String(tagline).trim().slice(0, 50));
        }

        if (userFields.length > 0) {
            userValues.push(custom_id);
            await client.query(
                `UPDATE users
                 SET ${userFields.join(", ")}
                 WHERE custom_id = $${paramIndex}`,
                userValues
            );
        }

        if (phone !== undefined) {
            await client.query(
                `INSERT INTO user_profiles (user_id, phone, profile_completed, updated_at)
                 VALUES ($1, $2, TRUE, NOW())
                 ON CONFLICT (user_id)
                 DO UPDATE SET
                    phone = EXCLUDED.phone,
                    updated_at = NOW()`,
                [custom_id, phone]
            );
        }

        await client.query("COMMIT");

        const profile = await getUserProfileByCustomId(custom_id);
        res.json({ message: "Profile updated successfully.", user: profile });
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("updateProfile error:", error.message);
        res.status(500).json({ error: "Server error" });
    } finally {
        client.release();
    }
};

exports.uploadProfilePic = async (req, res) => {
    try {
        const { custom_id } = req.user;

        if (!req.file) {
            return res.status(400).json({ error: "Image file is required." });
        }

        const uploadResult = await uploadBufferToCloudinary(
            req.file.buffer,
            "linkcart-profile-pics",
            `profile-${custom_id}`
        );

        const result = await db.query(
            `UPDATE users
             SET profile_pic = $1
             WHERE custom_id = $2
             RETURNING custom_id`,
            [uploadResult.secure_url, custom_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "User not found." });
        }

        const profile = await getUserProfileByCustomId(custom_id);
        res.json({ message: "Profile picture updated successfully.", user: profile });
    } catch (error) {
        console.error("uploadProfilePic error:", error.message);
        res.status(500).json({ error: "Failed to upload profile picture." });
    }
};
