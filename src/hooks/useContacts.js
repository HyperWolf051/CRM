import { useState, useEffect } from 'react';

// Mock contacts data for the CRM
const mockContacts = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@techcorp.com',
    phone: '+1 (555) 123-4567',
    company: 'TechCorp Inc.',
    position: 'CTO',
    department: 'Technology',
    location: 'San Francisco, CA',
    avatar: null,
    status: 'active',
    type: 'client',
    tags: ['decision-maker', 'technical'],
    notes: 'Key technical decision maker, prefers React developers',
    lastContact: new Date(2024, 11, 10),
    createdAt: new Date(2024, 9, 15),
    updatedAt: new Date(2024, 11, 10),
    socialLinks: {
      linkedin: 'https://linkedin.com/in/johnsmith',
      twitter: '@johnsmith'
    }
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@designstudio.com',
    phone: '+1 (555) 234-5678',
    company: 'Design Studio Pro',
    position: 'Head of Design',
    department: 'Design',
    location: 'New York, NY',
    avatar: null,
    status: 'active',
    type: 'client',
    tags: ['creative', 'manager'],
    notes: 'Looking for UX/UI designers with Figma experience',
    lastContact: new Date(2024, 11, 12),
    createdAt: new Date(2024, 9, 20),
    updatedAt: new Date(2024, 11, 12),
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarahjohnson',
      behance: 'https://behance.net/sarahjohnson'
    }
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'michael.chen@cloudtech.com',
    phone: '+1 (555) 345-6789',
    company: 'CloudTech Solutions',
    position: 'Engineering Manager',
    department: 'Engineering',
    location: 'Austin, TX',
    avatar: null,
    status: 'active',
    type: 'client',
    tags: ['technical', 'manager', 'backend'],
    notes: 'Needs backend engineers with Python and cloud experience',
    lastContact: new Date(2024, 11, 14),
    createdAt: new Date(2024, 9, 25),
    updatedAt: new Date(2024, 11, 14),
    socialLinks: {
      linkedin: 'https://linkedin.com/in/michaelchen',
      github: 'https://github.com/michaelchen'
    }
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@infrastructure.com',
    phone: '+1 (555) 456-7890',
    company: 'Infrastructure Inc.',
    position: 'VP of Engineering',
    department: 'Engineering',
    location: 'Seattle, WA',
    avatar: null,
    status: 'active',
    type: 'client',
    tags: ['executive', 'devops', 'infrastructure'],
    notes: 'Hiring DevOps engineers for cloud infrastructure team',
    lastContact: new Date(2024, 11, 8),
    createdAt: new Date(2024, 9, 10),
    updatedAt: new Date(2024, 11, 8),
    socialLinks: {
      linkedin: 'https://linkedin.com/in/emilydavis'
    }
  },
  {
    id: 5,
    name: 'Alex Rodriguez',
    email: 'alex.rodriguez@startupxyz.com',
    phone: '+1 (555) 567-8901',
    company: 'StartupXYZ',
    position: 'Co-Founder',
    department: 'Leadership',
    location: 'Remote',
    avatar: null,
    status: 'active',
    type: 'client',
    tags: ['founder', 'product', 'startup'],
    notes: 'Building product team, needs product managers and designers',
    lastContact: new Date(2024, 11, 5),
    createdAt: new Date(2024, 10, 1),
    updatedAt: new Date(2024, 11, 5),
    socialLinks: {
      linkedin: 'https://linkedin.com/in/alexrodriguez',
      twitter: '@alexrodriguez'
    }
  },
  {
    id: 6,
    name: 'Lisa Wang',
    email: 'lisa.wang@analyticspro.com',
    phone: '+1 (555) 678-9012',
    company: 'Analytics Pro',
    position: 'Data Science Director',
    department: 'Data Science',
    location: 'Boston, MA',
    avatar: null,
    status: 'inactive',
    type: 'client',
    tags: ['data-science', 'analytics', 'director'],
    notes: 'Previously hired data scientists, may have future opportunities',
    lastContact: new Date(2024, 10, 28),
    createdAt: new Date(2024, 8, 15),
    updatedAt: new Date(2024, 10, 28),
    socialLinks: {
      linkedin: 'https://linkedin.com/in/lisawang'
    }
  },
  // Candidate contacts
  {
    id: 7,
    name: 'David Thompson',
    email: 'david.thompson@email.com',
    phone: '+1 (555) 789-0123',
    company: 'Freelancer',
    position: 'Senior React Developer',
    department: 'Technology',
    location: 'Portland, OR',
    avatar: null,
    status: 'active',
    type: 'candidate',
    tags: ['react', 'frontend', 'senior'],
    notes: 'Excellent React developer, available for new opportunities',
    lastContact: new Date(2024, 11, 15),
    createdAt: new Date(2024, 10, 5),
    updatedAt: new Date(2024, 11, 15),
    socialLinks: {
      linkedin: 'https://linkedin.com/in/davidthompson',
      github: 'https://github.com/davidthompson'
    }
  },
  {
    id: 8,
    name: 'Jennifer Lee',
    email: 'jennifer.lee@email.com',
    phone: '+1 (555) 890-1234',
    company: 'Previous: Design Agency',
    position: 'UX Designer',
    department: 'Design',
    location: 'Los Angeles, CA',
    avatar: null,
    status: 'active',
    type: 'candidate',
    tags: ['ux', 'design', 'figma'],
    notes: 'Talented UX designer with strong portfolio',
    lastContact: new Date(2024, 11, 13),
    createdAt: new Date(2024, 10, 8),
    updatedAt: new Date(2024, 11, 13),
    socialLinks: {
      linkedin: 'https://linkedin.com/in/jenniferlee',
      dribbble: 'https://dribbble.com/jenniferlee'
    }
  }
];

