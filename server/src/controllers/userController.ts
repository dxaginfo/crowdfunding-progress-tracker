import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import pool from '../config/db';
import { ApiError } from '../utils/ApiError';

// Register new user
export const register = async (req: Request, res: Response) => {
  const { email, password, fullName, artistName } = req.body;

  try {
    // Check if user already exists
    const userExists = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      throw new ApiError(400, 'User with this email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const userId = uuidv4();
    const newUser = await pool.query(
      `INSERT INTO users 
      (id, email, password_hash, full_name, artist_name, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) 
      RETURNING id, email, full_name, artist_name, created_at`,
      [userId, email, hashedPassword, fullName, artistName]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.rows[0].id },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user: newUser.rows[0],
        token
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Register error:', error);
    throw new ApiError(500, 'Error registering user');
  }
};

// Login user
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      throw new ApiError(401, 'Invalid credentials');
    }

    const user = result.rows[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      throw new ApiError(401, 'Invalid credentials');
    }

    // Update last login time
    await pool.query(
      'UPDATE users SET last_login_at = NOW() WHERE id = $1',
      [user.id]
    );

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // Remove password from response
    delete user.password_hash;

    res.status(200).json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Login error:', error);
    throw new ApiError(500, 'Error logging in user');
  }
};

// Get user profile
export const getProfile = async (req: Request, res: Response) => {
  try {
    // req.user is set by the auth middleware
    const userId = (req as any).user.id;

    const result = await pool.query(
      `SELECT id, email, full_name, artist_name, profile_image_url, bio, created_at, updated_at, last_login_at 
      FROM users WHERE id = $1`,
      [userId]
    );

    if (result.rows.length === 0) {
      throw new ApiError(404, 'User not found');
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Get profile error:', error);
    throw new ApiError(500, 'Error fetching user profile');
  }
};

// Update user profile
export const updateProfile = async (req: Request, res: Response) => {
  const { fullName, artistName, bio } = req.body;
  const userId = (req as any).user.id;

  try {
    const updatedUser = await pool.query(
      `UPDATE users 
      SET full_name = $1, artist_name = $2, bio = $3, updated_at = NOW() 
      WHERE id = $4 
      RETURNING id, email, full_name, artist_name, profile_image_url, bio, created_at, updated_at, last_login_at`,
      [fullName, artistName, bio, userId]
    );

    if (updatedUser.rows.length === 0) {
      throw new ApiError(404, 'User not found');
    }

    res.status(200).json({
      success: true,
      data: updatedUser.rows[0]
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Update profile error:', error);
    throw new ApiError(500, 'Error updating user profile');
  }
};
