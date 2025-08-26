<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from "$lib/components/ui/card";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Switch } from "$lib/components/ui/switch";
	import {
		Settings,
		Mail,
		Shield,
		Database,
		Save,
		RefreshCw,
	} from "@tabler/icons-svelte";

	let { data } = $props<{
		data: {
			user: any;
			platformSettings: any;
			emailSettings: any;
			securitySettings: any;
			featureFlags: any;
		};
	}>();

	const {
		user,
		platformSettings,
		emailSettings,
		securitySettings,
		featureFlags,
	} = data;

	function saveSettings() {
		// TODO: Implement save functionality with API call
		console.log("Saving settings:", settings);
	}

	function resetSettings() {
		// TODO: Reset to default settings
		console.log("Resetting settings");
	}
</script>

<svelte:head>
	<title>Settings - Admin Dashboard</title>
	<meta
		name="description"
		content="Configure platform settings and preferences"
	/>
</svelte:head>

<div class="container mx-auto px-4 py-8">
	<div
		class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
	>
		<div>
			<h1 class="text-3xl font-bold">Settings</h1>
			<p class="text-muted-foreground">
				Configure platform settings and preferences
			</p>
		</div>
		<div class="mt-4 md:mt-0 flex gap-2">
			<Button variant="outline" onclick={resetSettings}>
				<RefreshCw class="h-4 w-4 mr-2" />
				Reset
			</Button>
			<Button onclick={saveSettings}>
				<Save class="h-4 w-4 mr-2" />
				Save Changes
			</Button>
		</div>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- Platform Settings -->
		<Card>
			<CardHeader>
				<CardTitle class="flex items-center space-x-2">
					<Settings class="h-5 w-5" />
					<span>Platform Settings</span>
				</CardTitle>
				<CardDescription>General platform configuration</CardDescription
				>
			</CardHeader>
			<CardContent class="space-y-4">
				<div class="space-y-2">
					<Label for="platform-name">Platform Name</Label>
					<Input
						id="platform-name"
						value={platformSettings.name}
						placeholder="Enter platform name"
					/>
				</div>

				<div class="space-y-2">
					<Label for="platform-description">Description</Label>
					<Input
						id="platform-description"
						value={platformSettings.description}
						placeholder="Enter platform description"
					/>
				</div>

				<div class="space-y-2">
					<Label for="contact-email">Contact Email</Label>
					<Input
						id="contact-email"
						type="email"
						bind:value={settings.platform.contactEmail}
						placeholder="admin@example.com"
					/>
				</div>

				<div class="flex items-center justify-between">
					<div class="space-y-0.5">
						<Label>Maintenance Mode</Label>
						<p class="text-sm text-muted-foreground">
							Temporarily disable the platform
						</p>
					</div>
					<Switch bind:checked={settings.platform.maintenanceMode} />
				</div>

				<div class="flex items-center justify-between">
					<div class="space-y-0.5">
						<Label>Allow Registrations</Label>
						<p class="text-sm text-muted-foreground">
							Enable new user registrations
						</p>
					</div>
					<Switch
						bind:checked={settings.platform.allowRegistrations}
					/>
				</div>
			</CardContent>
		</Card>

		<!-- Email Settings -->
		<Card>
			<CardHeader>
				<CardTitle class="flex items-center space-x-2">
					<Mail class="h-5 w-5" />
					<span>Email Settings</span>
				</CardTitle>
				<CardDescription
					>Configure email notifications and SMTP</CardDescription
				>
			</CardHeader>
			<CardContent class="space-y-4">
				<div class="space-y-2">
					<Label for="smtp-host">SMTP Host</Label>
					<Input
						id="smtp-host"
						bind:value={settings.email.smtpHost}
						placeholder="smtp.example.com"
					/>
				</div>

				<div class="space-y-2">
					<Label for="smtp-port">SMTP Port</Label>
					<Input
						id="smtp-port"
						type="number"
						bind:value={settings.email.smtpPort}
						placeholder="587"
					/>
				</div>

				<div class="space-y-2">
					<Label for="smtp-user">SMTP Username</Label>
					<Input
						id="smtp-user"
						bind:value={settings.email.smtpUser}
						placeholder="noreply@example.com"
					/>
				</div>

				<div class="flex items-center justify-between">
					<div class="space-y-0.5">
						<Label>Email Templates</Label>
						<p class="text-sm text-muted-foreground">
							Use custom email templates
						</p>
					</div>
					<Switch bind:checked={settings.email.emailTemplates} />
				</div>

				<div class="flex items-center justify-between">
					<div class="space-y-0.5">
						<Label>Notification Emails</Label>
						<p class="text-sm text-muted-foreground">
							Send notification emails
						</p>
					</div>
					<Switch bind:checked={settings.email.notificationEmails} />
				</div>
			</CardContent>
		</Card>

		<!-- Security Settings -->
		<Card>
			<CardHeader>
				<CardTitle class="flex items-center space-x-2">
					<Shield class="h-5 w-5" />
					<span>Security Settings</span>
				</CardTitle>
				<CardDescription
					>Configure security and authentication settings</CardDescription
				>
			</CardHeader>
			<CardContent class="space-y-4">
				<div class="flex items-center justify-between">
					<div class="space-y-0.5">
						<Label>Require 2FA</Label>
						<p class="text-sm text-muted-foreground">
							Require two-factor authentication
						</p>
					</div>
					<Switch
						bind:checked={settings.security.twoFactorRequired}
					/>
				</div>

				<div class="space-y-2">
					<Label for="session-timeout"
						>Session Timeout (minutes)</Label
					>
					<Input
						id="session-timeout"
						type="number"
						bind:value={settings.security.sessionTimeout}
						placeholder="30"
					/>
				</div>

				<div class="space-y-2">
					<Label for="password-length">Minimum Password Length</Label>
					<Input
						id="password-length"
						type="number"
						bind:value={settings.security.passwordMinLength}
						placeholder="8"
					/>
				</div>

				<div class="flex items-center justify-between">
					<div class="space-y-0.5">
						<Label>Strong Passwords</Label>
						<p class="text-sm text-muted-foreground">
							Require complex passwords
						</p>
					</div>
					<Switch
						bind:checked={settings.security.requireStrongPasswords}
					/>
				</div>
			</CardContent>
		</Card>

		<!-- Feature Flags -->
		<Card>
			<CardHeader>
				<CardTitle class="flex items-center space-x-2">
					<Database class="h-5 w-5" />
					<span>Feature Flags</span>
				</CardTitle>
				<CardDescription
					>Enable or disable platform features</CardDescription
				>
			</CardHeader>
			<CardContent class="space-y-4">
				<div class="flex items-center justify-between">
					<div class="space-y-0.5">
						<Label>Startup Approvals</Label>
						<p class="text-sm text-muted-foreground">
							Require admin approval for startups
						</p>
					</div>
					<Switch bind:checked={settings.features.startupApprovals} />
				</div>

				<div class="flex items-center justify-between">
					<div class="space-y-0.5">
						<Label>Investment Tracking</Label>
						<p class="text-sm text-muted-foreground">
							Track investment transactions
						</p>
					</div>
					<Switch
						bind:checked={settings.features.investmentTracking}
					/>
				</div>

				<div class="flex items-center justify-between">
					<div class="space-y-0.5">
						<Label>Analytics Dashboard</Label>
						<p class="text-sm text-muted-foreground">
							Show analytics to users
						</p>
					</div>
					<Switch
						bind:checked={settings.features.analyticsDashboard}
					/>
				</div>

				<div class="flex items-center justify-between">
					<div class="space-y-0.5">
						<Label>Messaging System</Label>
						<p class="text-sm text-muted-foreground">
							Enable user messaging
						</p>
					</div>
					<Switch bind:checked={settings.features.messagingSystem} />
				</div>
			</CardContent>
		</Card>
	</div>
</div>
