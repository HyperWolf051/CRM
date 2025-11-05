// Workflow Automation Service

class WorkflowAutomationService {
  constructor() {
    this.workflows = new Map();
    this.executions = new Map();
    this.leadScores = new Map();
    this.territories = new Map();
    this.scoringRules = new Map();
    this.emailSequences = new Map();
    this.webhooks = new Map();
    
    // Initialize with mock data
    this.initializeMockData();
  }

  // Workflow Management
  async createWorkflow(workflowData) {
    const workflow = {
      id: `workflow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...workflowData,
      createdAt: new Date(),
      lastModified: new Date(),
      executionCount: 0,
      successRate: 0
    };
    
    this.workflows.set(workflow.id, workflow);
    return workflow;
  }

  async updateWorkflow(workflowId, updates) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error('Workflow not found');
    
    const updatedWorkflow = {
      ...workflow,
      ...updates,
      lastModified: new Date()
    };
    
    this.workflows.set(workflowId, updatedWorkflow);
    return updatedWorkflow;
  }

  async deleteWorkflow(workflowId) {
    return this.workflows.delete(workflowId);
  }

  async getWorkflow(workflowId) {
    return this.workflows.get(workflowId);
  }

  async getAllWorkflows() {
    return Array.from(this.workflows.values());
  }

  async getActiveWorkflows() {
    return Array.from(this.workflows.values()).filter(w => w.isActive);
  }

  // Workflow Execution
  async executeWorkflow(workflowId, candidateId, context = {}) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow || !workflow.isActive) {
      throw new Error('Workflow not found or inactive');
    }

    const execution = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      workflowId,
      candidateId,
      status: 'running',
      startedAt: new Date(),
      executedActions: [],
      context
    };

    this.executions.set(execution.id, execution);

    try {
      // Check conditions
      const conditionsPassed = await this.evaluateConditions(workflow.conditions, candidateId, context);
      
      if (!conditionsPassed) {
        execution.status = 'completed';
        execution.completedAt = new Date();
        return execution;
      }

      // Execute actions
      for (const action of workflow.actions) {
        const actionResult = await this.executeAction(action, candidateId, context);
        execution.executedActions.push(actionResult);
        
        if (actionResult.status === 'failed') {
          execution.status = 'failed';
          execution.error = actionResult.error;
          break;
        }
      }

      if (execution.status === 'running') {
        execution.status = 'completed';
      }
      
      execution.completedAt = new Date();
      
      // Update workflow statistics
      workflow.executionCount++;
      workflow.lastExecuted = new Date();
      if (execution.status === 'completed') {
        workflow.successRate = ((workflow.successRate * (workflow.executionCount - 1)) + 100) / workflow.executionCount;
      } else {
        workflow.successRate = (workflow.successRate * (workflow.executionCount - 1)) / workflow.executionCount;
      }

    } catch (error) {
      execution.status = 'failed';
      execution.error = error.message;
      execution.completedAt = new Date();
    }

    return execution;
  }

  async evaluateConditions(conditions, candidateId, context) {
    if (!conditions || conditions.length === 0) return true;

    // Mock condition evaluation - in real implementation, this would evaluate against candidate data
    for (const condition of conditions) {
      const result = await this.evaluateCondition(condition, candidateId, context);
      if (!result && condition.logicalOperator !== 'OR') {
        return false;
      }
    }
    return true;
  }

  async evaluateCondition(condition, candidateId, context) {
    // Mock condition evaluation
    switch (condition.type) {
      case 'score-greater-than':
        const score = this.leadScores.get(candidateId);
        return score && score.totalScore > condition.value;
      case 'field-equals':
        return context[condition.field] === condition.value;
      default:
        return true;
    }
  }

  async executeAction(action, candidateId, context) {
    const executedAction = {
      actionId: action.id,
      actionType: action.type,
      status: 'pending',
      executedAt: new Date()
    };

    try {
      switch (action.type) {
        case 'send-email':
          await this.sendEmail(action.parameters, candidateId);
          break;
        case 'update-status':
          await this.updateCandidateStatus(candidateId, action.parameters.status);
          break;
        case 'assign-recruiter':
          await this.assignRecruiter(candidateId, action.parameters.recruiterId);
          break;
        case 'create-task':
          await this.createTask(action.parameters, candidateId);
          break;
        case 'calculate-score':
          await this.calculateLeadScore(candidateId);
          break;
        case 'assign-territory':
          await this.assignTerritory(candidateId);
          break;
        case 'webhook':
          await this.callWebhook(action.parameters, candidateId, context);
          break;
        default:
          throw new Error(`Unknown action type: ${action.type}`);
      }
      
      executedAction.status = 'completed';
    } catch (error) {
      executedAction.status = 'failed';
      executedAction.error = error.message;
    }

    return executedAction;
  }

  // Lead Scoring
  async calculateLeadScore(candidateId, candidateData = null) {
    const rules = Array.from(this.scoringRules.values()).filter(r => r.isActive);
    let totalScore = 0;
    const breakdown = [];

    // Mock candidate data if not provided
    const candidate = candidateData || {
      skills: ['React', 'JavaScript', 'Node.js'],
      experience: 5,
      location: 'San Francisco',
      education: 'Bachelor',
      availability: 'immediate'
    };

    for (const rule of rules) {
      let ruleScore = 0;
      let reasoning = '';

      switch (rule.category) {
        case 'skills':
          const skillMatches = candidate.skills?.filter(skill => 
            rule.condition.toLowerCase().includes(skill.toLowerCase())
          ).length || 0;
          ruleScore = skillMatches > 0 ? rule.points : 0;
          reasoning = `${skillMatches} matching skills found`;
          break;
        
        case 'experience':
          const expYears = candidate.experience || 0;
          if (rule.condition.includes('>=') && expYears >= parseInt(rule.condition.split('>=')[1])) {
            ruleScore = rule.points;
            reasoning = `${expYears} years experience meets requirement`;
          }
          break;
        
        case 'location':
          if (candidate.location && rule.condition.includes(candidate.location)) {
            ruleScore = rule.points;
            reasoning = `Located in preferred area: ${candidate.location}`;
          }
          break;
        
        case 'availability':
          if (candidate.availability === 'immediate' && rule.condition.includes('immediate')) {
            ruleScore = rule.points;
            reasoning = 'Available immediately';
          }
          break;
        
        default:
          ruleScore = Math.random() > 0.5 ? rule.points : 0;
          reasoning = 'Custom rule evaluation';
      }

      if (ruleScore > 0) {
        breakdown.push({
          category: rule.category,
          score: ruleScore,
          maxScore: rule.points,
          reasoning,
          weight: rule.weight
        });
        totalScore += ruleScore * rule.weight;
      }
    }

    // Add AI predictions
    const aiPredictions = await this.generateAIPredictions(candidate);

    const leadScore = {
      candidateId,
      totalScore: Math.min(totalScore, 100),
      breakdown,
      lastCalculated: new Date(),
      trend: this.calculateTrend(candidateId, totalScore),
      aiPredictions
    };

    this.leadScores.set(candidateId, leadScore);
    return leadScore;
  }

  async generateAIPredictions(candidate) {
    // Mock AI predictions
    return [
      {
        type: 'placement-success',
        probability: Math.floor(Math.random() * 40) + 60, // 60-100%
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100%
        factors: ['Strong technical skills', 'Good cultural fit', 'Market demand'],
        reasoning: 'High probability based on skill match and market conditions'
      },
      {
        type: 'time-to-hire',
        probability: Math.floor(Math.random() * 20) + 15, // 15-35 days
        confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
        factors: ['Experience level', 'Interview availability', 'Decision speed'],
        reasoning: 'Estimated based on similar candidate profiles'
      }
    ];
  }

  calculateTrend(candidateId, currentScore) {
    const previousScore = this.leadScores.get(candidateId)?.totalScore || 0;
    if (currentScore > previousScore) return 'increasing';
    if (currentScore < previousScore) return 'decreasing';
    return 'stable';
  }

  // Territory Management
  async createTerritory(territoryData) {
    const territory = {
      id: `territory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...territoryData,
      performance: {
        totalCandidates: 0,
        placedCandidates: 0,
        averageTimeToHire: 0,
        conversionRate: 0,
        revenue: 0,
        lastUpdated: new Date()
      },
      createdAt: new Date()
    };
    
    this.territories.set(territory.id, territory);
    return territory;
  }

