import { 
  Candidate, 
  RecruitmentStage, 
  CandidateStatus, 
  ClientFeedback,
  CandidateNote,
  CandidateChangeHistory,
  FieldChange,
  RECRUITMENT_STAGES,
  CANDIDATE_STATUSES 
} from '../types/recruitment';

// Utility functions for candidate data management
export const candidateUtils = {
  // Generate a unique candidate ID
  generateCandidateId: (): string => {
    return `cand_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Generate a CV number if not provided
  generateCVNumber: (existingCVNumbers: string[] = []): string => {
    let cvNo: string;
    let counter = 1;
    
    do {
      cvNo = String(counter);
      counter++;
    } while (existingCVNumbers.includes(cvNo));
    
    return cvNo;
  },

  // Determine current recruitment stage based on candidate data
  determineCurrentStage: (candidate: Partial<Candidate>): RecruitmentStage => {
    // Check stages in reverse order (most advanced first)
    if (candidate.closure?.joiningStatus === 'Yes') {
      return 'completed';
    }
    
    if (candidate.closure?.joiningDate || candidate.closure?.placedIn) {
      return 'closure';
    }
    
    if (candidate.selection?.selectionStatus === 'Selected') {
      return 'selection';
    }
    
    if (candidate.lineupFeedback?.feedbacks?.length && 
        candidate.lineupFeedback.lineupStatus === 'Done') {
      return 'lineup-feedback';
    }
    
    if (candidate.shortlisting?.shortlistStatus === 'Done') {
      return 'shortlisting';
    }
    
    if (candidate.resumeSharing?.resumeShareStatus === 'Done') {
      return 'resume-sharing';
    }
    
    return 'registration';
  },

  // Determine overall candidate status
  determineOverallStatus: (candidate: Partial<Candidate>): CandidateStatus => {
    const stage = candidateUtils.determineCurrentStage(candidate);
    
    // Check for rejection at any stage
    if (candidate.selection?.selectionStatus === 'Rejected' ||
        candidate.lineupFeedback?.feedbacks?.some(f => f.feedback === 'Rejected' || f.feedback === 'Reject')) {
      return 'rejected';
    }
    
    // Map stages to statuses
    switch (stage) {
      case 'completed':
        return 'placed';
      case 'closure':
        return 'selected';
      case 'selection':
        return 'selected';
      case 'lineup-feedback':
        return 'interviewed';
      case 'shortlisting':
        return 'shortlisted';
      case 'resume-sharing':
        return 'in-process';
      case 'registration':
      default:
        return 'new';
    }
  },

  // Create a new candidate with default values
  createNewCandidate: (data: Partial<Candidate>, createdBy: string, createdByName: string): Candidate => {
    const now = new Date();
    const candidateId = candidateUtils.generateCandidateId();
    
    const candidate: Candidate = {
      id: candidateId,
      cvNo: data.cvNo || candidateUtils.generateCVNumber(),
      
      // Core information
      name: data.name || '',
      phone: data.phone || '',
      email: data.email || '',
      location: data.location || '',
      interestedFor: data.interestedFor || '',
      declaration: data.declaration,
      currentCompany: data.currentCompany,
      industry: data.industry,
      designation: data.designation || '',
      totalExperience: data.totalExperience || '',
      lastSalary: data.lastSalary || '',
      salaryExpectation: data.salaryExpectation || '',
      qualification: data.qualification || '',
      allocation: data.allocation || '',
      
      // Registration details
      registration: {
        date: data.registration?.date || now,
        resource: data.registration?.resource || '',
        registrationStatus: data.registration?.registrationStatus || 'Yes',
        registrationAmount: data.registration?.registrationAmount
      },
      
      // Resume sharing
      resumeSharing: {
        date: data.resumeSharing?.date,
        shortlistsForClient: data.resumeSharing?.shortlistsForClient,
        resumeShareStatus: data.resumeSharing?.resumeShareStatus || 'Pending',
        remark: data.resumeSharing?.remark
      },
      
      // Shortlisting
      shortlisting: {
        shortlistDate: data.shortlisting?.shortlistDate,
        shortlistsForClient: data.shortlisting?.shortlistsForClient,
        resource: data.shortlisting?.resource,
        shortlistStatus: data.shortlisting?.shortlistStatus || 'Pending'
      },
      
      // Lineup & feedback
      lineupFeedback: {
        shortlistDate: data.lineupFeedback?.shortlistDate,
        shortlistsForClient: data.lineupFeedback?.shortlistsForClient,
        feedbacks: data.lineupFeedback?.feedbacks || [],
        lineupStatus: data.lineupFeedback?.lineupStatus || 'Pending'
      },
      
      // Selection
      selection: {
        client: data.selection?.client,
        selectionDate: data.selection?.selectionDate,
        selectionStatus: data.selection?.selectionStatus
      },
      
      // Closure
      closure: {
        joiningDate: data.closure?.joiningDate,
        placedIn: data.closure?.placedIn,
        offeredSalary: data.closure?.offeredSalary,
        charges: data.closure?.charges,
        joiningStatus: data.closure?.joiningStatus
      },
      
      // Additional fields
      avatar: data.avatar,
      rating: data.rating,
      tags: data.tags || [],
      notes: data.notes || [],
      
      // Visibility and ownership
      createdBy,
      createdByName,
      lastModifiedBy: createdBy,
      lastModifiedByName: createdByName,
      
      // Change history - start with creation entry
      changeHistory: [candidateUtils.createChangeHistoryEntry(
        candidateId,
        createdBy,
        createdByName,
        'created',
        [],
        'Candidate created'
      )],
      
      // Metadata
      createdAt: now,
      updatedAt: now,
      
      // Computed fields
      currentStage: 'registration',
      overallStatus: 'new'
    };
    
    // Update computed fields
    candidate.currentStage = candidateUtils.determineCurrentStage(candidate);
    candidate.overallStatus = candidateUtils.determineOverallStatus(candidate);
    
    return candidate;
  },

  // Update candidate stage and status
  updateCandidateStage: (candidate: Candidate, updates: Partial<Candidate>): Candidate => {
    const updatedCandidate = {
      ...candidate,
      ...updates,
      updatedAt: new Date()
    };
    
    // Recalculate stage and status
    updatedCandidate.currentStage = candidateUtils.determineCurrentStage(updatedCandidate);
    updatedCandidate.overallStatus = candidateUtils.determineOverallStatus(updatedCandidate);
    
    return updatedCandidate;
  },

  // Get stage configuration
  getStageConfig: (stage: RecruitmentStage) => {
    return RECRUITMENT_STAGES[stage];
  },

  // Get status configuration
  getStatusConfig: (status: CandidateStatus) => {
    return CANDIDATE_STATUSES[status];
  },

  // Get next possible stages
  getNextStages: (currentStage: RecruitmentStage): RecruitmentStage[] => {
    const stageOrder = Object.values(RECRUITMENT_STAGES).sort((a, b) => a.order - b.order);
    const currentIndex = stageOrder.findIndex(s => Object.keys(RECRUITMENT_STAGES).find(key => RECRUITMENT_STAGES[key as RecruitmentStage] === s) === currentStage);
    
    if (currentIndex === -1 || currentIndex === stageOrder.length - 1) {
      return [];
    }
    
    return stageOrder.slice(currentIndex + 1).map(s => 
      Object.keys(RECRUITMENT_STAGES).find(key => RECRUITMENT_STAGES[key as RecruitmentStage] === s) as RecruitmentStage
    );
  },

  // Validate candidate data
  validateCandidate: (candidate: Partial<Candidate>): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Required fields validation
    if (!candidate.name?.trim()) {
      errors.push('Name is required');
    }
    
    if (!candidate.phone?.trim()) {
      errors.push('Phone number is required');
    }
    
    if (!candidate.email?.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate.email)) {
      errors.push('Invalid email format');
    }
    
    if (!candidate.interestedFor?.trim()) {
      errors.push('Position of interest is required');
    }
    
    // Stage-specific validation
    const stage = candidate.currentStage || candidateUtils.determineCurrentStage(candidate);
    const stageConfig = RECRUITMENT_STAGES[stage];
    
    if (stageConfig) {
      stageConfig.requiredFields.forEach(field => {
        const fieldValue = candidateUtils.getNestedValue(candidate, field);
        if (!fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0)) {
          errors.push(`${field} is required for ${stageConfig.name} stage`);
        }
      });
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Get nested object value by dot notation
  getNestedValue: (obj: any, path: string): any => {
    return path.split('.').reduce((current, key) => {
      if (key.includes('[') && key.includes(']')) {
        const [arrayKey, indexStr] = key.split('[');
        const index = parseInt(indexStr.replace(']', ''));
        return current?.[arrayKey]?.[index];
      }
      return current?.[key];
    }, obj);
  },

  // Set nested object value by dot notation
  setNestedValue: (obj: any, path: string, value: any): void => {
    const keys = path.split('.');
    const lastKey = keys.pop()!;
    
    const target = keys.reduce((current, key) => {
      if (key.includes('[') && key.includes(']')) {
        const [arrayKey, indexStr] = key.split('[');
        const index = parseInt(indexStr.replace(']', ''));
        
        if (!current[arrayKey]) {
          current[arrayKey] = [];
        }
        
        if (!current[arrayKey][index]) {
          current[arrayKey][index] = {};
        }
        
        return current[arrayKey][index];
      }
      
      if (!current[key]) {
        current[key] = {};
      }
      
      return current[key];
    }, obj);
    
    if (lastKey.includes('[') && lastKey.includes(']')) {
      const [arrayKey, indexStr] = lastKey.split('[');
      const index = parseInt(indexStr.replace(']', ''));
      
      if (!target[arrayKey]) {
        target[arrayKey] = [];
      }
      
      target[arrayKey][index] = value;
    } else {
      target[lastKey] = value;
    }
  },

  // Format candidate for display
  formatCandidateForDisplay: (candidate: Candidate) => {
    const stageConfig = candidateUtils.getStageConfig(candidate.currentStage);
    const statusConfig = candidateUtils.getStatusConfig(candidate.overallStatus);
    
    return {
      ...candidate,
      displayName: candidate.name,
      displayPhone: candidateUtils.formatPhoneNumber(candidate.phone),
      displayStage: stageConfig.name,
      displayStatus: statusConfig.name,
      stageColor: stageConfig.color,
      statusColor: statusConfig.color,
      experienceYears: candidateUtils.parseExperience(candidate.totalExperience),
      salaryRange: `${candidate.lastSalary} → ${candidate.salaryExpectation}`,
      daysInCurrentStage: candidateUtils.calculateDaysInStage(candidate)
    };
  },

  // Format phone number for display
  formatPhoneNumber: (phone: string): string => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length === 10) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }
    
    return phone;
  },

  // Parse experience string to number
  parseExperience: (experience: string): number => {
    if (!experience) return 0;
    
    const match = experience.match(/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  },

  // Calculate days in current stage
  calculateDaysInStage: (candidate: Candidate): number => {
    const now = new Date();
    let stageStartDate = candidate.createdAt;
    
    // Determine when the current stage started
    switch (candidate.currentStage) {
      case 'resume-sharing':
        stageStartDate = candidate.resumeSharing.date || candidate.createdAt;
        break;
      case 'shortlisting':
        stageStartDate = candidate.shortlisting.shortlistDate || candidate.createdAt;
        break;
      case 'lineup-feedback':
        stageStartDate = candidate.lineupFeedback.shortlistDate || candidate.createdAt;
        break;
      case 'selection':
        stageStartDate = candidate.selection.selectionDate || candidate.createdAt;
        break;
      case 'closure':
        stageStartDate = candidate.closure.joiningDate || candidate.createdAt;
        break;
    }
    
    const diffTime = Math.abs(now.getTime() - stageStartDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  },

  // Create client feedback entry
  createClientFeedback: (
    feedbackNumber: number,
    clientName: string,
    feedback: ClientFeedback['feedback'],
    scheduledDate?: Date
  ): ClientFeedback => {
    return {
      feedbackNumber,
      clientName,
      feedback,
      scheduledDate,
      createdAt: new Date()
    };
  },

  // Get candidate progress percentage
  getCandidateProgress: (candidate: Candidate): number => {
    const stageConfig = candidateUtils.getStageConfig(candidate.currentStage);
    const totalStages = Object.keys(RECRUITMENT_STAGES).length;
    
    return Math.round((stageConfig.order / totalStages) * 100);
  },

  // Create change history entry
  createChangeHistoryEntry: (
    candidateId: string,
    changedBy: string,
    changedByName: string,
    changeType: CandidateChangeHistory['changeType'],
    changes: FieldChange[],
    reason?: string
  ): CandidateChangeHistory => {
    return {
      id: `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      candidateId,
      changedBy,
      changedByName,
      changeType,
      changes,
      timestamp: new Date(),
      reason
    };
  },

  // Track field changes between old and new candidate data
  trackFieldChanges: (oldCandidate: Candidate, newCandidate: Candidate): FieldChange[] => {
    const changes: FieldChange[] = [];
    
    // Define fields to track with their display names
    const fieldsToTrack = {
      'name': 'Name',
      'phone': 'Phone Number',
      'email': 'Email',
      'location': 'Location',
      'interestedFor': 'Position of Interest',
      'currentCompany': 'Current Company',
      'designation': 'Designation',
      'totalExperience': 'Total Experience',
      'lastSalary': 'Last Salary',
      'salaryExpectation': 'Salary Expectation',
      'qualification': 'Qualification',
      'allocation': 'Allocation',
      'currentStage': 'Current Stage',
      'overallStatus': 'Overall Status',
      'rating': 'Rating'
    };
    
    // Check each field for changes
    Object.entries(fieldsToTrack).forEach(([field, displayName]) => {
      const oldValue = candidateUtils.getNestedValue(oldCandidate, field);
      const newValue = candidateUtils.getNestedValue(newCandidate, field);
      
      if (oldValue !== newValue) {
        changes.push({
          field,
          fieldDisplayName: displayName,
          oldValue,
          newValue,
          changeDescription: `${displayName} changed from "${oldValue || 'empty'}" to "${newValue || 'empty'}"`
        });
      }
    });
    
    // Check nested objects for changes
    const nestedFields = {
      'registration.registrationStatus': 'Registration Status',
      'resumeSharing.resumeShareStatus': 'Resume Share Status',
      'shortlisting.shortlistStatus': 'Shortlist Status',
      'lineupFeedback.lineupStatus': 'Lineup Status',
      'selection.selectionStatus': 'Selection Status',
      'closure.joiningStatus': 'Joining Status'
    };
    
    Object.entries(nestedFields).forEach(([field, displayName]) => {
      const oldValue = candidateUtils.getNestedValue(oldCandidate, field);
      const newValue = candidateUtils.getNestedValue(newCandidate, field);
      
      if (oldValue !== newValue) {
        changes.push({
          field,
          fieldDisplayName: displayName,
          oldValue,
          newValue,
          changeDescription: `${displayName} changed from "${oldValue || 'empty'}" to "${newValue || 'empty'}"`
        });
      }
    });
    
    return changes;
  },

  // Update candidate with change tracking
  updateCandidateWithHistory: (
    candidate: Candidate, 
    updates: Partial<Candidate>, 
    updatedBy: string, 
    updatedByName: string,
    reason?: string
  ): Candidate => {
    const oldCandidate = { ...candidate };
    const updatedCandidate = candidateUtils.updateCandidateStage(candidate, updates);
    
    // Track changes
    const fieldChanges = candidateUtils.trackFieldChanges(oldCandidate, updatedCandidate);
    
    // Add change history entry if there are changes
    if (fieldChanges.length > 0) {
      const changeEntry = candidateUtils.createChangeHistoryEntry(
        candidate.id,
        updatedBy,
        updatedByName,
        'updated',
        fieldChanges,
        reason
      );
      
      updatedCandidate.changeHistory = [...candidate.changeHistory, changeEntry];
      updatedCandidate.lastModifiedBy = updatedBy;
      updatedCandidate.lastModifiedByName = updatedByName;
    }
    
    return updatedCandidate;
  },

  // Add note with change tracking
  addNoteWithHistory: (
    candidate: Candidate,
    noteContent: string,
    addedBy: string,
    addedByName: string,
    isPrivate: boolean = false
  ): Candidate => {
    const note: CandidateNote = {
      id: `note_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content: noteContent,
      createdBy: addedBy,
      createdAt: new Date(),
      isPrivate
    };
    
    const changeEntry = candidateUtils.createChangeHistoryEntry(
      candidate.id,
      addedBy,
      addedByName,
      'note_added',
      [{
        field: 'notes',
        fieldDisplayName: 'Notes',
        oldValue: null,
        newValue: noteContent,
        changeDescription: `Added ${isPrivate ? 'private' : 'public'} note: "${noteContent.substring(0, 50)}${noteContent.length > 50 ? '...' : ''}"`
      }],
      'Note added'
    );
    
    return {
      ...candidate,
      notes: [...(candidate.notes || []), note],
      changeHistory: [...candidate.changeHistory, changeEntry],
      lastModifiedBy: addedBy,
      lastModifiedByName: addedByName,
      updatedAt: new Date()
    };
  },

  // Get formatted change history for display
  getFormattedChangeHistory: (candidate: Candidate): Array<{
    id: string;
    timestamp: Date;
    changedBy: string;
    changedByName: string;
    changeType: string;
    description: string;
    changes: FieldChange[];
    reason?: string;
  }> => {
    return candidate.changeHistory
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .map(entry => ({
        id: entry.id,
        timestamp: entry.timestamp,
        changedBy: entry.changedBy,
        changedByName: entry.changedByName,
        changeType: candidateUtils.getChangeTypeDisplay(entry.changeType),
        description: candidateUtils.getChangeDescription(entry),
        changes: entry.changes,
        reason: entry.reason
      }));
  },

  // Get display text for change type
  getChangeTypeDisplay: (changeType: CandidateChangeHistory['changeType']): string => {
    const typeMap = {
      'created': 'Created',
      'updated': 'Updated',
      'status_changed': 'Status Changed',
      'stage_changed': 'Stage Changed',
      'note_added': 'Note Added',
      'document_uploaded': 'Document Uploaded',
      'interview_scheduled': 'Interview Scheduled',
      'merged': 'Merged',
      'imported': 'Imported'
    };
    
    return typeMap[changeType] || changeType;
  },

  // Get change description
  getChangeDescription: (entry: CandidateChangeHistory): string => {
    switch (entry.changeType) {
      case 'created':
        return `Candidate created by ${entry.changedByName}`;
      case 'updated':
        return `${entry.changes.length} field(s) updated by ${entry.changedByName}`;
      case 'status_changed':
        const statusChange = entry.changes.find(c => c.field === 'overallStatus');
        return statusChange ? 
          `Status changed from ${statusChange.oldValue} to ${statusChange.newValue} by ${entry.changedByName}` :
          `Status updated by ${entry.changedByName}`;
      case 'stage_changed':
        const stageChange = entry.changes.find(c => c.field === 'currentStage');
        return stageChange ? 
          `Stage changed from ${stageChange.oldValue} to ${stageChange.newValue} by ${entry.changedByName}` :
          `Stage updated by ${entry.changedByName}`;
      case 'note_added':
        return `Note added by ${entry.changedByName}`;
      case 'document_uploaded':
        return `Document uploaded by ${entry.changedByName}`;
      case 'interview_scheduled':
        return `Interview scheduled by ${entry.changedByName}`;
      case 'merged':
        return `Candidate merged by ${entry.changedByName}`;
      case 'imported':
        return `Candidate imported by ${entry.changedByName}`;
      default:
        return `Action performed by ${entry.changedByName}`;
    }
  }
};