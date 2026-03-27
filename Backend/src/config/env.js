const dotenv = require("dotenv");

dotenv.config();

process.env.EMAIL_USER = process.env.EMAIL_USER || process.env.EMAIL;
process.env.EMAIL_PASS = process.env.EMAIL_PASS || process.env.APP_PASSWORD;

const requiredEnvVars = [
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
    "CALLBACK_URL",
    "EMAIL_USER",
    "EMAIL_PASS",
];

const validateEnv = () => {
    const missingEnvVars = requiredEnvVars.filter((envName) => !process.env[envName]);

    if (missingEnvVars.length > 0) {
        console.error("Missing required env variables:", missingEnvVars.join(", "));
        throw new Error("Missing required env variables");
    }
};

module.exports = {
    validateEnv,
};
