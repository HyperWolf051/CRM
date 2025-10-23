// Indian localization configuration
export const INDIAN_CONFIG = {
  // Currency
  currency: {
    code: 'INR',
    symbol: '₹',
    locale: 'en-IN'
  },
  
  // Date and Time
  dateTime: {
    timezone: 'Asia/Kolkata',
    locale: 'en-IN',
    dateFormat: 'dd/MM/yyyy',
    timeFormat: '12h' // 12-hour format with AM/PM
  },
  
  // Phone number format
  phone: {
    countryCode: '+91',
    format: '+91 XXXXX XXXXX'
  },
  
  // Common Indian cities for dropdowns
  cities: [
    'Mumbai, Maharashtra',
    'Delhi, NCR',
    'Bengaluru, Karnataka',
    'Hyderabad, Telangana',
    'Chennai, Tamil Nadu',
    'Kolkata, West Bengal',
    'Pune, Maharashtra',
    'Ahmedabad, Gujarat',
    'Jaipur, Rajasthan',
    'Surat, Gujarat',
    'Lucknow, Uttar Pradesh',
    'Kanpur, Uttar Pradesh',
    'Nagpur, Maharashtra',
    'Indore, Madhya Pradesh',
    'Thane, Maharashtra',
    'Bhopal, Madhya Pradesh',
    'Visakhapatnam, Andhra Pradesh',
    'Pimpri-Chinchwad, Maharashtra',
    'Patna, Bihar',
    'Vadodara, Gujarat',
    'Ghaziabad, Uttar Pradesh',
    'Ludhiana, Punjab',
    'Agra, Uttar Pradesh',
    'Nashik, Maharashtra',
    'Faridabad, Haryana',
    'Meerut, Uttar Pradesh',
    'Rajkot, Gujarat',
    'Kalyan-Dombivali, Maharashtra',
    'Vasai-Virar, Maharashtra',
    'Varanasi, Uttar Pradesh',
    'Srinagar, Jammu and Kashmir',
    'Aurangabad, Maharashtra',
    'Dhanbad, Jharkhand',
    'Amritsar, Punjab',
    'Navi Mumbai, Maharashtra',
    'Allahabad, Uttar Pradesh',
    'Ranchi, Jharkhand',
    'Howrah, West Bengal',
    'Coimbatore, Tamil Nadu',
    'Jabalpur, Madhya Pradesh',
    'Gwalior, Madhya Pradesh',
    'Vijayawada, Andhra Pradesh',
    'Jodhpur, Rajasthan',
    'Madurai, Tamil Nadu',
    'Raipur, Chhattisgarh',
    'Kota, Rajasthan',
    'Chandigarh, Chandigarh',
    'Guwahati, Assam',
    'Solapur, Maharashtra',
    'Hubli-Dharwad, Karnataka',
    'Bareilly, Uttar Pradesh',
    'Moradabad, Uttar Pradesh',
    'Mysore, Karnataka',
    'Gurgaon, Haryana',
    'Aligarh, Uttar Pradesh',
    'Jalandhar, Punjab',
    'Tiruchirappalli, Tamil Nadu',
    'Bhubaneswar, Odisha'
  ],
  
  // Indian industries
  industries: [
    'Information Technology',
    'Banking & Financial Services',
    'Pharmaceuticals',
    'Telecommunications',
    'Automotive',
    'Textiles',
    'Manufacturing',
    'E-commerce',
    'Food Technology',
    'Real Estate',
    'Education',
    'Healthcare',
    'Media & Entertainment',
    'Retail',
    'Agriculture',
    'Energy & Power',
    'Logistics',
    'Travel & Tourism',
    'Conglomerate',
    'Consulting',
    'Government',
    'Non-Profit'
  ],
  
  // Common Indian names for mock data
  names: {
    male: [
      'Rahul', 'Arjun', 'Vikram', 'Amit', 'Rohit', 'Suresh', 'Rajesh', 'Anil', 'Deepak', 'Manoj',
      'Sanjay', 'Ravi', 'Ashok', 'Vinod', 'Prakash', 'Santosh', 'Ramesh', 'Mukesh', 'Ajay', 'Vijay',
      'Kiran', 'Nitin', 'Sachin', 'Akash', 'Vishal', 'Gaurav', 'Ankit', 'Abhishek', 'Varun', 'Harsh'
    ],
    female: [
      'Priya', 'Anjali', 'Kavya', 'Neha', 'Sneha', 'Pooja', 'Ritu', 'Sunita', 'Meera', 'Sita',
      'Geeta', 'Anita', 'Rekha', 'Shanti', 'Lakshmi', 'Radha', 'Kamala', 'Usha', 'Nisha', 'Asha',
      'Deepika', 'Shruti', 'Swati', 'Preeti', 'Shweta', 'Riya', 'Divya', 'Simran', 'Pallavi', 'Manisha'
    ],
    surnames: [
      'Sharma', 'Gupta', 'Singh', 'Patel', 'Kumar', 'Agarwal', 'Mehta', 'Shah', 'Jain', 'Reddy',
      'Nair', 'Iyer', 'Rao', 'Verma', 'Mishra', 'Tiwari', 'Pandey', 'Srivastava', 'Chopra', 'Malhotra',
      'Bansal', 'Mittal', 'Aggarwal', 'Joshi', 'Saxena', 'Kapoor', 'Bhatia', 'Arora', 'Khanna', 'Sethi'
    ]
  },
  
  // Working hours in IST
  workingHours: {
    standard: { start: '09:00', end: '18:00' },
    flexible: { start: '09:30', end: '18:30' },
    early: { start: '08:30', end: '17:30' },
    late: { start: '10:00', end: '19:00' }
  },
  
  // Indian number formatting (lakhs, crores)
  numberFormat: {
    useIndianSystem: true,
    separators: {
      thousand: ',',
      decimal: '.'
    }
  }
};

// Helper functions
export const getRandomIndianName = (gender = null) => {
  const { male, female, surnames } = INDIAN_CONFIG.names;
  const firstNames = gender === 'male' ? male : gender === 'female' ? female : [...male, ...female];
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const surname = surnames[Math.floor(Math.random() * surnames.length)];
  return `${firstName} ${surname}`;
};

export const getRandomIndianCity = () => {
  const cities = INDIAN_CONFIG.cities;
  return cities[Math.floor(Math.random() * cities.length)];
};

export const formatIndianPhone = (number) => {
  // Remove all non-digits
  const digits = number.replace(/\D/g, '');
  
  // Format as +91 XXXXX XXXXX
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  } else if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`;
  }
  
  return number; // Return original if format not recognized
};

export const formatIndianCurrency = (amount) => {
  if (amount >= 10000000) { // 1 crore
    return `₹${(amount / 10000000).toFixed(1)} Cr`;
  } else if (amount >= 100000) { // 1 lakh
    return `₹${(amount / 100000).toFixed(1)} L`;
  } else if (amount >= 1000) { // 1 thousand
    return `₹${(amount / 1000).toFixed(1)} K`;
  }
  
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount);
};