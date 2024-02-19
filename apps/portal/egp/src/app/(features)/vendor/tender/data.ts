export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  description: string; // New field for subcategory description
  imageUrl: string; // New field for subcategory image URL
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string; // New field for category description
  imageUrl: string; // New field for category image URL
  subCategories: SubCategory[]; // New field for subcategories
}

// Mock data for categories
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'All Tenders',
    slug: 'all-tenders',
    description: 'View all available tenders',
    imageUrl: '/images/all-tenders.jpg',
    subCategories: [
      {
        id: '1',
        name: 'Construction',
        slug: 'construction',
        description: 'Tenders related to construction projects',
        imageUrl: '/images/construction.jpg',
      },
      {
        id: '2',
        name: 'IT Services',
        slug: 'it-services',
        description: 'Tenders related to IT services',
        imageUrl: '/images/it-services.jpg',
      },
      {
        id: '3',
        name: 'Healthcare',
        slug: 'healthcare',
        description: 'Tenders related to healthcare services',
        imageUrl: '/images/healthcare.jpg',
      },
      {
        id: '4',
        name: 'Education',
        slug: 'education',
        description: 'Tenders related to educational projects',
        imageUrl: '/images/education.jpg',
      },
      {
        id: '5',
        name: 'Transportation',
        slug: 'transportation',
        description: 'Tenders related to transportation projects',
        imageUrl: '/images/transportation.jpg',
      },
    ],
  },
  {
    id: '2',
    name: 'Latest Tenders',
    slug: 'latest-tenders',
    description: 'Explore the latest tenders',
    imageUrl: '/images/latest-tenders.jpg',
    subCategories: [
      {
        id: '1',
        name: 'Technology',
        slug: 'technology',
        description: 'Tenders related to latest technology',
        imageUrl: '/images/technology.jpg',
      },
      {
        id: '2',
        name: 'Health',
        slug: 'health',
        description: 'Tenders related to latest health initiatives',
        imageUrl: '/images/health.jpg',
      },
      {
        id: '3',
        name: 'Infrastructure',
        slug: 'infrastructure',
        description: 'Tenders related to latest infrastructure projects',
        imageUrl: '/images/infrastructure.jpg',
      },
      {
        id: '4',
        name: 'Finance',
        slug: 'finance',
        description: 'Tenders related to latest financial opportunities',
        imageUrl: '/images/finance.jpg',
      },
      {
        id: '5',
        name: 'Agriculture',
        slug: 'agriculture',
        description: 'Tenders related to latest agricultural developments',
        imageUrl: '/images/agriculture.jpg',
      },
    ],
  },
  {
    id: '3',
    name: 'Consulting',
    slug: 'consulting',
    description: 'Tenders related to consulting services',
    imageUrl: '/images/consulting.jpg',
    subCategories: [
      {
        id: '1',
        name: 'Management Consulting',
        slug: 'management-consulting',
        description: 'Tenders related to management consulting services',
        imageUrl: '/images/management-consulting.jpg',
      },
      {
        id: '2',
        name: 'Financial Consulting',
        slug: 'financial-consulting',
        description: 'Tenders related to financial consulting services',
        imageUrl: '/images/financial-consulting.jpg',
      },
      {
        id: '3',
        name: 'Legal Consulting',
        slug: 'legal-consulting',
        description: 'Tenders related to legal consulting services',
        imageUrl: '/images/legal-consulting.jpg',
      },
      {
        id: '4',
        name: 'Technology Consulting',
        slug: 'technology-consulting',
        description: 'Tenders related to technology consulting services',
        imageUrl: '/images/technology-consulting.jpg',
      },
      {
        id: '5',
        name: 'Marketing Consulting',
        slug: 'marketing-consulting',
        description: 'Tenders related to marketing consulting services',
        imageUrl: '/images/marketing-consulting.jpg',
      },
    ],
  },
  {
    id: '4',
    name: 'Engineering',
    slug: 'engineering',
    description: 'Tenders related to engineering projects',
    imageUrl: '/images/engineering.jpg',
    subCategories: [
      {
        id: '1',
        name: 'Civil Engineering',
        slug: 'civil-engineering',
        description: 'Tenders related to civil engineering projects',
        imageUrl: '/images/civil-engineering.jpg',
      },
      {
        id: '2',
        name: 'Mechanical Engineering',
        slug: 'mechanical-engineering',
        description: 'Tenders related to mechanical engineering projects',
        imageUrl: '/images/mechanical-engineering.jpg',
      },
      {
        id: '3',
        name: 'Electrical Engineering',
        slug: 'electrical-engineering',
        description: 'Tenders related to electrical engineering projects',
        imageUrl: '/images/electrical-engineering.jpg',
      },
      {
        id: '4',
        name: 'Software Engineering',
        slug: 'software-engineering',
        description: 'Tenders related to software engineering projects',
        imageUrl: '/images/software-engineering.jpg',
      },
      {
        id: '5',
        name: 'Aerospace Engineering',
        slug: 'aerospace-engineering',
        description: 'Tenders related to aerospace engineering projects',
        imageUrl: '/images/aerospace-engineering.jpg',
      },
    ],
  },
  {
    id: '5',
    name: 'Marketing',
    slug: 'marketing',
    description: 'Tenders related to marketing campaigns',
    imageUrl: '/images/marketing.jpg',
    subCategories: [
      {
        id: '1',
        name: 'Digital Marketing',
        slug: 'digital-marketing',
        description: 'Tenders related to digital marketing campaigns',
        imageUrl: '/images/digital-marketing.jpg',
      },
      {
        id: '2',
        name: 'Content Marketing',
        slug: 'content-marketing',
        description: 'Tenders related to content marketing campaigns',
        imageUrl: '/images/content-marketing.jpg',
      },
      {
        id: '3',
        name: 'Social Media Marketing',
        slug: 'social-media-marketing',
        description: 'Tenders related to social media marketing campaigns',
        imageUrl: '/images/social-media-marketing.jpg',
      },
      {
        id: '4',
        name: 'Influencer Marketing',
        slug: 'influencer-marketing',
        description: 'Tenders related to influencer marketing campaigns',
        imageUrl: '/images/influencer-marketing.jpg',
      },
      {
        id: '5',
        name: 'Email Marketing',
        slug: 'email-marketing',
        description: 'Tenders related to email marketing campaigns',
        imageUrl: '/images/email-marketing.jpg',
      },
    ],
  },
];
