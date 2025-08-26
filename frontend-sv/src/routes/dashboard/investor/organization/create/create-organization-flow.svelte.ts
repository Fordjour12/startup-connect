// Organization creation flow store using Svelte 5 runes
class CreateOrganizationFlow {
	currentStep = $state(1);
	formData = $state({});
	isSubmitting = $state(false);
	errors = $state({});

	constructor() {
		// Initialize with default values
		this.formData = {
			// Basic Info
			name: '',
			organizationType: '',
			website: '',
			description: '',
			headquarters: '',
			contactEmail: '',
			contactPhone: '',

			// Investment Focus
			investmentFocus: [],
			totalAssetsUnderManagement: '',
			investmentSizeRange: '',
			geographicFocus: '',
			sectorFocus: [],
			minInvestmentSize: '',
			maxInvestmentSize: '',
			preferredDealFlow: '',

			// Team Info
			foundedYear: '',
			teamSize: '',
			linkedinUrl: '',
			twitterHandle: '',
			teamMembers: [],

			// Verification
			documents: [],
			termsAccepted: false,
			verificationNotes: ''
		};
	}

	nextStep() {
		if (this.currentStep < 5) {
			this.currentStep++;
		}
	}

	previousStep() {
		if (this.currentStep > 1) {
			this.currentStep--;
		}
	}

	goToStep(step: number) {
		if (step >= 1 && step <= 5) {
			this.currentStep = step;
		}
	}

	updateFormData(data: any) {
		this.formData = { ...this.formData, ...data };
	}

	validateCurrentStep(): boolean {
		const errors: Record<string, string> = {};

		switch (this.currentStep) {
			case 1: // Basic Info
				if (!this.formData.name?.trim()) {
					errors.name = 'Organization name is required';
				}
				if (!this.formData.organizationType) {
					errors.organizationType = 'Organization type is required';
				}
				break;

			case 2: // Investment Focus
				if (!this.formData.investmentFocus?.length) {
					errors.investmentFocus = 'At least one investment stage is required';
				}
				break;

			case 3: // Team Info
				// Optional validation for team info
				break;

			case 4: // Verification
				if (!this.formData.termsAccepted) {
					errors.termsAccepted = 'You must accept the terms and conditions';
				}
				break;
		}

		this.errors = errors;
		return Object.keys(errors).length === 0;
	}

	async submit() {
		if (!this.validateCurrentStep()) {
			return { success: false, errors: this.errors };
		}

		this.isSubmitting = true;

		try {
			// Here you would make the actual API call
			console.log('Submitting organization data:', this.formData);

			// Simulate API call
			await new Promise(resolve => setTimeout(resolve, 2000));

			return { success: true, data: this.formData };
		} catch (error) {
			console.error('Error creating organization:', error);
			return { success: false, error: 'Failed to create organization' };
		} finally {
			this.isSubmitting = false;
		}
	}

	reset() {
		this.currentStep = 1;
		this.formData = {
			name: '',
			organizationType: '',
			website: '',
			description: '',
			headquarters: '',
			contactEmail: '',
			contactPhone: '',
			investmentFocus: [],
			totalAssetsUnderManagement: '',
			investmentSizeRange: '',
			geographicFocus: '',
			sectorFocus: [],
			minInvestmentSize: '',
			maxInvestmentSize: '',
			preferredDealFlow: '',
			foundedYear: '',
			teamSize: '',
			linkedinUrl: '',
			twitterHandle: '',
			teamMembers: [],
			documents: [],
			termsAccepted: false,
			verificationNotes: ''
		};
		this.errors = {};
	}
}

// Export a singleton instance
export const createOrganizationFlow = new CreateOrganizationFlow();
