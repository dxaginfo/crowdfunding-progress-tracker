require('dotenv').config();
const { Pool } = require('pg');

async function migrate() {
  const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  try {
    await pool.connect();
    console.log('Connected to database for migrations');

    console.log('Starting migrations...');

    // Create users table
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        artist_name VARCHAR(255),
        profile_image_url VARCHAR(500),
        bio TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        last_login_at TIMESTAMP
      );
    `);
    console.log('Users table created');

    // Create campaigns table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id UUID PRIMARY KEY,
        user_id UUID REFERENCES users(id),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        funding_goal DECIMAL(12,2) NOT NULL,
        current_amount DECIMAL(12,2) DEFAULT 0,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        status VARCHAR(50) DEFAULT 'draft',
        banner_image_url VARCHAR(500),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Campaigns table created');

    // Create milestones table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS milestones (
        id UUID PRIMARY KEY,
        campaign_id UUID REFERENCES campaigns(id),
        title VARCHAR(255) NOT NULL,
        description TEXT,
        target_amount DECIMAL(12,2) NOT NULL,
        reached_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Milestones table created');

    // Create reward_tiers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reward_tiers (
        id UUID PRIMARY KEY,
        campaign_id UUID REFERENCES campaigns(id),
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        minimum_amount DECIMAL(12,2) NOT NULL,
        estimated_delivery_date TIMESTAMP,
        max_claims INTEGER,
        current_claims INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Reward tiers table created');

    // Create pledges table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pledges (
        id UUID PRIMARY KEY,
        campaign_id UUID REFERENCES campaigns(id),
        user_id UUID REFERENCES users(id),
        reward_tier_id UUID REFERENCES reward_tiers(id) NULL,
        amount DECIMAL(12,2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        transaction_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Pledges table created');

    // Create updates table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS updates (
        id UUID PRIMARY KEY,
        campaign_id UUID REFERENCES campaigns(id),
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Updates table created');

    // Create comments table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id UUID PRIMARY KEY,
        campaign_id UUID REFERENCES campaigns(id),
        user_id UUID REFERENCES users(id),
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Comments table created');

    console.log('All migrations completed successfully');
  } catch (error) {
    console.error('Migration error:', error);
  } finally {
    await pool.end();
  }
}

migrate();