const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate API call
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));
        setContacts(mockContacts);
        setError(null);
      } catch (err) {
        setError('Failed to fetch contacts');
        console.error('Error fetching contacts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  // Create a new contact
  const createContact = async (contactData) => {
    try {
      const newContact = {
        ...contactData,
        id: Math.max(...contacts.map(c => c.id)) + 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        status: 'active'
      };
      
      setContacts(prev => [...prev, newContact]);
      return { success: true, data: newContact };
    } catch (err) {
      console.error('Error creating contact:', err);
      return { success: false, error: 'Failed to create contact' };
    }
  };

  // Update a contact
  const updateContact = async (contactId, updates) => {
    try {
      setContacts(prev => prev.map(contact => 
        contact.id === contactId 
          ? { ...contact, ...updates, updatedAt: new Date() }
          : contact
      ));
      return { success: true };
    } catch (err) {
      console.error('Error updating contact:', err);
      return { success: false, error: 'Failed to update contact' };
    }
  };

  // Delete a contact
  const deleteContact = async (contactId) => {
    try {
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      return { success: true };
    } catch (err) {
      console.error('Error deleting contact:', err);
      return { success: false, error: 'Failed to delete contact' };
    }
  };

  // Get contact by ID
  const getContactById = (contactId) => {
    return contacts.find(contact => contact.id === parseInt(contactId));
  };

  // Filter contacts by type
  const getContactsByType = (type) => {
    return contacts.filter(contact => contact.type === type);
  };

  // Get clients only
  const getClients = () => {
    return contacts.filter(contact => contact.type === 'client');
  };

  // Get candidates only
  const getCandidates = () => {
    return contacts.filter(contact => contact.type === 'candidate');
  };

  // Search contacts
  const searchContacts = (query) => {
    if (!query) return contacts;
    
    const lowercaseQuery = query.toLowerCase();
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(lowercaseQuery) ||
      contact.email.toLowerCase().includes(lowercaseQuery) ||
      contact.company.toLowerCase().includes(lowercaseQuery) ||
      contact.position.toLowerCase().includes(lowercaseQuery) ||
      contact.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  // Get contacts statistics
  const getContactsStats = () => {
    const totalContacts = contacts.length;
    const clients = contacts.filter(c => c.type === 'client').length;
    const candidates = contacts.filter(c => c.type === 'candidate').length;
    const activeContacts = contacts.filter(c => c.status === 'active').length;
    const recentContacts = contacts.filter(c => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(c.lastContact) > weekAgo;
    }).length;
    
    return {
      totalContacts,
      clients,
      candidates,
      activeContacts,
      recentContacts
    };
  };

  return {
    contacts,
    loading,
    error,
    createContact,
    updateContact,
    deleteContact,
    getContactById,
    getContactsByType,
    getClients,
    getCandidates,
    searchContacts,
    getContactsStats
  };
};

export default useContacts;