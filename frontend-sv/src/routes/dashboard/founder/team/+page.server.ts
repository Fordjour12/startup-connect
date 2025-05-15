import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, fetch }) => {
	// In a real application, these would be API calls to your backend
	// For now, we'll simulate the data

	// Team members data
	const teamMembers = [
		{
			id: 'emp-001',
			name: 'Emma Thompson',
			role: 'Chief Technology Officer',
			department: 'Engineering',
			avatar: '/images/avatars/emma.jpg',
			email: 'emma@nextech.com',
			startDate: '2023-01-15',
			salary: 145000,
			status: 'active',
			onboardingStatus: 100
		},
		{
			id: 'emp-002',
			name: 'Michael Chen',
			role: 'Lead Developer',
			department: 'Engineering',
			avatar: '/images/avatars/michael.jpg',
			email: 'michael@nextech.com',
			startDate: '2023-02-01',
			salary: 120000,
			status: 'active',
			onboardingStatus: 100
		},
		{
			id: 'emp-003',
			name: 'Sarah Johnson',
			role: 'Product Manager',
			department: 'Product',
			avatar: '/images/avatars/sarah.jpg',
			email: 'sarah@nextech.com',
			startDate: '2023-02-15',
			salary: 110000,
			status: 'active',
			onboardingStatus: 100
		},
		{
			id: 'emp-004',
			name: 'David Wilson',
			role: 'UX Designer',
			department: 'Design',
			avatar: '/images/avatars/david.jpg',
			email: 'david@nextech.com',
			startDate: '2023-03-10',
			salary: 95000,
			status: 'active',
			onboardingStatus: 100
		},
		{
			id: 'emp-005',
			name: 'Olivia Martinez',
			role: 'Marketing Specialist',
			department: 'Marketing',
			avatar: '/images/avatars/olivia.jpg',
			email: 'olivia@nextech.com',
			startDate: '2023-04-05',
			salary: 85000,
			status: 'active',
			onboardingStatus: 90
		},
		{
			id: 'emp-006',
			name: 'James Lee',
			role: 'Software Engineer',
			department: 'Engineering',
			avatar: '/images/avatars/james.jpg',
			email: 'james@nextech.com',
			startDate: '2023-05-20',
			salary: 105000,
			status: 'active',
			onboardingStatus: 75
		},
		{
			id: 'emp-007',
			name: 'Sophia Garcia',
			role: 'Customer Success Manager',
			department: 'Customer Success',
			avatar: '/images/avatars/sophia.jpg',
			email: 'sophia@nextech.com',
			startDate: '2023-06-12',
			salary: 80000,
			status: 'active',
			onboardingStatus: 60
		}
	];

	// Hiring pipeline data
	const hiringPipeline = {
		open_roles: [
			{
				id: 'role-001',
				title: 'Senior Backend Developer',
				department: 'Engineering',
				status: 'interviewing',
				priority: 'high',
				candidates: 8,
				interviews_scheduled: 3,
				posted_date: '2023-09-01',
				salary_range: { min: 120000, max: 150000 }
			},
			{
				id: 'role-002',
				title: 'Growth Marketing Manager',
				department: 'Marketing',
				status: 'screening',
				priority: 'medium',
				candidates: 12,
				interviews_scheduled: 5,
				posted_date: '2023-09-15',
				salary_range: { min: 90000, max: 110000 }
			},
			{
				id: 'role-003',
				title: 'Product Designer',
				department: 'Design',
				status: 'open',
				priority: 'medium',
				candidates: 6,
				interviews_scheduled: 0,
				posted_date: '2023-10-01',
				salary_range: { min: 85000, max: 105000 }
			},
			{
				id: 'role-004',
				title: 'DevOps Engineer',
				department: 'Engineering',
				status: 'final_interviews',
				priority: 'high',
				candidates: 4,
				interviews_scheduled: 2,
				posted_date: '2023-08-15',
				salary_range: { min: 110000, max: 140000 }
			}
		],
		candidates_by_stage: {
			application: 28,
			screening: 15,
			first_interview: 9,
			technical_assessment: 6,
			final_interview: 4,
			offer_made: 2,
			offer_accepted: 0
		},
		time_to_hire: {
			current_average_days: 32,
			previous_average_days: 38,
			by_department: {
				Engineering: 35,
				Marketing: 28,
				Design: 30,
				'Customer Success': 25
			}
		},
		hiring_goal: {
			total: 12,
			filled: 7,
			in_progress: 4,
			not_started: 1
		}
	};

	// Financial data including burn rate
	const financials = {
		total_burn_rate: 205000,
		runway_months: 14,
		burn_by_department: {
			Engineering: 98000,
			Marketing: 35000,
			Design: 22000,
			Product: 25000,
			'Customer Success': 15000,
			Operations: 10000
		},
		burn_rate_trend: [
			{ month: 'May', amount: 170000 },
			{ month: 'Jun', amount: 175000 },
			{ month: 'Jul', amount: 185000 },
			{ month: 'Aug', amount: 190000 },
			{ month: 'Sep', amount: 198000 },
			{ month: 'Oct', amount: 205000 }
		],
		salary_percentage: 82,
		other_expenses_percentage: 18,
		funding_raised: 3500000,
		burn_rate_change: 3.5, // Percentage increase from last month
		average_salary: 105714, // Average salary across the team
		headcount_growth: {
			current: 7,
			target_eoy: 15,
			previous_quarters: [3, 4, 5, 7]
		}
	};

	// Team goals and OKRs
	const teamGoals = {
		company_level: [
			{
				id: 'goal-001',
				title: 'Launch MVP to 500 beta users',
				progress: 85,
				due_date: '2023-11-30',
				owner: 'Alex Johnson',
				status: 'on_track'
			},
			{
				id: 'goal-002',
				title: 'Secure Series A funding',
				progress: 50,
				due_date: '2023-12-31',
				owner: 'Alex Johnson',
				status: 'on_track'
			},
			{
				id: 'goal-003',
				title: 'Achieve Product-Market Fit',
				progress: 40,
				due_date: '2024-03-31',
				owner: 'Sarah Johnson',
				status: 'at_risk'
			}
		],
		department_goals: {
			Engineering: [
				{
					id: 'eng-goal-001',
					title: 'Implement core platform features',
					progress: 80,
					due_date: '2023-11-15',
					owner: 'Emma Thompson',
					status: 'on_track'
				},
				{
					id: 'eng-goal-002',
					title: 'Reduce system load time by 40%',
					progress: 65,
					due_date: '2023-12-15',
					owner: 'Michael Chen',
					status: 'on_track'
				}
			],
			Product: [
				{
					id: 'prod-goal-001',
					title: 'Complete user feedback integration',
					progress: 70,
					due_date: '2023-11-30',
					owner: 'Sarah Johnson',
					status: 'on_track'
				}
			],
			Design: [
				{
					id: 'design-goal-001',
					title: 'Redesign mobile experience',
					progress: 50,
					due_date: '2023-12-01',
					owner: 'David Wilson',
					status: 'at_risk'
				}
			],
			Marketing: [
				{
					id: 'mkt-goal-001',
					title: 'Launch social media campaign',
					progress: 40,
					due_date: '2023-11-20',
					owner: 'Olivia Martinez',
					status: 'delayed'
				}
			]
		},
		key_results: [
			{
				id: 'kr-001',
				title: '500 active beta users',
				current: 350,
				target: 500,
				due_date: '2023-11-30'
			},
			{
				id: 'kr-002',
				title: '50% user retention after 30 days',
				current: 42,
				target: 50,
				due_date: '2023-12-15'
			},
			{
				id: 'kr-003',
				title: 'Net Promoter Score of 8+',
				current: 7.4,
				target: 8,
				due_date: '2023-12-31'
			},
			{
				id: 'kr-004',
				title: 'Series A term sheet received',
				current: 0,
				target: 1,
				due_date: '2023-12-31'
			}
		]
	};

	// Onboarding status data
	const onboarding = {
		recent_hires: [
			{
				id: 'emp-006',
				name: 'James Lee',
				role: 'Software Engineer',
				progress: 75,
				start_date: '2023-05-20',
				days_since_start: 21,
				remaining_tasks: [
					{ title: 'Complete security training', deadline: '2023-11-05' },
					{ title: 'Final project submission', deadline: '2023-11-10' }
				]
			},
			{
				id: 'emp-007',
				name: 'Sophia Garcia',
				role: 'Customer Success Manager',
				progress: 60,
				start_date: '2023-06-12',
				days_since_start: 7,
				remaining_tasks: [
					{ title: 'Product knowledge assessment', deadline: '2023-11-07' },
					{ title: 'Customer interaction training', deadline: '2023-11-12' },
					{ title: 'CRM training session', deadline: '2023-11-15' }
				]
			}
		],
		upcoming_starts: [
			{
				name: 'Robert Kim',
				role: 'Data Analyst',
				department: 'Engineering',
				start_date: '2023-11-15',
				onboarding_owner: 'Emma Thompson'
			}
		],
		onboarding_completion_rate: 85, // percentage
		average_days_to_full_productivity: 28
	};

	return {
		teamMembers,
		hiringPipeline,
		financials,
		teamGoals,
		onboarding
	};
}; 