  async assignTerritory(candidateId, candidateData = null) {
    const territories = Array.from(this.territories.values()).filter(t => t.isActive);
    const candidate = candidateData || { location: 'San Francisco', skills: ['React'] };

    for (const territory of territories) {
      if (await this.matchesTerritoryCriteria(candidate, territory.criteria)) {
        // Assign to least loaded recruiter in territory
        const recruiterId = territory.assignedRecruiters[0]; // Simplified assignment
        await this.assignRecruiter(candidateId, recruiterId);
        return territory.id;
      }
    }

    return null;
  }

  async matchesTerritoryCriteria(candidate, criteria) {
    if (criteria.locations && !criteria.locations.includes(candidate.location)) {
      return false;
    }
    
    if (criteria.skills && !criteria.skills.some(skill => 
      candidate.skills?.includes(skill)
    )) {
      return false;
    }

    return true;
  }

  // Scoring Rules Management
  async createScoringRule(ruleData) {
    const rule = {
      id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...ruleData,
      createdAt: new Date()
    };
    
    this.scoringRules.set(rule.id, rule);
    return rule;
  }

  async updateScoringRule(ruleId, updates) {
    const rule = this.scoringRules.get(ruleId);
    if (!rule) throw new Error('Scoring rule not found');
    
    const updatedRule = { ...rule, ...updates };
    this.scoringRules.set(ruleId, updatedRule);
    return updatedRule;
  }

