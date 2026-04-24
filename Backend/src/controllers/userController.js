const db = require("../config/db");
const cloudinary = require("../config/cloudinary");
const { getUserProfileByCustomId } = require("../utils/userProfile");
const { isProfileComplete } = require("../utils/profileCompletion");

const FEATURED_HOME_USERS = [
    "Vraj Baria",
    "Smit Virani",
    "Xavier",
    "Kunj Sheth",
    "Kalp patel",
];

const PHONE_ERROR = "Enter a valid 10-digit mobile number starting with 6, 7, 8, or 9.";

const normalizeIndianPhone = (value) => {
    const raw = String(value ?? "").trim();

    if (!raw) {
        return "";
    }

    if (/^\+91[6-9]\d{9}$/.test(raw)) {
        return raw;
    }

    if (/^[6-9]\d{9}$/.test(raw)) {
        return `+91${raw}`;
    }

    return null;
};

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

exports.getFeaturedUsers = async (req, res) => {
    try {
        const featuredUsersResult = await db.query(
            `SELECT
                requested.name AS requested_name,
                requested.position,
                u.custom_id,
                u.full_name,
                COALESCE(u.profile_pic, '') AS profile_pic,
                COALESCE(u.tagline, '') AS tagline
             FROM unnest($1::text[]) WITH ORDINALITY AS requested(name, position)
             LEFT JOIN LATERAL (
                 SELECT custom_id, full_name, profile_pic, tagline
                 FROM users
                 WHERE LOWER(full_name) = LOWER(requested.name)
                 ORDER BY
                     CASE WHEN COALESCE(profile_pic, '') <> '' THEN 0 ELSE 1 END,
                     CASE WHEN COALESCE(tagline, '') <> '' THEN 0 ELSE 1 END,
                     joined_at DESC NULLS LAST
                 LIMIT 1
             ) u ON true
             ORDER BY requested.position`,
            [FEATURED_HOME_USERS]
        );

        const users = featuredUsersResult.rows
            .filter((row) => row.custom_id)
            .map(({ custom_id, full_name, profile_pic, tagline }) => ({
                custom_id,
                full_name,
                profile_pic,
                tagline,
            }));

        const missingNames = featuredUsersResult.rows
            .filter((row) => !row.custom_id)
            .map((row) => row.requested_name);

        res.json({ users, missingNames });
    } catch (error) {
        console.error("getFeaturedUsers error:", error.message);
        res.status(500).json({ error: "Server error" });
    }
};

exports.updateProfile = async (req, res) => {
    const client = await db.connect();

    try {
        const { custom_id } = req.user;
        const { name, tagline, phone } = req.body;
        const normalizedName = name !== undefined ? String(name).trim() : undefined;
        const normalizedTagline = tagline !== undefined ? String(tagline).trim() : undefined;
        const normalizedPhone = phone !== undefined ? normalizeIndianPhone(phone) : undefined;

        if (name !== undefined) {
            if (!normalizedName) {
                return res.status(400).json({ error: "Full name is required." });
            }

            if (!/^[a-zA-Z\s]+$/.test(normalizedName)) {
                return res.status(400).json({ error: "Only alphabets and spaces allowed in full name." });
            }

            if (normalizedName.length < 3) {
                return res.status(400).json({ error: "Full name must be at least 3 characters." });
            }
        }

        if (normalizedTagline !== undefined && normalizedTagline.length > 50) {
            return res.status(400).json({ error: "Tagline must be 50 characters or fewer." });
        }

        if (normalizedPhone === null) {
            return res.status(400).json({ error: PHONE_ERROR });
        }

        await client.query("BEGIN");

        const existingProfileResult = await client.query(
            `SELECT u.email, up.city, up.state, up.phone
             FROM users u
             LEFT JOIN user_profiles up ON up.user_id = u.custom_id
             WHERE u.custom_id = $1`,
            [custom_id]
        );
        const existingProfile = existingProfileResult.rows[0] || {};

        const userFields = [];
        const userValues = [];
        let paramIndex = 1;

        if (name !== undefined) {
            userFields.push(`full_name = $${paramIndex++}`);
            userValues.push(normalizedName);
        }

        if (tagline !== undefined) {
            userFields.push(`tagline = $${paramIndex++}`);
            userValues.push(normalizedTagline.slice(0, 50));
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
            const location = [existingProfile.city, existingProfile.state]
                .map((value) => (typeof value === "string" ? value.trim() : ""))
                .filter(Boolean)
                .join(", ");
            const profileCompleted = isProfileComplete({
                phoneNumber: normalizedPhone,
                email: existingProfile.email,
                location,
            });

            await client.query(
                `INSERT INTO user_profiles (user_id, phone, profile_completed, updated_at)
                 VALUES ($1, $2, $3, NOW())
                 ON CONFLICT (user_id)
                 DO UPDATE SET
                    phone = EXCLUDED.phone,
                    profile_completed = EXCLUDED.profile_completed,
                    updated_at = NOW()`,
                [custom_id, normalizedPhone, profileCompleted]
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
