/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./configs/schema.js",
    dialect: "postgresql",
    dbCredentials: {
        url: "postgresql://neondb_owner:npg_GWUBeuqkA4i6@ep-ancient-cloud-a403vemk-pooler.us-east-1.aws.neon.tech/ai_video_gen_db?sslmode=require",
    }
};