  async getAllScoringRules() {
    return Array.from(this.scoringRules.values());
  }

  // Analytics
  async getWorkflowAnalytics(workflowId) {
    const executions = Array.from(this.executions.values())
      .filter(e => e.workflowId === workflowId);

    const totalExecutions = executions.length;
    const successfulExecutions = executions.filter(e => e.status === 'completed').length;
    const failedExecutions = executions.filter(e => e.status === 'failed').length;

    return {
      workflowId,
      totalExecutions,
      successfulExecutions,
      failedExecutions,
      averageExecutionTime: this.calculateAverageExecutionTime(executions),
      executionsByDay: this.getExecutionsByDay(executions),
      actionPerformance: this.getActionPerformance(executions),
      lastUpdated: new Date()
    };
  }

  calculateAverageExecutionTime(executions) {
    const completedExecutions = executions.filter(e => e.completedAt);
    if (completedExecutions.length === 0) return 0;

    const totalTime = completedExecutions.reduce((sum, exec) => {
      return sum + (exec.completedAt.getTime() - exec.startedAt.getTime());
    }, 0);

    return totalTime / completedExecutions.length;
  }

  getExecutionsByDay(executions) {
    const executionsByDay = {};
    executions.forEach(exec => {
      const day = exec.startedAt.toISOString().split('T')[0];
      executionsByDay[day] = (executionsByDay[day] || 0) + 1;
    });

    return Object.entries(executionsByDay).map(([date, count]) => ({ date, count }));
  }

  getActionPerformance(executions) {
    const actionStats = {};
    
    executions.forEach(exec => {
      exec.executedActions.forEach(action => {
        if (!actionStats[action.actionType]) {
          actionStats[action.actionType] = {
            actionType: action.actionType,
            totalExecutions: 0,
            successfulExecutions: 0,
            totalTime: 0
          };
        }
        
        const stats = actionStats[action.actionType];
        stats.totalExecutions++;
        if (action.status === 'completed') {
          stats.successfulExecutions++;
        }
        if (action.duration) {
          stats.totalTime += action.duration;
        }
      });
    });

    return Object.values(actionStats).map(stats => ({
      actionType: stats.actionType,
      totalExecutions: stats.totalExecutions,
      successRate: (stats.successfulExecutions / stats.totalExecutions) * 100,
      averageExecutionTime: stats.totalTime / stats.totalExecutions,
      errorRate: ((stats.totalExecutions - stats.successfulExecutions) / stats.totalExecutions) * 100
    }));
  }

  // Mock action implementations
  async sendEmail(parameters, candidateId) {
    console.log(`Sending email to candidate ${candidateId}:`, parameters);
    return { sent: true, messageId: `msg_${Date.now()}` };
  }

  async updateCandidateStatus(candidateId, status) {
    console.log(`Updating candidate ${candidateId} status to:`, status);
    return { updated: true };
  }

  async assignRecruiter(candidateId, recruiterId) {
    console.log(`Assigning candidate ${candidateId} to recruiter ${recruiterId}`);
    return { assigned: true };
  }

  async createTask(parameters, candidateId) {
    const task = {
      id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...parameters,
      relatedTo: { type: 'candidate', id: candidateId },
      createdAt: new Date()
    };
    console.log('Created task:', task);
    return task;
  }

  async callWebhook(parameters, candidateId, context) {
    console.log(`Calling webhook for candidate ${candidateId}:`, parameters);
    return { called: true, response: 'success' };
  }

