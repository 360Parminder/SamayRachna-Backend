const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const connectDB = async () => {
  try {
    // Test the connection by running a simple query
    await prisma.$connect();
    console.log('Prisma connected to the database');
  } catch (error) {
    console.error('Error connecting to the database with Prisma:', error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = { prisma, connectDB };
