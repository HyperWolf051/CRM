import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Contact from '../models/Contact.js';
import Deal from '../models/Deal.js';
import Company from '../models/Company.js';
import CalendarEvent from '../models/CalendarEvent.js';
import Notification from '../models/Notification.js';

// Load environment variables
dotenv.config();

// Sample data
const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@crm.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1-555-0101',
    department: 'Management',
    position: 'System Administrator'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah.johnson@crm.com',
    password: 'password123',
    role: 'manager',
    phone: '+1-555-0102',
    department: 'Sales',
    position: 'Sales Manager'
  },
  {
    name: 'Mike Chen',
    email: 'mike.chen@crm.com',
    password: 'password123',
    role: 'user',
    phone: '+1-555-0103',
    department: 'Sales',
    position: 'Sales Representative'
  },
  {
    name: 'Emily Davis',
    email: 'emily.davis@crm.com',
    password: 'password123',
    role: 'user',
    phone: '+1-555-0104',
    department: 'Marketing',
    position: 'Marketing Specialist'
  }
];

const sampleCompanies = [
  {
    name: 'TechCorp Solutions',
    industry: 'Technology',
    size: '201-500',
    website: 'https://techcorp.com',
    email: 'info@techcorp.com',
    phone: '+1-555-1001',
    address: {
      street: '123 Tech Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      country: 'USA'
    },
    description: 'Leading technology solutions provider',
    status: 'customer',
    revenue: 5000000,
    employees: 350,
    foundedYear: 2010
  },
  {
    name: 'Global Manufacturing Inc',
    industry: 'Manufacturing',
    size: '1000+',
    website: 'https://globalmanufacturing.com',
    email: 'contact@globalmanufacturing.com',
    phone: '+1-555-1002',
    address: {
      street: '456 Industrial Ave',
      city: 'Detroit',
      state: 'MI',
      zipCode: '48201',
      country: 'USA'
    },
    description: 'Large-scale manufacturing company',
    status: 'prospect',
    revenue: 50000000,
    employees: 2500,
    foundedYear: 1985
  },
  {
    name: 'HealthFirst Medical',
    industry: 'Healthcare',
    size: '51-200',
    website: 'https://healthfirst.com',
    email: 'info@healthfirst.com',
    phone: '+1-555-1003',
    address: {
      street: '789 Medical Center Dr',
      city: 'Boston',
      state: 'MA',
      zipCode: '02101',
      country: 'USA'
    },
    description: 'Comprehensive healthcare services',
    status: 'customer',
    revenue: 8000000,
    employees: 150,
    foundedYear: 2005
  },
  {
    name: 'EduTech Learning',
    industry: 'Education',
    size: '11-50',
    website: 'https://edutech.com',
    email: 'hello@edutech.com',
    phone: '+1-555-1004',
    address: {
      street: '321 Education Blvd',
      city: 'Austin',
      state: 'TX',
      zipCode: '73301',
      country: 'USA'
    },
    description: 'Online learning platform',
    status: 'prospect',
    revenue: 2000000,
    employees: 45,
    foundedYear: 2018
  }
];

const sampleContacts = [
  {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@techcorp.com',
    phone: '+1-555-2001',
    position: 'CTO',
    status: 'customer',
    source: 'website',
    priority: 'high',
    dealValue: 150000,
    notes: 'Key decision maker for technology purchases'
  },
  {
    firstName: 'Lisa',
    lastName: 'Anderson',
    email: 'lisa.anderson@globalmanufacturing.com',
    phone: '+1-555-2002',
    position: 'Procurement Manager',
    status: 'prospect',
    source: 'referral',
    priority: 'medium',
    dealValue: 75000,
    notes: 'Interested in our manufacturing solutions'
  },
  {
    firstName: 'David',
    lastName: 'Wilson',
    email: 'david.wilson@healthfirst.com',
    phone: '+1-555-2003',
    position: 'IT Director',
    status: 'customer',
    source: 'cold_call',
    priority: 'high',
    dealValue: 200000,
    notes: 'Looking to upgrade their IT infrastructure'
  },
  {
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.garcia@edutech.com',
    phone: '+1-555-2004',
    position: 'Product Manager',
    status: 'lead',
    source: 'social_media',
    priority: 'medium',
    dealValue: 50000,
    notes: 'Evaluating our educational software solutions'
  },
  {
    firstName: 'Robert',
    lastName: 'Brown',
    email: 'robert.brown@techcorp.com',
    phone: '+1-555-2005',
    position: 'VP of Engineering',
    status: 'prospect',
    source: 'event',
    priority: 'high',
    dealValue: 300000,
    notes: 'Met at tech conference, very interested'
  }
];

const sampleDeals = [
  {
    title: 'TechCorp Enterprise License',
    description: 'Annual enterprise software license for TechCorp Solutions',
    value: 150000,
    stage: 'negotiation',
    probability: 75,
    expectedCloseDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    source: 'website',
    priority: 'high',
    notes: 'Final negotiations on pricing and terms'
  },
  {
    title: 'Global Manufacturing Integration',
    description: 'System integration project for Global Manufacturing',
    value: 75000,
    stage: 'proposal',
    probability: 50,
    expectedCloseDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
    source: 'referral',
    priority: 'medium',
    notes: 'Proposal submitted, waiting for feedback'
  },
  {
    title: 'HealthFirst IT Upgrade',
    description: 'Complete IT infrastructure upgrade for HealthFirst Medical',
    value: 200000,
    stage: 'qualified',
    probability: 60,
    expectedCloseDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
    source: 'cold_call',
    priority: 'high',
    notes: 'Budget approved, moving to technical evaluation'
  },
  {
    title: 'EduTech Platform License',
    description: 'Educational platform licensing for EduTech Learning',
    value: 50000,
    stage: 'lead',
    probability: 25,
    expectedCloseDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
    source: 'social_media',
    priority: 'medium',
    notes: 'Initial interest shown, need to qualify further'
  },
  {
    title: 'TechCorp Advanced Analytics',
    description: 'Advanced analytics solution for TechCorp',
    value: 300000,
    stage: 'closed_won',
    probability: 100,
    expectedCloseDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
    actualCloseDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    source: 'event',
    priority: 'high',
    notes: 'Successfully closed! Implementation starting next month'
  }
];

