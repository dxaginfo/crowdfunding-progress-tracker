import { Server } from 'socket.io';

export const socketHandler = (io: Server) => {
  io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    // Join campaign room
    socket.on('joinCampaign', (campaignId: string) => {
      socket.join(`campaign:${campaignId}`);
      console.log(`Client ${socket.id} joined campaign room: ${campaignId}`);
    });

    // Leave campaign room
    socket.on('leaveCampaign', (campaignId: string) => {
      socket.leave(`campaign:${campaignId}`);
      console.log(`Client ${socket.id} left campaign room: ${campaignId}`);
    });

    // Handle campaign update event
    socket.on('campaignUpdated', (campaignId: string, data: any) => {
      socket.to(`campaign:${campaignId}`).emit('campaignUpdate', data);
    });

    // Handle new pledge event
    socket.on('newPledge', (campaignId: string, data: any) => {
      socket.to(`campaign:${campaignId}`).emit('pledgeReceived', data);
    });

    // Handle milestone reached event
    socket.on('milestoneReached', (campaignId: string, data: any) => {
      io.to(`campaign:${campaignId}`).emit('milestoneUpdate', data);
    });

    // Disconnect event
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });
};
