import { USER_ROLES } from '@/db/schema/auth-schema';

export const getUserRoles = [
  {
    id: USER_ROLES.FOUNDER,
    title: 'Founder',
    description: 'I\'m building a startup and looking for investors, mentors, and resources',
    icon: '🚀',
    features: [
      'Connect with investors and mentors',
      'Access fundraising tools and resources',
      'Build your startup profile',
      'Get AI-powered insights and feedback'
    ]
  },
  {
    id: USER_ROLES.INVESTOR,
    title: 'Investor',
    description: 'I\'m an investor looking to discover and support promising startups',
    icon: '💰',
    features: [
      'Discover promising startups',
      'Access detailed startup profiles',
      'Connect with founders directly',
      'Track your investment pipeline'
    ]
  },
  {
    id: USER_ROLES.SUPPORT,
    title: 'Supporter',
    description: 'I want to support the startup ecosystem as a mentor, advisor, or service provider',
    icon: '🤝',
    features: [
      'Offer mentorship and guidance',
      'Provide professional services',
      'Connect with the startup community',
      'Share your expertise'
    ]
  }
]