  // Initialize mock data
  initializeMockData() {
    // Mock workflows
    const mockWorkflows = [
      {
        id: 'workflow_1',
        name: 'New Candidate Onboarding',
        description: 'Automated workflow for new candidate registration',
        isActive: true,
        trigger: {
          id: 'trigger_1',
          type: 'candidate-added',
          conditions: {},
          description: 'When a new candidate is added'
        },
        conditions: [
          {
            id: 'condition_1',
            type: 'score-greater-than',
            field: 'leadScore',
            operator: 'greater-than',
            value: 70,
            logicalOperator: 'AND'
          }
        ],
        actions: [
          {
            id: 'action_1',
            type: 'send-email',
            parameters: {
              template: 'welcome-email',
              subject: 'Welcome to our talent network!'
            },
            delay: 0,
            description: 'Send welcome email'
          },
          {
            id: 'action_2',
            type: 'calculate-score',
            parameters: {},
            delay: 5,
            description: 'Calculate lead score'
          },
          {
            id: 'action_3',
            type: 'assign-territory',
            parameters: {},
            delay: 10,
            description: 'Auto-assign to territory'
          }
        ],
        createdBy: 'admin',
        createdAt: new Date('2024-01-01'),
        lastModified: new Date('2024-01-15'),
        executionCount: 45,
        successRate: 92.5
      },
      {
        id: 'workflow_2',
        name: 'High-Value Candidate Alert',
        description: 'Alert recruiters when high-scoring candidates are added',
        isActive: true,
        trigger: {
          id: 'trigger_2',
          type: 'score-threshold',
          conditions: { threshold: 85 },
          description: 'When candidate score exceeds 85'
        },
        conditions: [],
        actions: [
          {
            id: 'action_4',
            type: 'create-task',
            parameters: {
              title: 'Review high-value candidate',
              priority: 'high',
              assignedTo: 'auto'
            },
            delay: 0,
            description: 'Create review task'
          },
          {
            id: 'action_5',
            type: 'send-email',
            parameters: {
              template: 'recruiter-alert',
              subject: 'High-value candidate alert'
            },
            delay: 0,
            description: 'Alert recruiter'
          }
        ],
        createdBy: 'admin',
        createdAt: new Date('2024-01-10'),
        lastModified: new Date('2024-01-20'),
        executionCount: 23,
        successRate: 95.7
      }
    ];

    mockWorkflows.forEach(workflow => {
      this.workflows.set(workflow.id, workflow);
    });

    // Mock scoring rules
    const mockScoringRules = [
      {
        id: 'rule_1',
        name: 'React Experience',
        category: 'skills',
        condition: 'skills.includes("React")',
        points: 25,
        weight: 1.2,
        isActive: true,
        description: 'Bonus points for React experience',
        createdBy: 'admin',
        createdAt: new Date('2024-01-01')
      },
      {
        id: 'rule_2',
        name: 'Senior Experience',
        category: 'experience',
        condition: 'experience >= 5',
        points: 30,
        weight: 1.5,
        isActive: true,
        description: 'Bonus for 5+ years experience',
        createdBy: 'admin',
        createdAt: new Date('2024-01-01')
      },
      {
        id: 'rule_3',
        name: 'Immediate Availability',
        category: 'availability',
        condition: 'availability === "immediate"',
        points: 20,
        weight: 1.0,
        isActive: true,
        description: 'Bonus for immediate availability',
        createdBy: 'admin',
        createdAt: new Date('2024-01-01')
      }
    ];

    mockScoringRules.forEach(rule => {
      this.scoringRules.set(rule.id, rule);
    });

    // Mock territories
    const mockTerritories = [
      {
        id: 'territory_1',
        name: 'West Coast Tech',
        type: 'geographic',
        criteria: {
          locations: ['San Francisco', 'Los Angeles', 'Seattle'],
          skills: ['React', 'Node.js', 'Python']
        },
        assignedRecruiters: ['recruiter_1', 'recruiter_2'],
        isActive: true,
        performance: {
          totalCandidates: 156,
          placedCandidates: 42,
          averageTimeToHire: 18,
          conversionRate: 26.9,
          revenue: 420000,
          lastUpdated: new Date()
        },
        createdBy: 'admin',
        createdAt: new Date('2024-01-01')
      },
      {
        id: 'territory_2',
        name: 'Enterprise Sales',
        type: 'skill-based',
        criteria: {
          skills: ['Sales', 'Account Management', 'CRM'],
          experienceLevels: ['senior', 'lead']
        },
        assignedRecruiters: ['recruiter_3'],
        isActive: true,
        performance: {
          totalCandidates: 89,
          placedCandidates: 28,
          averageTimeToHire: 22,
          conversionRate: 31.5,
          revenue: 280000,
          lastUpdated: new Date()
        },
        createdBy: 'admin',
        createdAt: new Date('2024-01-01')
      }
    ];

    mockTerritories.forEach(territory => {
      this.territories.set(territory.id, territory);
    });
  }
}

// Export singleton instance
export const workflowAutomationService = new WorkflowAutomationService();
export default workflowAutomationService;