import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface Milestone {
  id: string;
  campaignId: string;
  title: string;
  description?: string;
  targetAmount: number;
  reachedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RewardTier {
  id: string;
  campaignId: string;
  title: string;
  description: string;
  minimumAmount: number;
  estimatedDeliveryDate?: string;
  maxClaims?: number;
  currentClaims: number;
  createdAt: string;
  updatedAt: string;
}

export interface Update {
  id: string;
  campaignId: string;
  title: string;
  content: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Campaign {
  id: string;
  userId: string;
  title: string;
  description: string;
  fundingGoal: number;
  currentAmount: number;
  startDate: string;
  endDate: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  bannerImageUrl?: string;
  createdAt: string;
  updatedAt: string;
  milestones?: Milestone[];
  rewardTiers?: RewardTier[];
  updates?: Update[];
}

interface CampaignState {
  campaigns: Campaign[];
  currentCampaign: Campaign | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: CampaignState = {
  campaigns: [],
  currentCampaign: null,
  isLoading: false,
  error: null,
};

// Get user campaigns
export const getUserCampaigns = createAsyncThunk(
  'campaigns/getUserCampaigns',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/campaigns/user');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch campaigns');
    }
  }
);

// Get campaign by ID
export const getCampaign = createAsyncThunk(
  'campaigns/getCampaign',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/campaigns/${id}`);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to fetch campaign');
    }
  }
);

// Create campaign
export const createCampaign = createAsyncThunk(
  'campaigns/createCampaign',
  async (campaignData: {
    title: string;
    description: string;
    fundingGoal: number;
    startDate: string;
    endDate: string;
    bannerImageUrl?: string;
  }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/campaigns', campaignData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to create campaign');
    }
  }
);

// Update campaign
export const updateCampaign = createAsyncThunk(
  'campaigns/updateCampaign',
  async ({ id, campaignData }: {
    id: string;
    campaignData: {
      title: string;
      description: string;
      fundingGoal: number;
      startDate: string;
      endDate: string;
      status: 'draft' | 'active' | 'completed' | 'cancelled';
      bannerImageUrl?: string;
    };
  }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/campaigns/${id}`, campaignData);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to update campaign');
    }
  }
);

// Delete campaign
export const deleteCampaign = createAsyncThunk(
  'campaigns/deleteCampaign',
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/campaigns/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Failed to delete campaign');
    }
  }
);

const campaignSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    clearCurrentCampaign: (state) => {
      state.currentCampaign = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get User Campaigns
      .addCase(getUserCampaigns.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserCampaigns.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaigns = action.payload;
        state.error = null;
      })
      .addCase(getUserCampaigns.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Get Campaign
      .addCase(getCampaign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentCampaign = action.payload;
        state.error = null;
      })
      .addCase(getCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Create Campaign
      .addCase(createCampaign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaigns.push(action.payload);
        state.currentCampaign = action.payload;
        state.error = null;
      })
      .addCase(createCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Update Campaign
      .addCase(updateCampaign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaigns = state.campaigns.map(campaign =>
          campaign.id === action.payload.id ? action.payload : campaign
        );
        state.currentCampaign = action.payload;
        state.error = null;
      })
      .addCase(updateCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Delete Campaign
      .addCase(deleteCampaign.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCampaign.fulfilled, (state, action) => {
        state.isLoading = false;
        state.campaigns = state.campaigns.filter(
          campaign => campaign.id !== action.payload
        );
        if (state.currentCampaign && state.currentCampaign.id === action.payload) {
          state.currentCampaign = null;
        }
        state.error = null;
      })
      .addCase(deleteCampaign.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentCampaign } = campaignSlice.actions;
export default campaignSlice.reducer;
