// config/database.js — MongoDB Atlas Cluster Connection
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Atlas cluster options
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,         // max 10 connections in the pool
      minPoolSize: 2,          // keep 2 connections open
      retryWrites: true,
    });

    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB disconnected. Attempting reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed (app termination)');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    console.error('Make sure your MONGODB_URI in .env is correct.');
    process.exit(1);
  }
};

module.exports = connectDB;
