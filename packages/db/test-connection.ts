import { prisma } from "./client";

async function testConnection() {
  try {
    // Test the connection by running a simple query
    const result = await prisma.$queryRaw`SELECT 1 as connection_test`;
    console.log("✅ Database connection successful:", result);
    
    // List the existing tables
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log("📋 Available tables:", tables);
    
    return { success: true };
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return { success: false, error };
  } finally {
    await prisma.$disconnect();
  }
}

testConnection()
  .then((result) => {
    if (!result.success) {
      process.exit(1);
    }
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  }); 