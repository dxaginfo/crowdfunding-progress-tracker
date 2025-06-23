import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

import pool from '../config/db';
import { ApiError } from '../utils/ApiError';
import redisClient from '../config/redis';

// Create a new campaign
export const createCampaign = async (req: Request, res: Response) => {
  const { title, description, fundingGoal, startDate, endDate, bannerImageUrl } = req.body;
  const userId = (req as any).user.id;

  try {
    const campaignId = uuidv4();
    const newCampaign = await pool.query(
      `INSERT INTO campaigns 
      (id, user_id, title, description, funding_goal, start_date, end_date, status, banner_image_url, created_at, updated_at) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'draft', $8, NOW(), NOW()) 
      RETURNING *`,
      [campaignId, userId, title, description, fundingGoal, startDate, endDate, bannerImageUrl]
    );

    res.status(201).json({
      success: true,
      data: newCampaign.rows[0]
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    throw new ApiError(500, 'Error creating campaign');
  }
};

// Get all campaigns for a user
export const getUserCampaigns = async (req: Request, res: Response) => {
  const userId = (req as any).user.id;

  try {
    const campaigns = await pool.query(
      `SELECT * FROM campaigns WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    res.status(200).json({
      success: true,
      data: campaigns.rows
    });
  } catch (error) {
    console.error('Get user campaigns error:', error);
    throw new ApiError(500, 'Error fetching user campaigns');
  }
};

// Get a single campaign by ID
export const getCampaign = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Check cache first
    const cachedCampaign = await redisClient.get(`campaign:${id}`);
    
    if (cachedCampaign) {
      return res.status(200).json({
        success: true,
        data: JSON.parse(cachedCampaign),
        source: 'cache'
      });
    }

    // If not in cache, fetch from database
    const campaign = await pool.query(
      `SELECT * FROM campaigns WHERE id = $1`,
      [id]
    );

    if (campaign.rows.length === 0) {
      throw new ApiError(404, 'Campaign not found');
    }

    // Get milestones
    const milestones = await pool.query(
      `SELECT * FROM milestones WHERE campaign_id = $1 ORDER BY target_amount ASC`,
      [id]
    );

    // Get reward tiers
    const rewardTiers = await pool.query(
      `SELECT * FROM reward_tiers WHERE campaign_id = $1 ORDER BY minimum_amount ASC`,
      [id]
    );

    // Get campaign updates
    const updates = await pool.query(
      `SELECT * FROM updates WHERE campaign_id = $1 ORDER BY published_at DESC`,
      [id]
    );

    // Combine data
    const campaignData = {
      ...campaign.rows[0],
      milestones: milestones.rows,
      rewardTiers: rewardTiers.rows,
      updates: updates.rows
    };

    // Cache the result
    await redisClient.set(`campaign:${id}`, JSON.stringify(campaignData), { EX: 3600 }); // Cache for 1 hour

    res.status(200).json({
      success: true,
      data: campaignData,
      source: 'database'
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Get campaign error:', error);
    throw new ApiError(500, 'Error fetching campaign');
  }
};

// Update a campaign
export const updateCampaign = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, fundingGoal, startDate, endDate, status, bannerImageUrl } = req.body;
  const userId = (req as any).user.id;

  try {
    // Check if campaign exists and belongs to user
    const campaignCheck = await pool.query(
      `SELECT * FROM campaigns WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (campaignCheck.rows.length === 0) {
      throw new ApiError(404, 'Campaign not found or unauthorized');
    }

    // Update campaign
    const updatedCampaign = await pool.query(
      `UPDATE campaigns 
      SET title = $1, description = $2, funding_goal = $3, start_date = $4, end_date = $5, status = $6, banner_image_url = $7, updated_at = NOW() 
      WHERE id = $8 
      RETURNING *`,
      [title, description, fundingGoal, startDate, endDate, status, bannerImageUrl, id]
    );

    // Invalidate cache
    await redisClient.del(`campaign:${id}`);

    res.status(200).json({
      success: true,
      data: updatedCampaign.rows[0]
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Update campaign error:', error);
    throw new ApiError(500, 'Error updating campaign');
  }
};

// Delete a campaign
export const deleteCampaign = async (req: Request, res: Response) => {
  const { id } = req.params;
  const userId = (req as any).user.id;

  try {
    // Check if campaign exists and belongs to user
    const campaignCheck = await pool.query(
      `SELECT * FROM campaigns WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );

    if (campaignCheck.rows.length === 0) {
      throw new ApiError(404, 'Campaign not found or unauthorized');
    }

    // Delete campaign
    await pool.query(`DELETE FROM campaigns WHERE id = $1`, [id]);

    // Invalidate cache
    await redisClient.del(`campaign:${id}`);

    res.status(200).json({
      success: true,
      message: 'Campaign deleted successfully'
    });
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    console.error('Delete campaign error:', error);
    throw new ApiError(500, 'Error deleting campaign');
  }
};
