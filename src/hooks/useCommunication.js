import { useState, useEffect, useCallback } from 'react';
import communicationService from '../services/communicationService';

export const useCommunication = () => {
  const [emailSequences, setEmailSequences] = useState([]);
  const [comments, setComments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [clientInteractions, setClientInteractions] = useState([]);
  const [socialMediaIntegrations, setSocialMediaIntegrations] = useState([]);
  const [videoConferenceIntegrations, setVideoConferenceIntegrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Email Sequences
  const fetchEmailSequences = useCallback(async () => {
    try {
      setLoading(true);
      const sequences = await communicationService.getEmailSequences();
      setEmailSequences(sequences);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createEmailSequence = useCallback(async (sequenceData) => {
    try {
      setLoading(true);
      const newSequence = await communicationService.createEmailSequence(sequenceData);
      setEmailSequences(prev => [...prev, newSequence]);
      return newSequence;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateEmailSequence = useCallback(async (id, sequenceData) => {
    try {
      setLoading(true);
      const updatedSequence = await communicationService.updateEmailSequence(id, sequenceData);
      setEmailSequences(prev => prev.map(seq => seq.id === id ? updatedSequence : seq));
      return updatedSequence;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteEmailSequence = useCallback(async (id) => {
    try {
      setLoading(true);
      await communicationService.deleteEmailSequence(id);
      setEmailSequences(prev => prev.filter(seq => seq.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Team Collaboration
  const fetchComments = useCallback(async (entityType, entityId) => {
    try {
      setLoading(true);
      const comments = await communicationService.getComments(entityType, entityId);
      setComments(comments);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addComment = useCallback(async (commentData) => {
    try {
      const newComment = await communicationService.addComment(commentData);
      setComments(prev => [...prev, newComment]);
      return newComment;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const fetchTasks = useCallback(async (assignedTo) => {
    try {
      setLoading(true);
      const tasks = await communicationService.getTasks(assignedTo);
      setTasks(tasks);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = useCallback(async (taskData) => {
    try {
      const newTask = await communicationService.createTask(taskData);
      setTasks(prev => [...prev, newTask]);
      return newTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id, taskData) => {
    try {
      const updatedTask = await communicationService.updateTask(id, taskData);
      setTasks(prev => prev.map(task => task.id === id ? updatedTask : task));
      return updatedTask;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Client Relationship Management
  const fetchClientInteractions = useCallback(async (clientId) => {
    try {
      setLoading(true);
      const interactions = await communicationService.getClientInteractions(clientId);
      setClientInteractions(interactions);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addClientInteraction = useCallback(async (interactionData) => {
    try {
      const newInteraction = await communicationService.addClientInteraction(interactionData);
      setClientInteractions(prev => [...prev, newInteraction]);
      return newInteraction;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  // Social Media Integration
  const fetchSocialMediaIntegrations = useCallback(async () => {
    try {
      setLoading(true);
      const integrations = await communicationService.getSocialMediaIntegrations();
      setSocialMediaIntegrations(integrations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const connectSocialMedia = useCallback(async (platform, authCode) => {
    try {
      setLoading(true);
      const result = await communicationService.connectSocialMedia(platform, authCode);
      setSocialMediaIntegrations(prev => 
        prev.map(integration => 
          integration.platform === platform 
            ? { ...integration, isConnected: true }
            : integration
        )
      );
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const postToSocialMedia = useCallback(async (postData) => {
    try {
      setLoading(true);
      const result = await communicationService.postToSocialMedia(postData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Video Conferencing Integration
  const fetchVideoConferenceIntegrations = useCallback(async () => {
    try {
      setLoading(true);
      const integrations = await communicationService.getVideoConferenceIntegrations();
      setVideoConferenceIntegrations(integrations);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const connectVideoConference = useCallback(async (provider, credentials) => {
    try {
      setLoading(true);
      const result = await communicationService.connectVideoConference(provider, credentials);
      setVideoConferenceIntegrations(prev => 
        prev.map(integration => 
          integration.provider === provider 
            ? { ...integration, isConnected: true }
            : integration
        )
      );
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createMeeting = useCallback(async (meetingData) => {
    try {
      setLoading(true);
      const meeting = await communicationService.createMeeting(meetingData);
      return meeting;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Communication Preferences
  const getCommunicationPreferences = useCallback(async (candidateId) => {
    try {
      const preferences = await communicationService.getCommunicationPreferences(candidateId);
      return preferences;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const updateCommunicationPreferences = useCallback(async (candidateId, preferences) => {
    try {
      const updatedPreferences = await communicationService.updateCommunicationPreferences(candidateId, preferences);
      return updatedPreferences;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  return {
    // State
    emailSequences,
    comments,
    tasks,
    clientInteractions,
    socialMediaIntegrations,
    videoConferenceIntegrations,
    loading,
    error,

    // Email Sequences
    fetchEmailSequences,
    createEmailSequence,
    updateEmailSequence,
    deleteEmailSequence,

    // Team Collaboration
    fetchComments,
    addComment,
    fetchTasks,
    createTask,
    updateTask,

    // Client Relationship Management
    fetchClientInteractions,
    addClientInteraction,

    // Social Media Integration
    fetchSocialMediaIntegrations,
    connectSocialMedia,
    postToSocialMedia,

    // Video Conferencing Integration
    fetchVideoConferenceIntegrations,
    connectVideoConference,
    createMeeting,

    // Communication Preferences
    getCommunicationPreferences,
    updateCommunicationPreferences,

    // Utility
    clearError: () => setError(null)
  };
};