const sampleCalendarEvents = [
  {
    title: 'TechCorp Demo Call',
    description: 'Product demonstration for TechCorp team',
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour later
    type: 'demo',
    status: 'scheduled',
    priority: 'high',
    isVirtual: true,
    meetingLink: 'https://zoom.us/j/123456789',
    notes: 'Prepare demo environment and presentation materials'
  },
  {
    title: 'Weekly Sales Meeting',
    description: 'Weekly team sync and pipeline review',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour later
    type: 'meeting',
    status: 'scheduled',
    priority: 'medium',
    location: 'Conference Room A',
    notes: 'Review Q4 pipeline and discuss upcoming opportunities'
  },
  {
    title: 'HealthFirst Follow-up Call',
    description: 'Follow-up call with HealthFirst IT Director',
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000), // 30 minutes later
    type: 'call',
    status: 'scheduled',
    priority: 'high',
    notes: 'Discuss technical requirements and timeline'
  }
];

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Clear existing data
const clearData = async () => {
  try {
    await User.deleteMany({});
    await Contact.deleteMany({});
    await Deal.deleteMany({});
    await Company.deleteMany({});
    await CalendarEvent.deleteMany({});
    await Notification.deleteMany({});
    console.log('Existing data cleared');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

// Seed data
const seedData = async () => {
  try {
    // Create users
    console.log('Creating users...');
    const users = await User.create(sampleUsers);
    const adminUser = users.find(u => u.role === 'admin');
    const salesManager = users.find(u => u.role === 'manager');
    const salesRep = users.find(u => u.role === 'user');

    // Create companies
    console.log('Creating companies...');
    const companiesData = sampleCompanies.map(company => ({
      ...company,
      assignedTo: salesManager._id
    }));
    const companies = await Company.create(companiesData);

    // Create contacts
    console.log('Creating contacts...');
    const contactsData = sampleContacts.map((contact, index) => ({
      ...contact,
      company: companies[index % companies.length]._id,
      assignedTo: index < 2 ? salesManager._id : salesRep._id,
      nextFollowUp: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000)
    }));
    const contacts = await Contact.create(contactsData);

    // Create deals
    console.log('Creating deals...');
    const dealsData = sampleDeals.map((deal, index) => ({
      ...deal,
      contact: contacts[index]._id,
      company: companies[index % companies.length]._id,
      assignedTo: index < 2 ? salesManager._id : salesRep._id,
      activities: [
        {
          type: 'note',
          description: 'Initial contact made',
          createdBy: index < 2 ? salesManager._id : salesRep._id,
          date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      ]
    }));
    const deals = await Deal.create(dealsData);

    // Create calendar events
    console.log('Creating calendar events...');
    const eventsData = sampleCalendarEvents.map((event, index) => ({
      ...event,
      organizer: index === 0 ? salesRep._id : salesManager._id,
      attendees: [
        {
          user: adminUser._id,
          status: 'accepted'
        }
      ]
    }));
    const events = await CalendarEvent.create(eventsData);

    // Create sample notifications
    console.log('Creating notifications...');
    const notifications = [
      {
        title: 'Welcome to CRM Pro!',
        message: 'Your account has been set up successfully. Start managing your contacts and deals.',
        type: 'success',
        category: 'system',
        recipient: salesRep._id,
        priority: 'medium'
      },
      {
        title: 'Deal Closing Soon',
        message: 'TechCorp Enterprise License deal is expected to close in 30 days.',
        type: 'reminder',
        category: 'deal',
        recipient: salesManager._id,
        priority: 'high',
        actionUrl: '/app/deals',
        actionText: 'View Deal'
      },
      {
        title: 'Follow-up Required',
        message: 'Contact Lisa Anderson requires follow-up within 2 days.',
        type: 'warning',
        category: 'contact',
        recipient: salesManager._id,
        priority: 'high',
        actionUrl: '/app/contacts',
        actionText: 'View Contact'
      }
    ];
    await Notification.create(notifications);

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Sample Data Created:');
    console.log(`👥 Users: ${users.length}`);
    console.log(`🏢 Companies: ${companies.length}`);
    console.log(`👤 Contacts: ${contacts.length}`);
    console.log(`💼 Deals: ${deals.length}`);
    console.log(`📅 Calendar Events: ${events.length}`);
    console.log(`🔔 Notifications: ${notifications.length}`);
    
    console.log('\n🔐 Login Credentials:');
    console.log('Admin: admin@crm.com / admin123');
    console.log('Manager: sarah.johnson@crm.com / password123');
    console.log('User: mike.chen@crm.com / password123');
    console.log('User: emily.davis@crm.com / password123');

  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

// Main function
const main = async () => {
  await connectDB();
  await clearData();
  await seedData();
  process.exit(0);
};

// Run the script
main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});