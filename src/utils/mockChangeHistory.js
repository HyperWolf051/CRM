/**
 * Mock Change History Data Generator
 * Generates realistic change history data for testing and demonstration
 */

export const generateMockChangeHistory = (candidateId, count = 20) => {
  const changeTypes = [
    'created',
    'updated',
    'status_changed',
    'stage_changed',
    'note_added',
    'document_uploaded',
    'interview_scheduled',
    'data_accessed'
  ];

  const users = [
    { id: 'user1', name: 'Sarah Johnson' },
    { id: 'user2', name: 'Mike Rodriguez' },
    { id: 'user3', name: 'Lisa Chen' },
    { id: 'user4', name: 'David Kumar' }
  ];

  const fieldChanges = [
    {
      field: 'overallStatus',
      fieldDisplayName: 'Overall Status',
      oldValue: 'new',
      newValue: 'in-process',
      changeDescription: 'Overall Status changed from "new" to "in-process"',
      isSensitive: false
    },
    {
      field: 'currentStage',
      fieldDisplayName: 'Current Stage',
      oldValue: 'registration',
      newValue: 'resume-sharing',
      changeDescription: 'Current Stage changed from "registration" to "resume-sharing"',
      isSensitive: false
    },
    {
      field: 'email',
      fieldDisplayName: 'Email Address',
      oldValue: 'jo***@email.com',
      newValue: 'jo***@gmail.com',
      changeDescription: 'Email Address changed',
      isSensitive: true
    },
    {
      field: 'phone',
      fieldDisplayName: 'Phone Number',
      oldValue: '***1234',
      newValue: '***5678',
      changeDescription: 'Phone Number changed',
      isSensitive: true
    },
    {
      field: 'salaryExpectation',
      fieldDisplayName: 'Salary Expectation',
      oldValue: '80K',
      newValue: '90K',
      changeDescription: 'Salary Expectation changed from "80K" to "90K"',
      isSensitive: true
    },
    {
      field: 'location',
      fieldDisplayName: 'Location',
      oldValue: 'New York, NY',
      newValue: 'San Francisco, CA',
      changeDescription: 'Location changed from "New York, NY" to "San Francisco, CA"',
      isSensitive: false
    },
    {
      field: 'designation',
      fieldDisplayName: 'Current Designation',
      oldValue: 'Software Engineer',
      newValue: 'Senior Software Engineer',
      changeDescription: 'Current Designation changed from "Software Engineer" to "Senior Software Engineer"',
      isSensitive: false
    }
  ];

  const reasons = [
    'Updated based on candidate interview feedback',
    'Corrected information from resume verification',
    'Candidate requested update',
    'Moved to next stage in recruitment process',
    'Updated after client feedback',
    'Routine data maintenance',
    'Compliance review update',
    ''
  ];

  const history = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const changeType = changeTypes[Math.floor(Math.random() * changeTypes.length)];
    const timestamp = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000) - Math.random() * 24 * 60 * 60 * 1000);
    
    let changes = [];
    if (changeType === 'updated' || changeType === 'status_changed' || changeType === 'stage_changed') {
      const numChanges = Math.floor(Math.random() * 3) + 1;
      changes = Array.from({ length: numChanges }, () => 
        fieldChanges[Math.floor(Math.random() * fieldChanges.length)]
      );
    }

    history.push({
      id: `change_${timestamp.getTime()}_${Math.random().toString(36).substr(2, 9)}`,
      candidateId,
      changedBy: user.id,
      changedByName: user.name,
      changeType,
      changes,
      timestamp: timestamp.toISOString(),
      reason: reasons[Math.floor(Math.random() * reasons.length)],
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      sessionId: `session_${timestamp.getTime()}_${Math.random().toString(36).substr(2, 9)}`
    });
  }

  return history.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const generateMockCandidate = (id = 'candidate-1') => {
  return {
    id,
    cvNo: 'CV-2024-001',
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1234567890',
    location: 'San Francisco, CA',
    interestedFor: 'Senior Software Engineer',
    designation: 'Software Engineer',
    currentCompany: 'Tech Corp',
    industry: 'Technology',
    totalExperience: '5 years',
    lastSalary: '80K',
    salaryExpectation: '100K',
    qualification: 'Bachelor in Computer Science',
    allocation: 'Sheet-1',
    currentStage: 'shortlisting',
    overallStatus: 'in-process',
    createdBy: 'user1',
    createdByName: 'Sarah Johnson',
    lastModifiedBy: 'user2',
    lastModifiedByName: 'Mike Rodriguez',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date().toISOString(),
    changeHistory: generateMockChangeHistory(id, 25),
    registration: {
      date: new Date('2024-01-15'),
      resource: 'LinkedIn',
      registrationStatus: 'Yes',
      registrationAmount: 500
    },
    resumeSharing: {
      shortlistsForClient: 'TechCorp Inc',
      resumeShareStatus: 'Done',
      remark: 'Strong technical background'
    },
    shortlisting: {
      shortlistDate: new Date('2024-01-20'),
      shortlistsForClient: 'TechCorp Inc',
      resource: 'LinkedIn',
      shortlistStatus: 'Done'
    },
    lineupFeedback: {
      shortlistDate: new Date('2024-01-20'),
      clientName: 'TechCorp Inc',
      feedbacks: [
        {
          feedbackNumber: 1,
          clientName: 'TechCorp Inc',
          feedback: 'Selected',
          scheduledDate: new Date('2024-01-25')
        }
      ],
      scheduledDates: [new Date('2024-01-25')],
      lineupStatus: 'Done'
    },
    selection: {
      client: 'TechCorp Inc',
      selectionDate: new Date('2024-02-01'),
      selectionStatus: 'Selected'
    },
    closure: {
      joiningDate: null,
      placedIn: null,
      offeredSalary: null,
      charges: null,
      joiningStatus: null
    },
    notes: [],
    documents: []
  };
};

export default {
  generateMockChangeHistory,
  generateMockCandidate
};
