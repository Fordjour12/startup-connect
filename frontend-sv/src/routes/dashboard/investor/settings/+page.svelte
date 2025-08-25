<script lang="ts">
   import { Badge } from "$lib/components/ui/badge";
   import {
      Card,
      CardContent,
      CardDescription,
      CardFooter,
      CardHeader,
      CardTitle,
   } from "$lib/components/ui/card";
   import { Button } from "$lib/components/ui/button";

   import {
      Avatar,
      AvatarFallback,
      AvatarImage,
   } from "$lib/components/ui/avatar";
   import { Input } from "$lib/components/ui/input";
   import { Label } from "$lib/components/ui/label";
   import { Switch } from "$lib/components/ui/switch";
   import { Separator } from "$lib/components/ui/separator";
   import { Textarea } from "$lib/components/ui/textarea";
   import { cn } from "$lib/utils";
   import {
      Bell,
      Shield,
      Eye,
      PaintBucket,
      Key,
      FileJson,
      Link2,
      Upload,
      Save,
      X,
   } from "@lucide/svelte";
   import type { PageData } from "./$types";

   // Get server-loaded data
   let { data }: { data: PageData } = $props();

   // Initialize reactive state from server data
   const profile = $state(data.profile);
   const notificationPreferences = $state(data.notificationPreferences);
   const securitySettings = $state(data.securitySettings);
   const privacySettings = $state(data.privacySettings);
   const appearanceSettings = $state(data.appearanceSettings);
   const apiAccess = $state(data.apiAccess);
   const integrations = $state(data.integrations);

   // Active tab state
   let activeTab = $state("profile");

   // Track if profile form has unsaved changes
   let hasUnsavedProfileChanges = $state(false);
   let editingProfile = $state({
      firstName: profile.firstName,
      lastName: profile.lastName,
      email: profile.email,
      phone: profile.phone,
      role: profile.role,
      firm: profile.firm,
      bio: profile.bio,
      location: profile.location,
      linkedIn: profile.linkedIn,
      twitter: profile.twitter,
      timeZone: profile.timeZone,
      investmentFocus: [...profile.investmentFocus],
      preferredStages: [...profile.preferredStages],
      typicalCheckSize: profile.typicalCheckSize,
   });

   // Track changes to profile form
   $effect(() => {
      hasUnsavedProfileChanges =
         editingProfile.firstName !== profile.firstName ||
         editingProfile.lastName !== profile.lastName ||
         editingProfile.email !== profile.email ||
         editingProfile.phone !== profile.phone ||
         editingProfile.role !== profile.role ||
         editingProfile.firm !== profile.firm ||
         editingProfile.bio !== profile.bio ||
         editingProfile.location !== profile.location ||
         editingProfile.linkedIn !== profile.linkedIn ||
         editingProfile.twitter !== profile.twitter ||
         editingProfile.timeZone !== profile.timeZone ||
         editingProfile.typicalCheckSize !== profile.typicalCheckSize ||
         !arraysEqual(
            editingProfile.investmentFocus,
            profile.investmentFocus,
         ) ||
         !arraysEqual(editingProfile.preferredStages, profile.preferredStages);
   });

   function arraysEqual(a: any[], b: any[]) {
      if (a.length !== b.length) return false;
      return a.every((val, index) => val === b[index]);
   }

   // Mock save function - in a real app, this would make an API call
   function saveProfile() {
      // Update the profile with edited values
      profile.firstName = editingProfile.firstName;
      profile.lastName = editingProfile.lastName;
      profile.email = editingProfile.email;
      profile.phone = editingProfile.phone;
      profile.role = editingProfile.role;
      profile.firm = editingProfile.firm;
      profile.bio = editingProfile.bio;
      profile.location = editingProfile.location;
      profile.linkedIn = editingProfile.linkedIn;
      profile.twitter = editingProfile.twitter;
      profile.timeZone = editingProfile.timeZone;
      profile.typicalCheckSize = editingProfile.typicalCheckSize;
      profile.investmentFocus = [...editingProfile.investmentFocus];
      profile.preferredStages = [...editingProfile.preferredStages];

      hasUnsavedProfileChanges = false;
   }

   function discardProfileChanges() {
      // Reset editing values to original profile
      editingProfile = {
         firstName: profile.firstName,
         lastName: profile.lastName,
         email: profile.email,
         phone: profile.phone,
         role: profile.role,
         firm: profile.firm,
         bio: profile.bio,
         location: profile.location,
         linkedIn: profile.linkedIn,
         twitter: profile.twitter,
         timeZone: profile.timeZone,
         investmentFocus: [...profile.investmentFocus],
         preferredStages: [...profile.preferredStages],
         typicalCheckSize: profile.typicalCheckSize,
      };

      hasUnsavedProfileChanges = false;
   }

   // Handle investment focus tags
   function removeInvestmentFocus(focus: string) {
      editingProfile.investmentFocus = editingProfile.investmentFocus.filter(
         (f) => f !== focus,
      );
   }

   function addInvestmentFocus(event: KeyboardEvent) {
      if (event.key === "Enter") {
         const input = event.target as HTMLInputElement;
         const value = input.value.trim();

         if (value && !editingProfile.investmentFocus.includes(value)) {
            editingProfile.investmentFocus = [
               ...editingProfile.investmentFocus,
               value,
            ];
            input.value = "";
         }

         event.preventDefault();
      }
   }

   // Handle preferred stages tags
   function removePreferredStage(stage: string) {
      editingProfile.preferredStages = editingProfile.preferredStages.filter(
         (s) => s !== stage,
      );
   }

   function addPreferredStage(event: KeyboardEvent) {
      if (event.key === "Enter") {
         const input = event.target as HTMLInputElement;
         const value = input.value.trim();

         if (value && !editingProfile.preferredStages.includes(value)) {
            editingProfile.preferredStages = [
               ...editingProfile.preferredStages,
               value,
            ];
            input.value = "";
         }

         event.preventDefault();
      }
   }
</script>

<div class="px-4 py-8">
   <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
   >
      <div>
         <h1 class="text-3xl font-bold mb-2">Settings</h1>
         <p class="text-muted-foreground mb-6">
            Manage your profile, preferences, and account settings
         </p>
      </div>
   </div>

   <div class="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-6">
      <!-- Sidebar -->
      <div class="md:col-span-1">
         <div class="bg-card rounded-lg shadow p-4 space-y-6">
            <!-- Settings Nav -->
            <nav class="flex flex-col space-y-1 w-full">
               <button
                  class={cn(
                     "flex items-center px-3 py-2 text-sm rounded-md transition-colors hover:bg-secondary",
                     activeTab === "profile"
                        ? "bg-secondary font-medium"
                        : "text-muted-foreground",
                  )}
                  onclick={() => (activeTab = "profile")}
               >
                  <Avatar class="h-4 w-4 mr-2">
                     <AvatarImage
                        src={profile.avatar}
                        alt={profile.firstName}
                     />
                     <AvatarFallback>{profile.firstName[0]}</AvatarFallback>
                  </Avatar>
                  Profile
               </button>

               <button
                  class={cn(
                     "flex items-center px-3 py-2 text-sm rounded-md transition-colors hover:bg-secondary",
                     activeTab === "notifications"
                        ? "bg-secondary font-medium"
                        : "text-muted-foreground",
                  )}
                  onclick={() => (activeTab = "notifications")}
               >
                  <Bell class="h-4 w-4 mr-2" />
                  Notifications
               </button>

               <button
                  class={cn(
                     "flex items-center px-3 py-2 text-sm rounded-md transition-colors hover:bg-secondary",
                     activeTab === "security"
                        ? "bg-secondary font-medium"
                        : "text-muted-foreground",
                  )}
                  onclick={() => (activeTab = "security")}
               >
                  <Shield class="h-4 w-4 mr-2" />
                  Security
               </button>

               <button
                  class={cn(
                     "flex items-center px-3 py-2 text-sm rounded-md transition-colors hover:bg-secondary",
                     activeTab === "privacy"
                        ? "bg-secondary font-medium"
                        : "text-muted-foreground",
                  )}
                  onclick={() => (activeTab = "privacy")}
               >
                  <Eye class="h-4 w-4 mr-2" />
                  Privacy
               </button>

               <button
                  class={cn(
                     "flex items-center px-3 py-2 text-sm rounded-md transition-colors hover:bg-secondary",
                     activeTab === "appearance"
                        ? "bg-secondary font-medium"
                        : "text-muted-foreground",
                  )}
                  onclick={() => (activeTab = "appearance")}
               >
                  <PaintBucket class="h-4 w-4 mr-2" />
                  Appearance
               </button>

               <button
                  class={cn(
                     "flex items-center px-3 py-2 text-sm rounded-md transition-colors hover:bg-secondary",
                     activeTab === "api"
                        ? "bg-secondary font-medium"
                        : "text-muted-foreground",
                  )}
                  onclick={() => (activeTab = "api")}
               >
                  <Key class="h-4 w-4 mr-2" />
                  API Access
               </button>

               <button
                  class={cn(
                     "flex items-center px-3 py-2 text-sm rounded-md transition-colors hover:bg-secondary",
                     activeTab === "integrations"
                        ? "bg-secondary font-medium"
                        : "text-muted-foreground",
                  )}
                  onclick={() => (activeTab = "integrations")}
               >
                  <Link2 class="h-4 w-4 mr-2" />
                  Integrations
               </button>
            </nav>
         </div>
      </div>

      <!-- Main Content -->
      <div class="md:col-span-3 lg:col-span-4">
         <Card class="shadow">
            <CardHeader class="pb-3">
               <div class="flex justify-between items-center">
                  <div>
                     <CardTitle>
                        {#if activeTab === "profile"}
                           Profile Settings
                        {:else if activeTab === "notifications"}
                           Notification Preferences
                        {:else if activeTab === "security"}
                           Security Settings
                        {:else if activeTab === "privacy"}
                           Privacy Settings
                        {:else if activeTab === "appearance"}
                           Appearance
                        {:else if activeTab === "api"}
                           API Access
                        {:else if activeTab === "integrations"}
                           Integrations
                        {/if}
                     </CardTitle>
                     <CardDescription>
                        {#if activeTab === "profile"}
                           Manage your personal information and investment
                           preferences
                        {:else if activeTab === "notifications"}
                           Control how you receive notifications
                        {:else if activeTab === "security"}
                           Protect your account and monitor activity
                        {:else if activeTab === "privacy"}
                           Manage how your data is used and viewed
                        {:else if activeTab === "appearance"}
                           Customize how your dashboard looks
                        {:else if activeTab === "api"}
                           Manage programmatic access to your data
                        {:else if activeTab === "integrations"}
                           Connect with other tools and services
                        {/if}
                     </CardDescription>
                  </div>
               </div>
            </CardHeader>

            <CardContent>
               {#if activeTab === "profile"}
                  <!-- Profile Settings Tab -->
                  <div class="space-y-6">
                     <div class="flex flex-col md:flex-row gap-8 items-start">
                        <!-- Profile Picture -->
                        <div class="flex flex-col items-center space-y-3">
                           <Avatar class="h-24 w-24">
                              <AvatarImage
                                 src={profile.avatar}
                                 alt={profile.firstName}
                              />
                              <AvatarFallback
                                 >{profile.firstName[0]}{profile
                                    .lastName[0]}</AvatarFallback
                              >
                           </Avatar>
                           <Button variant="outline" size="sm" class="text-xs">
                              <Upload class="h-3 w-3 mr-1" />
                              Change Photo
                           </Button>
                        </div>

                        <!-- Basic Information -->
                        <div class="flex-1 grid gap-4">
                           <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div class="space-y-2">
                                 <Label for="firstName">First Name</Label>
                                 <Input
                                    id="firstName"
                                    bind:value={editingProfile.firstName}
                                    placeholder="First Name"
                                 />
                              </div>

                              <div class="space-y-2">
                                 <Label for="lastName">Last Name</Label>
                                 <Input
                                    id="lastName"
                                    bind:value={editingProfile.lastName}
                                    placeholder="Last Name"
                                 />
                              </div>
                           </div>

                           <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div class="space-y-2">
                                 <Label for="email">Email</Label>
                                 <Input
                                    id="email"
                                    type="email"
                                    bind:value={editingProfile.email}
                                    placeholder="Email Address"
                                 />
                              </div>

                              <div class="space-y-2">
                                 <Label for="phone">Phone</Label>
                                 <Input
                                    id="phone"
                                    bind:value={editingProfile.phone}
                                    placeholder="Phone Number"
                                 />
                              </div>
                           </div>

                           <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div class="space-y-2">
                                 <Label for="role">Role</Label>
                                 <Input
                                    id="role"
                                    bind:value={editingProfile.role}
                                    placeholder="Your Role"
                                 />
                              </div>

                              <div class="space-y-2">
                                 <Label for="firm">Investment Firm</Label>
                                 <Input
                                    id="firm"
                                    bind:value={editingProfile.firm}
                                    placeholder="Firm Name"
                                 />
                              </div>
                           </div>

                           <div class="space-y-2">
                              <Label for="bio">Bio</Label>
                              <Textarea
                                 id="bio"
                                 bind:value={editingProfile.bio}
                                 placeholder="Brief description of your investment background"
                                 rows={3}
                              />
                           </div>
                        </div>
                     </div>

                     <Separator />

                     <!-- Additional Profile Information -->
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-6">
                           <div class="space-y-2">
                              <Label for="location">Location</Label>
                              <Input
                                 id="location"
                                 bind:value={editingProfile.location}
                                 placeholder="City, State, Country"
                              />
                           </div>

                           <div class="space-y-2">
                              <Label for="linkedin">LinkedIn</Label>
                              <Input
                                 id="linkedin"
                                 bind:value={editingProfile.linkedIn}
                                 placeholder="LinkedIn Profile URL"
                              />
                           </div>

                           <div class="space-y-2">
                              <Label for="twitter">Twitter</Label>
                              <Input
                                 id="twitter"
                                 bind:value={editingProfile.twitter}
                                 placeholder="Twitter Handle"
                              />
                           </div>

                           <div class="space-y-2">
                              <Label for="timezone">Time Zone</Label>
                              <Input
                                 id="timezone"
                                 bind:value={editingProfile.timeZone}
                                 placeholder="Your Time Zone"
                              />
                           </div>
                        </div>

                        <div class="space-y-6">
                           <div class="space-y-2">
                              <Label for="investment-focus"
                                 >Investment Focus</Label
                              >
                              <div class="flex flex-wrap gap-2 mb-2">
                                 {#each editingProfile.investmentFocus as focus}
                                    <Badge
                                       variant="secondary"
                                       class="flex items-center gap-1"
                                    >
                                       {focus}
                                       <button
                                          class="ml-1 h-3 w-3 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50 text-foreground/70"
                                          onclick={() =>
                                             removeInvestmentFocus(focus)}
                                       >
                                          <X class="h-3 w-3" />
                                       </button>
                                    </Badge>
                                 {/each}
                              </div>
                              <Input
                                 id="investment-focus"
                                 placeholder="Add focus area (press Enter to add)"
                                 onkeydown={addInvestmentFocus}
                              />
                           </div>

                           <div class="space-y-2">
                              <Label for="preferred-stages"
                                 >Preferred Stages</Label
                              >
                              <div class="flex flex-wrap gap-2 mb-2">
                                 {#each editingProfile.preferredStages as stage}
                                    <Badge
                                       variant="secondary"
                                       class="flex items-center gap-1"
                                    >
                                       {stage}
                                       <button
                                          class="ml-1 h-3 w-3 rounded-full bg-muted-foreground/30 hover:bg-muted-foreground/50 text-foreground/70"
                                          onclick={() =>
                                             removePreferredStage(stage)}
                                       >
                                          <X class="h-3 w-3" />
                                       </button>
                                    </Badge>
                                 {/each}
                              </div>
                              <Input
                                 id="preferred-stages"
                                 placeholder="Add preferred stage (press Enter to add)"
                                 onkeydown={addPreferredStage}
                              />
                           </div>

                           <div class="space-y-2">
                              <Label for="check-size">Typical Check Size</Label>
                              <Input
                                 id="check-size"
                                 bind:value={editingProfile.typicalCheckSize}
                                 placeholder="Typical Investment Amount"
                              />
                           </div>
                        </div>
                     </div>

                     <div
                        class="flex flex-col md:flex-row justify-end gap-2 mt-6"
                     >
                        {#if hasUnsavedProfileChanges}
                           <Button
                              variant="outline"
                              onclick={discardProfileChanges}
                           >
                              <X class="h-4 w-4 mr-2" />
                              Discard Changes
                           </Button>

                           <Button onclick={saveProfile}>
                              <Save class="h-4 w-4 mr-2" />
                              Save Changes
                           </Button>
                        {/if}
                     </div>
                  </div>
               {:else if activeTab === "notifications"}
                  <!-- Notifications Tab -->
                  <div class="space-y-8">
                     <!-- Email Notifications -->
                     <div class="space-y-4">
                        <h3 class="text-lg font-medium">Email Notifications</h3>
                        <div class="space-y-4 bg-secondary/10 p-4 rounded-md">
                           <div class="flex items-center justify-between">
                              <div class="space-y-0.5">
                                 <Label for="email-daily-digest"
                                    >Daily Digest</Label
                                 >
                                 <p class="text-sm text-muted-foreground">
                                    Receive a daily summary of your portfolio
                                    and activities
                                 </p>
                              </div>
                              <Switch
                                 id="email-daily-digest"
                                 checked={notificationPreferences.email
                                    .dailyDigest}
                                 onCheckedChange={(checked) =>
                                    (notificationPreferences.email.dailyDigest =
                                       checked)}
                              />
                           </div>

                           <Separator />

                           <div class="flex items-center justify-between">
                              <div class="space-y-0.5">
                                 <Label for="email-weekly-summary"
                                    >Weekly Portfolio Summary</Label
                                 >
                                 <p class="text-sm text-muted-foreground">
                                    Get a weekly overview of your portfolio
                                    performance
                                 </p>
                              </div>
                              <Switch
                                 id="email-weekly-summary"
                                 checked={notificationPreferences.email
                                    .weeklyPortfolioSummary}
                                 onCheckedChange={(checked) =>
                                    (notificationPreferences.email.weeklyPortfolioSummary =
                                       checked)}
                              />
                           </div>

                           <Separator />

                           <div class="flex items-center justify-between">
                              <div class="space-y-0.5">
                                 <Label for="email-investment-opps"
                                    >New Investment Opportunities</Label
                                 >
                                 <p class="text-sm text-muted-foreground">
                                    Be notified about new investment
                                    opportunities
                                 </p>
                              </div>
                              <Switch
                                 id="email-investment-opps"
                                 checked={notificationPreferences.email
                                    .newInvestmentOpportunities}
                                 onCheckedChange={(checked) =>
                                    (notificationPreferences.email.newInvestmentOpportunities =
                                       checked)}
                              />
                           </div>

                           <Separator />

                           <div class="flex items-center justify-between">
                              <div class="space-y-0.5">
                                 <Label for="email-company-updates"
                                    >Portfolio Company Updates</Label
                                 >
                                 <p class="text-sm text-muted-foreground">
                                    Get updates from your portfolio companies
                                 </p>
                              </div>
                              <Switch
                                 id="email-company-updates"
                                 checked={notificationPreferences.email
                                    .portfolioCompanyUpdates}
                                 onCheckedChange={(checked) =>
                                    (notificationPreferences.email.portfolioCompanyUpdates =
                                       checked)}
                              />
                           </div>

                           <Separator />

                           <div class="flex items-center justify-between">
                              <div class="space-y-0.5">
                                 <Label for="email-funding-rounds"
                                    >Funding Round Alerts</Label
                                 >
                                 <p class="text-sm text-muted-foreground">
                                    Be notified when companies open new funding
                                    rounds
                                 </p>
                              </div>
                              <Switch
                                 id="email-funding-rounds"
                                 checked={notificationPreferences.email
                                    .fundingRoundAlerts}
                                 onCheckedChange={(checked) =>
                                    (notificationPreferences.email.fundingRoundAlerts =
                                       checked)}
                              />
                           </div>

                           <Separator />

                           <div class="flex items-center justify-between">
                              <div class="space-y-0.5">
                                 <Label for="email-market-insights"
                                    >Market Insights</Label
                                 >
                                 <p class="text-sm text-muted-foreground">
                                    Receive industry news and market trends
                                 </p>
                              </div>
                              <Switch
                                 id="email-market-insights"
                                 checked={notificationPreferences.email
                                    .marketInsights}
                                 onCheckedChange={(checked) =>
                                    (notificationPreferences.email.marketInsights =
                                       checked)}
                              />
                           </div>

                           <Separator />

                           <div class="flex items-center justify-between">
                              <div class="space-y-0.5">
                                 <Label for="email-event-reminders"
                                    >Event Reminders</Label
                                 >
                                 <p class="text-sm text-muted-foreground">
                                    Get reminders about upcoming events and
                                    meetings
                                 </p>
                              </div>
                              <Switch
                                 id="email-event-reminders"
                                 checked={notificationPreferences.email
                                    .eventReminders}
                                 onCheckedChange={(checked) =>
                                    (notificationPreferences.email.eventReminders =
                                       checked)}
                              />
                           </div>

                           <Separator />

                           <div class="flex items-center justify-between">
                              <div class="space-y-0.5">
                                 <Label for="email-messages"
                                    >Message Notifications</Label
                                 >
                                 <p class="text-sm text-muted-foreground">
                                    Be notified about new messages from founders
                                    and team members
                                 </p>
                              </div>
                              <Switch
                                 id="email-messages"
                                 checked={notificationPreferences.email
                                    .messageNotifications}
                                 onCheckedChange={(checked) =>
                                    (notificationPreferences.email.messageNotifications =
                                       checked)}
                              />
                           </div>
                        </div>
                     </div>

                     <!-- In-App Notifications -->
                     <div class="space-y-4">
                        <h3 class="text-lg font-medium">
                           In-App Notifications
                        </h3>
                        <div class="space-y-4 bg-secondary/10 p-4 rounded-md">
                           <div class="flex items-center justify-between">
                              <div class="space-y-0.5">
                                 <Label for="app-opportunity-alerts"
                                    >Opportunity Alerts</Label
                                 >
                                 <p class="text-sm text-muted-foreground">
                                    Show alerts for new investment opportunities
                                 </p>
                              </div>
                              <Switch
                                 id="app-opportunity-alerts"
                                 checked={notificationPreferences.inApp
                                    .opportunityAlerts}
                                 onCheckedChange={(checked) =>
                                    (notificationPreferences.inApp.opportunityAlerts =
                                       checked)}
                              />
                           </div>

                           <Separator />

                           <div class="flex items-center justify-between">
                              <div class="space-y-0.5">
                                 <Label for="app-due-diligence"
                                    >Due Diligence Reminders</Label
                                 >
                                 <p class="text-sm text-muted-foreground">
                                    Get reminders about due diligence tasks
                                 </p>
                              </div>
                              <Switch
                                 id="app-due-diligence"
                                 checked={notificationPreferences.inApp
                                    .dueDiligenceReminders}
                                 onCheckedChange={(checked) =>
                                    (notificationPreferences.inApp.dueDiligenceReminders =
                                       checked)}
                              />
                           </div>

                           <Separator />

                           <div class="flex items-center justify-between">
                              <div class="space-y-0.5">
                                 <Label for="app-document-requests"
                                    >Document Requests</Label
                                 >
                                 <p class="text-sm text-muted-foreground">
                                    Be notified about document requests
                                 </p>
                              </div>
                              <Switch
                                 id="app-document-requests"
                                 checked={notificationPreferences.inApp
                                    .documentRequests}
                                 onCheckedChange={(checked) =>
                                    (notificationPreferences.inApp.documentRequests =
                                       checked)}
                              />
                           </div>

                           <Separator />

                           <div class="flex items-center justify-between">
                              <div class="space-y-0.5">
                                 <Label for="app-portfolio-metrics"
                                    >Portfolio Metric Alerts</Label
                                 >
                                 <p class="text-sm text-muted-foreground">
                                    Show alerts for significant portfolio metric
                                    changes
                                 </p>
                              </div>
                              <Switch
                                 id="app-portfolio-metrics"
                                 checked={notificationPreferences.inApp
                                    .portfolioMetricAlerts}
                                 onCheckedChange={(checked) =>
                                    (notificationPreferences.inApp.portfolioMetricAlerts =
                                       checked)}
                              />
                           </div>

                           <Separator />

                           <div class="flex items-center justify-between">
                              <div class="space-y-0.5">
                                 <Label for="app-team-messages"
                                    >Team Messages</Label
                                 >
                                 <p class="text-sm text-muted-foreground">
                                    Show notifications for team messages
                                 </p>
                              </div>
                              <Switch
                                 id="app-team-messages"
                                 checked={notificationPreferences.inApp
                                    .teamMessages}
                                 onCheckedChange={(checked) =>
                                    (notificationPreferences.inApp.teamMessages =
                                       checked)}
                              />
                           </div>

                           <Separator />

                           <div class="flex items-center justify-between">
                              <div class="space-y-0.5">
                                 <Label for="app-event-notifications"
                                    >Event Notifications</Label
                                 >
                                 <p class="text-sm text-muted-foreground">
                                    Show notifications for upcoming events
                                 </p>
                              </div>
                              <Switch
                                 id="app-event-notifications"
                                 checked={notificationPreferences.inApp
                                    .eventNotifications}
                                 onCheckedChange={(checked) =>
                                    (notificationPreferences.inApp.eventNotifications =
                                       checked)}
                              />
                           </div>

                           <Separator />

                           <div class="flex items-center justify-between">
                              <div class="space-y-0.5">
                                 <Label for="app-system-updates"
                                    >System Updates</Label
                                 >
                                 <p class="text-sm text-muted-foreground">
                                    Show notifications about platform updates
                                 </p>
                              </div>
                              <Switch
                                 id="app-system-updates"
                                 checked={notificationPreferences.inApp
                                    .systemUpdates}
                                 onCheckedChange={(checked) =>
                                    (notificationPreferences.inApp.systemUpdates =
                                       checked)}
                              />
                           </div>
                        </div>
                     </div>

                     <!-- Push Notifications -->
                     <div class="space-y-4">
                        <h3 class="text-lg font-medium">Push Notifications</h3>
                        <div class="space-y-4 bg-secondary/10 p-4 rounded-md">
                           <div class="flex items-center justify-between">
                              <div class="space-y-0.5">
                                 <Label for="push-enabled"
                                    >Enable Push Notifications</Label
                                 >
                                 <p class="text-sm text-muted-foreground">
                                    Enable push notifications on your devices
                                 </p>
                              </div>
                              <Switch
                                 id="push-enabled"
                                 checked={notificationPreferences
                                    .pushNotifications.enabled}
                                 onCheckedChange={(checked) =>
                                    (notificationPreferences.pushNotifications.enabled =
                                       checked)}
                              />
                           </div>

                           {#if notificationPreferences.pushNotifications.enabled}
                              <Separator />

                              <div class="flex items-center justify-between">
                                 <div class="space-y-0.5">
                                    <Label for="push-important-only"
                                       >Important Alerts Only</Label
                                    >
                                    <p class="text-sm text-muted-foreground">
                                       Only send push notifications for high
                                       priority alerts
                                    </p>
                                 </div>
                                 <Switch
                                    id="push-important-only"
                                    checked={notificationPreferences
                                       .pushNotifications.importantAlertsOnly}
                                    onCheckedChange={(checked) =>
                                       (notificationPreferences.pushNotifications.importantAlertsOnly =
                                          checked)}
                                 />
                              </div>
                           {/if}
                        </div>
                     </div>

                     <div class="flex justify-end mt-6">
                        <Button>
                           <Save class="h-4 w-4 mr-2" />
                           Save Notification Settings
                        </Button>
                     </div>
                  </div>
               {:else if activeTab === "security"}
                  <!-- Security Tab -->
                  <div class="space-y-8">
                     <!-- Password Management -->
                     <div class="space-y-4">
                        <h3 class="text-lg font-medium">Password Management</h3>
                        <div class="space-y-4 bg-secondary/10 p-4 rounded-md">
                           <div
                              class="flex flex-col md:flex-row md:items-center justify-between gap-4"
                           >
                              <div>
                                 <p class="text-sm">
                                    Last password change: <span
                                       class="font-medium"
                                       >{securitySettings.lastPasswordChange}</span
                                    >
                                 </p>
                                 <p class="text-xs text-muted-foreground mt-1">
                                    For security, it's recommended to change
                                    your password every 3 months
                                 </p>
                              </div>
                              <Button variant="outline" size="sm"
                                 >Change Password</Button
                              >
                           </div>
                        </div>
                     </div>

                     <!-- Two-Factor Authentication -->
                     <div class="space-y-4">
                        <h3 class="text-lg font-medium">
                           Two-Factor Authentication
                        </h3>
                        <div class="space-y-4 bg-secondary/10 p-4 rounded-md">
                           <div
                              class="flex flex-col md:flex-row md:items-center justify-between gap-4"
                           >
                              <div>
                                 <div class="flex items-center gap-2">
                                    <p class="text-sm">Status:</p>
                                    {#if profile.verifications.twoFactorEnabled}
                                       <Badge variant="default">Enabled</Badge>
                                    {:else}
                                       <Badge variant="destructive"
                                          >Disabled</Badge
                                       >
                                    {/if}
                                 </div>
                                 {#if profile.verifications.twoFactorEnabled}
                                    <p
                                       class="text-xs text-muted-foreground mt-1"
                                    >
                                       Current method: {securitySettings.twoFactorMethod}
                                    </p>
                                 {:else}
                                    <p
                                       class="text-xs text-muted-foreground mt-1"
                                    >
                                       Enable two-factor authentication to add
                                       an extra layer of security
                                    </p>
                                 {/if}
                              </div>
                              {#if profile.verifications.twoFactorEnabled}
                                 <Button variant="outline" size="sm"
                                    >Change Method</Button
                                 >
                              {:else}
                                 <Button size="sm">Set Up 2FA</Button>
                              {/if}
                           </div>
                        </div>
                     </div>

                     <!-- Active Sessions -->
                     <div class="space-y-4">
                        <h3 class="text-lg font-medium">Active Sessions</h3>
                        <div class="bg-secondary/10 p-4 rounded-md">
                           <div class="space-y-4">
                              {#each securitySettings.activeSessions as session}
                                 <div
                                    class="flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 bg-background rounded-md"
                                 >
                                    <div class="space-y-1">
                                       <p class="font-medium text-sm">
                                          {session.device}
                                       </p>
                                       <p class="text-xs text-muted-foreground">
                                          Location: {session.location}
                                       </p>
                                       <p class="text-xs text-muted-foreground">
                                          Last active: {new Date(
                                             session.lastActive,
                                          ).toLocaleString()}
                                       </p>
                                    </div>
                                    <div class="flex items-center gap-2">
                                       <Badge
                                          variant="outline"
                                          class="bg-primary/10"
                                          >Current Session</Badge
                                       >
                                       <Button
                                          variant="ghost"
                                          size="sm"
                                          class="text-destructive h-8"
                                          >Logout</Button
                                       >
                                    </div>
                                 </div>
                              {/each}

                              <Button
                                 variant="ghost"
                                 size="sm"
                                 class="text-destructive mt-2"
                                 >Logout of All Other Devices</Button
                              >
                           </div>
                        </div>
                     </div>

                     <!-- Login History -->
                     <div class="space-y-4">
                        <h3 class="text-lg font-medium">
                           Recent Login Activity
                        </h3>
                        <div
                           class="bg-secondary/10 p-4 rounded-md overflow-x-auto"
                        >
                           <table class="w-full text-sm">
                              <thead>
                                 <tr class="border-b">
                                    <th class="text-left font-medium py-2 px-2"
                                       >Date</th
                                    >
                                    <th class="text-left font-medium py-2 px-2"
                                       >Time</th
                                    >
                                    <th class="text-left font-medium py-2 px-2"
                                       >Device</th
                                    >
                                    <th class="text-left font-medium py-2 px-2"
                                       >Location</th
                                    >
                                    <th class="text-left font-medium py-2 px-2"
                                       >IP Address</th
                                    >
                                 </tr>
                              </thead>
                              <tbody>
                                 {#each securitySettings.loginHistory as login}
                                    <tr
                                       class="border-b hover:bg-secondary/5 transition-colors"
                                    >
                                       <td class="py-2 px-2">{login.date}</td>
                                       <td class="py-2 px-2">{login.time}</td>
                                       <td class="py-2 px-2">{login.device}</td>
                                       <td class="py-2 px-2"
                                          >{login.location}</td
                                       >
                                       <td class="py-2 px-2">{login.ip}</td>
                                    </tr>
                                 {/each}
                              </tbody>
                           </table>
                        </div>
                     </div>

                     <!-- Account Recovery -->
                     <div class="space-y-4">
                        <h3 class="text-lg font-medium">Account Recovery</h3>
                        <div class="space-y-4 bg-secondary/10 p-4 rounded-md">
                           <div class="flex flex-col">
                              <p class="text-sm mb-2">
                                 Recovery email is set to: <span
                                    class="font-medium">{profile.email}</span
                                 >
                              </p>
                              <Button
                                 variant="outline"
                                 size="sm"
                                 class="self-start"
                                 >Update Recovery Email</Button
                              >
                           </div>
                        </div>
                     </div>
                  </div>
               {:else if activeTab === "privacy"}
                  <!-- Privacy Tab -->
                  <div class="space-y-8">
                     <!-- Profile Visibility -->
                     <div class="space-y-4">
                        <h3 class="text-lg font-medium">Profile Visibility</h3>
                        <div class="space-y-4 bg-secondary/10 p-4 rounded-md">
                           <div class="space-y-4">
                              <div class="space-y-2">
                                 <Label>Who can see your investor profile</Label
                                 >
                                 <div
                                    class="grid grid-cols-1 md:grid-cols-2 gap-2"
                                 >
                                    <Button
                                       variant={privacySettings.profileVisibility ===
                                       "public"
                                          ? "default"
                                          : "outline"}
                                       class="justify-start h-auto py-2"
                                       onclick={() =>
                                          (privacySettings.profileVisibility =
                                             "public")}
                                    >
                                       <div
                                          class="flex flex-col items-start text-left"
                                       >
                                          <span>Public</span>
                                          <span
                                             class="text-xs font-normal text-muted-foreground"
                                             >Anyone can view your profile</span
                                          >
                                       </div>
                                    </Button>

                                    <Button
                                       variant={privacySettings.profileVisibility ===
                                       "network_only"
                                          ? "default"
                                          : "outline"}
                                       class="justify-start h-auto py-2"
                                       onclick={() =>
                                          (privacySettings.profileVisibility =
                                             "network_only")}
                                    >
                                       <div
                                          class="flex flex-col items-start text-left"
                                       >
                                          <span>Network Only</span>
                                          <span
                                             class="text-xs font-normal text-muted-foreground"
                                             >Only people in your network</span
                                          >
                                       </div>
                                    </Button>

                                    <Button
                                       variant={privacySettings.profileVisibility ===
                                       "verified_only"
                                          ? "default"
                                          : "outline"}
                                       class="justify-start h-auto py-2"
                                       onclick={() =>
                                          (privacySettings.profileVisibility =
                                             "verified_only")}
                                    >
                                       <div
                                          class="flex flex-col items-start text-left"
                                       >
                                          <span>Verified Only</span>
                                          <span
                                             class="text-xs font-normal text-muted-foreground"
                                             >Only verified founders and
                                             investors</span
                                          >
                                       </div>
                                    </Button>

                                    <Button
                                       variant={privacySettings.profileVisibility ===
                                       "private"
                                          ? "default"
                                          : "outline"}
                                       class="justify-start h-auto py-2"
                                       onclick={() =>
                                          (privacySettings.profileVisibility =
                                             "private")}
                                    >
                                       <div
                                          class="flex flex-col items-start text-left"
                                       >
                                          <span>Private</span>
                                          <span
                                             class="text-xs font-normal text-muted-foreground"
                                             >Only you can see your profile</span
                                          >
                                       </div>
                                    </Button>
                                 </div>
                              </div>

                              <div
                                 class="flex items-center justify-between pt-2"
                              >
                                 <div class="space-y-0.5">
                                    <Label for="investor-directory"
                                       >Show in Investor Directory</Label
                                    >
                                    <p class="text-sm text-muted-foreground">
                                       List your profile in the investor
                                       directory
                                    </p>
                                 </div>
                                 <Switch
                                    id="investor-directory"
                                    checked={privacySettings.showOnInvestorDirectory}
                                    onCheckedChange={(checked) =>
                                       (privacySettings.showOnInvestorDirectory =
                                          checked)}
                                 />
                              </div>
                           </div>
                        </div>
                     </div>

                     <!-- Investment History -->
                     <div class="space-y-4">
                        <h3 class="text-lg font-medium">Investment History</h3>
                        <div class="space-y-4 bg-secondary/10 p-4 rounded-md">
                           <div class="space-y-2">
                              <Label>Share your investment history</Label>
                              <div
                                 class="grid grid-cols-1 md:grid-cols-3 gap-2"
                              >
                                 <Button
                                    variant={privacySettings.shareInvestmentHistory ===
                                    "detailed"
                                       ? "default"
                                       : "outline"}
                                    class="justify-start h-auto py-2"
                                    onclick={() =>
                                       (privacySettings.shareInvestmentHistory =
                                          "detailed")}
                                 >
                                    <div
                                       class="flex flex-col items-start text-left"
                                    >
                                       <span>Detailed</span>
                                       <span
                                          class="text-xs font-normal text-muted-foreground"
                                          >Share full investment details</span
                                       >
                                    </div>
                                 </Button>

                                 <Button
                                    variant={privacySettings.shareInvestmentHistory ===
                                    "anonymous"
                                       ? "default"
                                       : "outline"}
                                    class="justify-start h-auto py-2"
                                    onclick={() =>
                                       (privacySettings.shareInvestmentHistory =
                                          "anonymous")}
                                 >
                                    <div
                                       class="flex flex-col items-start text-left"
                                    >
                                       <span>Anonymous</span>
                                       <span
                                          class="text-xs font-normal text-muted-foreground"
                                          >Share sector and stage only</span
                                       >
                                    </div>
                                 </Button>

                                 <Button
                                    variant={privacySettings.shareInvestmentHistory ===
                                    "none"
                                       ? "default"
                                       : "outline"}
                                    class="justify-start h-auto py-2"
                                    onclick={() =>
                                       (privacySettings.shareInvestmentHistory =
                                          "none")}
                                 >
                                    <div
                                       class="flex flex-col items-start text-left"
                                    >
                                       <span>None</span>
                                       <span
                                          class="text-xs font-normal text-muted-foreground"
                                          >Don't share investment history</span
                                       >
                                    </div>
                                 </Button>
                              </div>
                           </div>
                        </div>
                     </div>

                     <!-- Data Usage -->
                     <div class="space-y-4">
                        <h3 class="text-lg font-medium">Data Usage</h3>
                        <div class="space-y-4 bg-secondary/10 p-4 rounded-md">
                           <div class="flex items-center justify-between">
                              <div class="space-y-0.5">
                                 <Label for="data-analytics"
                                    >Allow Data Analytics</Label
                                 >
                                 <p class="text-sm text-muted-foreground">
                                    Allow anonymous usage data collection to
                                    improve the platform
                                 </p>
                              </div>
                              <Switch
                                 id="data-analytics"
                                 checked={privacySettings.allowDataAnalytics}
                                 onCheckedChange={(checked) =>
                                    (privacySettings.allowDataAnalytics =
                                       checked)}
                              />
                           </div>

                           <Separator />

                           <div class="space-y-2">
                              <Label>Data Retention Period</Label>
                              <div
                                 class="grid grid-cols-1 md:grid-cols-4 gap-2"
                              >
                                 <Button
                                    variant={privacySettings.dataRetentionPeriod ===
                                    "1_year"
                                       ? "default"
                                       : "outline"}
                                    class="justify-start"
                                    onclick={() =>
                                       (privacySettings.dataRetentionPeriod =
                                          "1_year")}
                                 >
                                    1 Year
                                 </Button>

                                 <Button
                                    variant={privacySettings.dataRetentionPeriod ===
                                    "3_years"
                                       ? "default"
                                       : "outline"}
                                    class="justify-start"
                                    onclick={() =>
                                       (privacySettings.dataRetentionPeriod =
                                          "3_years")}
                                 >
                                    3 Years
                                 </Button>

                                 <Button
                                    variant={privacySettings.dataRetentionPeriod ===
                                    "5_years"
                                       ? "default"
                                       : "outline"}
                                    class="justify-start"
                                    onclick={() =>
                                       (privacySettings.dataRetentionPeriod =
                                          "5_years")}
                                 >
                                    5 Years
                                 </Button>

                                 <Button
                                    variant={privacySettings.dataRetentionPeriod ===
                                    "indefinite"
                                       ? "default"
                                       : "outline"}
                                    class="justify-start"
                                    onclick={() =>
                                       (privacySettings.dataRetentionPeriod =
                                          "indefinite")}
                                 >
                                    Indefinite
                                 </Button>
                              </div>
                              <p class="text-xs text-muted-foreground mt-1">
                                 How long we retain your activity data after
                                 account closure
                              </p>
                           </div>
                        </div>
                     </div>

                     <div class="space-y-4">
                        <h3 class="text-lg font-medium">Data Management</h3>
                        <div class="space-y-4 bg-secondary/10 p-4 rounded-md">
                           <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <Button variant="outline" class="justify-start">
                                 Download My Data
                              </Button>

                              <Button
                                 variant="outline"
                                 class="justify-start text-destructive hover:text-destructive"
                              >
                                 Delete Account
                              </Button>
                           </div>
                        </div>
                     </div>

                     <div class="flex justify-end mt-6">
                        <Button>
                           <Save class="h-4 w-4 mr-2" />
                           Save Privacy Settings
                        </Button>
                     </div>
                  </div>
               {:else if activeTab === "appearance"}
                  <!-- Appearance Tab -->
                  <div class="space-y-8">
                     <!-- Theme Settings -->
                     <div class="space-y-4">
                        <h3 class="text-lg font-medium">Theme</h3>
                        <div class="space-y-4 bg-secondary/10 p-4 rounded-md">
                           <div class="space-y-2">
                              <Label>Color Theme</Label>
                              <div
                                 class="grid grid-cols-1 md:grid-cols-3 gap-2"
                              >
                                 <Button
                                    variant={appearanceSettings.theme ===
                                    "light"
                                       ? "default"
                                       : "outline"}
                                    class="justify-start h-auto py-2"
                                    onclick={() =>
                                       (appearanceSettings.theme = "light")}
                                 >
                                    <div
                                       class="flex flex-col items-start text-left"
                                    >
                                       <span>Light</span>
                                       <span
                                          class="text-xs font-normal text-muted-foreground"
                                       >
                                          Light background with dark text
                                       </span>
                                    </div>
                                 </Button>

                                 <Button
                                    variant={appearanceSettings.theme === "dark"
                                       ? "default"
                                       : "outline"}
                                    class="justify-start h-auto py-2"
                                    onclick={() =>
                                       (appearanceSettings.theme = "dark")}
                                 >
                                    <div
                                       class="flex flex-col items-start text-left"
                                    >
                                       <span>Dark</span>
                                       <span
                                          class="text-xs font-normal text-muted-foreground"
                                       >
                                          Dark background with light text
                                       </span>
                                    </div>
                                 </Button>

                                 <Button
                                    variant={appearanceSettings.theme ===
                                    "system"
                                       ? "default"
                                       : "outline"}
                                    class="justify-start h-auto py-2"
                                    onclick={() =>
                                       (appearanceSettings.theme = "system")}
                                 >
                                    <div
                                       class="flex flex-col items-start text-left"
                                    >
                                       <span>System</span>
                                       <span
                                          class="text-xs font-normal text-muted-foreground"
                                       >
                                          Follow your system settings
                                       </span>
                                    </div>
                                 </Button>
                              </div>
                           </div>

                           <Separator />

                           <div class="space-y-2">
                              <Label>Color Accent</Label>
                              <div
                                 class="grid grid-cols-2 md:grid-cols-4 gap-4"
                              >
                                 {#each appearanceSettings.availableAccents as accent}
                                    <div
                                       role="button"
                                       tabindex="0"
                                       class="flex flex-col items-center gap-2 cursor-pointer"
                                       onclick={() =>
                                          (appearanceSettings.accentColor =
                                             accent.value)}
                                    >
                                       <div
                                          class={`w-12 h-12 rounded-full border-2 ${
                                             appearanceSettings.accentColor ===
                                             accent.value
                                                ? "border-primary ring-2 ring-primary/30"
                                                : "border-border"
                                          }`}
                                          style={`background-color: ${accent.preview}`}
                                       ></div>
                                       <span class="text-xs">{accent.name}</span
                                       >
                                    </div>
                                 {/each}
                              </div>
                           </div>
                        </div>
                     </div>

                     <!-- Layout Settings -->
                     <div class="space-y-4">
                        <h3 class="text-lg font-medium">Layout</h3>
                        <div class="space-y-4 bg-secondary/10 p-4 rounded-md">
                           <div class="space-y-2">
                              <Label>Dashboard Layout</Label>
                              <div
                                 class="grid grid-cols-1 md:grid-cols-3 gap-2"
                              >
                                 <Button
                                    variant={appearanceSettings.layout ===
                                    "default"
                                       ? "default"
                                       : "outline"}
                                    class="justify-start h-auto py-2"
                                    onclick={() =>
                                       (appearanceSettings.layout = "default")}
                                 >
                                    <div
                                       class="flex flex-col items-start text-left"
                                    >
                                       <span>Default</span>
                                       <span
                                          class="text-xs font-normal text-muted-foreground"
                                       >
                                          Standard dashboard layout
                                       </span>
                                    </div>
                                 </Button>

                                 <Button
                                    variant={appearanceSettings.layout ===
                                    "compact"
                                       ? "default"
                                       : "outline"}
                                    class="justify-start h-auto py-2"
                                    onclick={() =>
                                       (appearanceSettings.layout = "compact")}
                                 >
                                    <div
                                       class="flex flex-col items-start text-left"
                                    >
                                       <span>Compact</span>
                                       <span
                                          class="text-xs font-normal text-muted-foreground"
                                       >
                                          Minimized spacing and elements
                                       </span>
                                    </div>
                                 </Button>

                                 <Button
                                    variant={appearanceSettings.layout ===
                                    "comfortable"
                                       ? "default"
                                       : "outline"}
                                    class="justify-start h-auto py-2"
                                    onclick={() =>
                                       (appearanceSettings.layout =
                                          "comfortable")}
                                 >
                                    <div
                                       class="flex flex-col items-start text-left"
                                    >
                                       <span>Comfortable</span>
                                       <span
                                          class="text-xs font-normal text-muted-foreground"
                                       >
                                          Extra breathing room
                                       </span>
                                    </div>
                                 </Button>
                              </div>
                           </div>

                           <Separator />

                           <div class="flex items-center justify-between">
                              <div class="space-y-0.5">
                                 <Label for="sidebar-collapsed"
                                    >Collapsed Sidebar by Default</Label
                                 >
                                 <p class="text-sm text-muted-foreground">
                                    Start with a minimized sidebar
                                 </p>
                              </div>
                              <Switch
                                 id="sidebar-collapsed"
                                 checked={appearanceSettings.sidebarCollapsed}
                                 onCheckedChange={(checked) =>
                                    (appearanceSettings.sidebarCollapsed =
                                       checked)}
                              />
                           </div>

                           <Separator />

                           <div class="flex items-center justify-between">
                              <div class="space-y-0.5">
                                 <Label for="compact-cards">Compact Cards</Label
                                 >
                                 <p class="text-sm text-muted-foreground">
                                    Use smaller card sizes throughout the
                                    interface
                                 </p>
                              </div>
                              <Switch
                                 id="compact-cards"
                                 checked={appearanceSettings.compactCards}
                                 onCheckedChange={(checked) =>
                                    (appearanceSettings.compactCards = checked)}
                              />
                           </div>
                        </div>
                     </div>

                     <!-- Data Visualization -->
                     <div class="space-y-4">
                        <h3 class="text-lg font-medium">Data Visualization</h3>
                        <div class="space-y-4 bg-secondary/10 p-4 rounded-md">
                           <div class="space-y-2">
                              <Label>Chart Style</Label>
                              <div
                                 class="grid grid-cols-1 md:grid-cols-3 gap-2"
                              >
                                 <Button
                                    variant={appearanceSettings.chartStyle ===
                                    "modern"
                                       ? "default"
                                       : "outline"}
                                    class="justify-start h-auto py-2"
                                    onclick={() =>
                                       (appearanceSettings.chartStyle =
                                          "modern")}
                                 >
                                    <div
                                       class="flex flex-col items-start text-left"
                                    >
                                       <span>Modern</span>
                                       <span
                                          class="text-xs font-normal text-muted-foreground"
                                       >
                                          Sleek, contemporary visualizations
                                       </span>
                                    </div>
                                 </Button>

                                 <Button
                                    variant={appearanceSettings.chartStyle ===
                                    "classic"
                                       ? "default"
                                       : "outline"}
                                    class="justify-start h-auto py-2"
                                    onclick={() =>
                                       (appearanceSettings.chartStyle =
                                          "classic")}
                                 >
                                    <div
                                       class="flex flex-col items-start text-left"
                                    >
                                       <span>Classic</span>
                                       <span
                                          class="text-xs font-normal text-muted-foreground"
                                       >
                                          Traditional chart formats
                                       </span>
                                    </div>
                                 </Button>

                                 <Button
                                    variant={appearanceSettings.chartStyle ===
                                    "minimal"
                                       ? "default"
                                       : "outline"}
                                    class="justify-start h-auto py-2"
                                    onclick={() =>
                                       (appearanceSettings.chartStyle =
                                          "minimal")}
                                 >
                                    <div
                                       class="flex flex-col items-start text-left"
                                    >
                                       <span>Minimal</span>
                                       <span
                                          class="text-xs font-normal text-muted-foreground"
                                       >
                                          Simplified, data-focused display
                                       </span>
                                    </div>
                                 </Button>
                              </div>
                           </div>

                           <Separator />

                           <div class="flex items-center justify-between">
                              <div class="space-y-0.5">
                                 <Label for="data-animations"
                                    >Data Animations</Label
                                 >
                                 <p class="text-sm text-muted-foreground">
                                    Enable smooth transitions in charts and data
                                    displays
                                 </p>
                              </div>
                              <Switch
                                 id="data-animations"
                                 checked={appearanceSettings.dataAnimations}
                                 onCheckedChange={(checked) =>
                                    (appearanceSettings.dataAnimations =
                                       checked)}
                              />
                           </div>

                           <Separator />

                           <div class="flex items-center justify-between">
                              <div class="space-y-0.5">
                                 <Label for="reduced-motion"
                                    >Reduced Motion</Label
                                 >
                                 <p class="text-sm text-muted-foreground">
                                    Minimize animations throughout the interface
                                 </p>
                              </div>
                              <Switch
                                 id="reduced-motion"
                                 checked={appearanceSettings.reducedMotion}
                                 onCheckedChange={(checked) =>
                                    (appearanceSettings.reducedMotion =
                                       checked)}
                              />
                           </div>
                        </div>
                     </div>

                     <div class="flex justify-end mt-6">
                        <Button>
                           <Save class="h-4 w-4 mr-2" />
                           Save Appearance Settings
                        </Button>
                     </div>
                  </div>
               {:else if activeTab === "api"}
                  <!-- API Access Tab -->
                  <div class="space-y-8">
                     <!-- API Status -->
                     <div class="space-y-4">
                        <h3 class="text-lg font-medium">API Access</h3>
                        <div class="space-y-4 bg-secondary/10 p-4 rounded-md">
                           <div class="flex items-center justify-between">
                              <div class="space-y-0.5">
                                 <Label for="api-enabled"
                                    >Enable API Access</Label
                                 >
                                 <p class="text-sm text-muted-foreground">
                                    Allow external applications to access your
                                    data via API
                                 </p>
                              </div>
                              <Switch
                                 id="api-enabled"
                                 checked={apiAccess.enabled}
                                 onCheckedChange={(checked) =>
                                    (apiAccess.enabled = checked)}
                              />
                           </div>

                           {#if apiAccess.enabled}
                              <Separator />

                              <div class="bg-card/50 p-4 rounded-md">
                                 <div class="flex flex-col space-y-2">
                                    <div
                                       class="flex items-center justify-between"
                                    >
                                       <Label>API Key</Label>
                                       {#if apiAccess.keyVisible}
                                          <Button
                                             variant="ghost"
                                             size="sm"
                                             class="h-8 text-xs"
                                             onclick={() =>
                                                (apiAccess.keyVisible = false)}
                                          >
                                             Hide
                                          </Button>
                                       {:else}
                                          <Button
                                             variant="ghost"
                                             size="sm"
                                             class="h-8 text-xs"
                                             onclick={() =>
                                                (apiAccess.keyVisible = true)}
                                          >
                                             Show
                                          </Button>
                                       {/if}
                                    </div>
                                    <div class="flex items-center gap-2">
                                       <Input
                                          value={apiAccess.keyVisible
                                             ? apiAccess.apiKey
                                             : "••••••••••••••••••••••••"}
                                          readonly
                                          class="font-mono text-sm"
                                       />
                                       <Button
                                          variant="outline"
                                          size="sm"
                                          class="shrink-0"
                                       >
                                          Copy
                                       </Button>
                                    </div>
                                    <p
                                       class="text-xs text-muted-foreground mt-1"
                                    >
                                       Created on: {apiAccess.keyCreatedAt}
                                    </p>
                                 </div>
                              </div>

                              <div class="flex flex-col space-y-2">
                                 <Button variant="outline" class="self-start">
                                    Regenerate API Key
                                 </Button>
                                 <p class="text-xs text-muted-foreground">
                                    Warning: Regenerating your API key will
                                    invalidate any existing integrations
                                 </p>
                              </div>
                           {/if}
                        </div>
                     </div>

                     {#if apiAccess.enabled}
                        <!-- Access Permissions -->
                        <div class="space-y-4">
                           <h3 class="text-lg font-medium">
                              Access Permissions
                           </h3>
                           <div
                              class="space-y-4 bg-secondary/10 p-4 rounded-md"
                           >
                              <div class="space-y-4">
                                 <div class="flex items-center justify-between">
                                    <div class="space-y-0.5">
                                       <Label for="read-portfolio"
                                          >Portfolio Read Access</Label
                                       >
                                       <p class="text-sm text-muted-foreground">
                                          Allow API clients to read your
                                          portfolio data
                                       </p>
                                    </div>
                                    <Switch
                                       id="read-portfolio"
                                       checked={apiAccess.permissions
                                          .readPortfolio}
                                       onCheckedChange={(checked) =>
                                          (apiAccess.permissions.readPortfolio =
                                             checked)}
                                    />
                                 </div>

                                 <Separator />

                                 <div class="flex items-center justify-between">
                                    <div class="space-y-0.5">
                                       <Label for="write-portfolio"
                                          >Portfolio Write Access</Label
                                       >
                                       <p class="text-sm text-muted-foreground">
                                          Allow API clients to modify your
                                          portfolio data
                                       </p>
                                    </div>
                                    <Switch
                                       id="write-portfolio"
                                       checked={apiAccess.permissions
                                          .writePortfolio}
                                       onCheckedChange={(checked) =>
                                          (apiAccess.permissions.writePortfolio =
                                             checked)}
                                    />
                                 </div>

                                 <Separator />

                                 <div class="flex items-center justify-between">
                                    <div class="space-y-0.5">
                                       <Label for="read-pipeline"
                                          >Pipeline Read Access</Label
                                       >
                                       <p class="text-sm text-muted-foreground">
                                          Allow API clients to read your deal
                                          pipeline
                                       </p>
                                    </div>
                                    <Switch
                                       id="read-pipeline"
                                       checked={apiAccess.permissions
                                          .readPipeline}
                                       onCheckedChange={(checked) =>
                                          (apiAccess.permissions.readPipeline =
                                             checked)}
                                    />
                                 </div>

                                 <Separator />

                                 <div class="flex items-center justify-between">
                                    <div class="space-y-0.5">
                                       <Label for="write-pipeline"
                                          >Pipeline Write Access</Label
                                       >
                                       <p class="text-sm text-muted-foreground">
                                          Allow API clients to modify your deal
                                          pipeline
                                       </p>
                                    </div>
                                    <Switch
                                       id="write-pipeline"
                                       checked={apiAccess.permissions
                                          .writePipeline}
                                       onCheckedChange={(checked) =>
                                          (apiAccess.permissions.writePipeline =
                                             checked)}
                                    />
                                 </div>

                                 <Separator />

                                 <div class="flex items-center justify-between">
                                    <div class="space-y-0.5">
                                       <Label for="read-calendar"
                                          >Calendar Read Access</Label
                                       >
                                       <p class="text-sm text-muted-foreground">
                                          Allow API clients to read your
                                          calendar data
                                       </p>
                                    </div>
                                    <Switch
                                       id="read-calendar"
                                       checked={apiAccess.permissions
                                          .readCalendar}
                                       onCheckedChange={(checked) =>
                                          (apiAccess.permissions.readCalendar =
                                             checked)}
                                    />
                                 </div>

                                 <Separator />

                                 <div class="flex items-center justify-between">
                                    <div class="space-y-0.5">
                                       <Label for="write-calendar"
                                          >Calendar Write Access</Label
                                       >
                                       <p class="text-sm text-muted-foreground">
                                          Allow API clients to modify your
                                          calendar
                                       </p>
                                    </div>
                                    <Switch
                                       id="write-calendar"
                                       checked={apiAccess.permissions
                                          .writeCalendar}
                                       onCheckedChange={(checked) =>
                                          (apiAccess.permissions.writeCalendar =
                                             checked)}
                                    />
                                 </div>
                              </div>
                           </div>
                        </div>

                        <!-- API Usage -->
                        <div class="space-y-4">
                           <h3 class="text-lg font-medium">API Usage</h3>
                           <div class="bg-secondary/10 p-4 rounded-md">
                              <div class="space-y-4">
                                 <div>
                                    <div
                                       class="flex items-center justify-between mb-2"
                                    >
                                       <span class="text-sm font-medium"
                                          >Requests this month</span
                                       >
                                       <span class="text-sm"
                                          >{apiAccess.usage.requestsThisMonth} /
                                          {apiAccess.usage.monthlyLimit}</span
                                       >
                                    </div>
                                    <div
                                       class="w-full bg-muted rounded-full h-2"
                                    >
                                       <div
                                          class="bg-primary h-2 rounded-full"
                                          style={`width: ${Math.min(100, (apiAccess.usage.requestsThisMonth / apiAccess.usage.monthlyLimit) * 100)}%`}
                                       ></div>
                                    </div>
                                    <p
                                       class="text-xs text-muted-foreground mt-1"
                                    >
                                       Plan resets on {apiAccess.usage
                                          .resetDate}
                                    </p>
                                 </div>

                                 <div class="bg-card/50 p-4 rounded-md">
                                    <h4 class="text-sm font-medium mb-3">
                                       Recent API Activity
                                    </h4>
                                    {#if apiAccess.usage.recentActivity.length > 0}
                                       <div class="space-y-2">
                                          {#each apiAccess.usage.recentActivity as activity, i}
                                             <div
                                                class="flex items-center justify-between text-sm"
                                             >
                                                <div>
                                                   <span class="font-medium"
                                                      >{activity.endpoint}</span
                                                   >
                                                   <span
                                                      class="text-xs text-muted-foreground ml-2"
                                                      >{activity.method}</span
                                                   >
                                                </div>
                                                <div
                                                   class="text-xs text-muted-foreground"
                                                >
                                                   {activity.timestamp}
                                                </div>
                                             </div>
                                             {#if i < apiAccess.usage.recentActivity.length - 1}
                                                <Separator />
                                             {/if}
                                          {/each}
                                       </div>
                                    {:else}
                                       <p class="text-sm text-muted-foreground">
                                          No recent activity
                                       </p>
                                    {/if}
                                 </div>

                                 <div class="pt-2">
                                    <Button
                                       variant="outline"
                                       size="sm"
                                       class="text-xs"
                                    >
                                       <FileJson class="h-3 w-3 mr-1" />
                                       View Complete API Logs
                                    </Button>
                                 </div>
                              </div>
                           </div>
                        </div>

                        <!-- API Documentation -->
                        <div class="space-y-4">
                           <h3 class="text-lg font-medium">Documentation</h3>
                           <div
                              class="space-y-4 bg-secondary/10 p-4 rounded-md"
                           >
                              <p class="text-sm">
                                 Access our comprehensive API documentation to
                                 integrate with our platform.
                              </p>
                              <div class="flex flex-wrap gap-2">
                                 <Button variant="outline">
                                    API Reference
                                 </Button>
                                 <Button variant="outline">
                                    Developer Guide
                                 </Button>
                                 <Button variant="outline">
                                    Example Integrations
                                 </Button>
                              </div>
                           </div>
                        </div>
                     {/if}

                     <div class="flex justify-end mt-6">
                        <Button>
                           <Save class="h-4 w-4 mr-2" />
                           Save API Settings
                        </Button>
                     </div>
                  </div>
               {:else if activeTab === "integrations"}
                  <!-- Integrations Tab -->
                  <div class="space-y-8">
                     <!-- Connected Services -->
                     <div class="space-y-4">
                        <h3 class="text-lg font-medium">Connected Services</h3>
                        <div class="space-y-6 bg-secondary/10 p-4 rounded-md">
                           {#each integrations.connectedServices as service}
                              <div
                                 class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-4 bg-card rounded-md"
                              >
                                 <div class="flex items-center gap-3">
                                    <div
                                       class="w-10 h-10 rounded-md bg-secondary flex items-center justify-center"
                                    >
                                       <img
                                          src={service.icon}
                                          alt={service.name}
                                          class="w-6 h-6"
                                       />
                                    </div>
                                    <div>
                                       <h4 class="text-base font-medium">
                                          {service.name}
                                       </h4>
                                       <p class="text-sm text-muted-foreground">
                                          {service.status === "connected"
                                             ? `Connected on ${service.connectedSince}`
                                             : "Not connected"}
                                       </p>
                                    </div>
                                 </div>
                                 <div
                                    class="flex items-center gap-2 self-end md:self-auto"
                                 >
                                    {#if service.status === "connected"}
                                       <Badge
                                          variant="outline"
                                          class="bg-primary/10">Connected</Badge
                                       >
                                       <Button variant="outline" size="sm"
                                          >Disconnect</Button
                                       >
                                    {:else}
                                       <Button size="sm">Connect</Button>
                                    {/if}
                                 </div>
                              </div>
                           {/each}
                        </div>
                     </div>

                     <!-- Available Integrations -->
                     <div class="space-y-4">
                        <h3 class="text-lg font-medium">
                           Available Integrations
                        </h3>
                        <div class="space-y-4 bg-secondary/10 p-4 rounded-md">
                           <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {#each integrations.availableIntegrations as integration}
                                 <div
                                    class="flex items-start gap-3 p-4 bg-card rounded-md"
                                 >
                                    <div
                                       class="w-10 h-10 rounded-md bg-secondary flex items-center justify-center shrink-0"
                                    >
                                       <img
                                          src={integration.icon}
                                          alt={integration.name}
                                          class="w-6 h-6"
                                       />
                                    </div>
                                    <div class="space-y-2">
                                       <h4 class="text-base font-medium">
                                          {integration.name}
                                       </h4>
                                       <p class="text-sm text-muted-foreground">
                                          {integration.description}
                                       </p>
                                       <Button
                                          size="sm"
                                          variant="outline"
                                          class="mt-2"
                                       >
                                          Learn More
                                       </Button>
                                    </div>
                                 </div>
                              {/each}
                           </div>
                        </div>
                     </div>

                     <!-- Data Sync -->
                     <div class="space-y-4">
                        <h3 class="text-lg font-medium">
                           Data Synchronization
                        </h3>
                        <div class="space-y-4 bg-secondary/10 p-4 rounded-md">
                           <div class="flex items-center justify-between">
                              <div class="space-y-0.5">
                                 <Label for="auto-sync">Automatic Sync</Label>
                                 <p class="text-sm text-muted-foreground">
                                    Automatically sync data between connected
                                    services
                                 </p>
                              </div>
                              <Switch
                                 id="auto-sync"
                                 checked={integrations.syncSettings.autoSync}
                                 onCheckedChange={(checked) =>
                                    (integrations.syncSettings.autoSync =
                                       checked)}
                              />
                           </div>

                           <Separator />

                           <div class="space-y-2">
                              <Label>Sync Frequency</Label>
                              <div
                                 class="grid grid-cols-1 md:grid-cols-4 gap-2"
                              >
                                 <Button
                                    variant={integrations.syncSettings
                                       .frequency === "hourly"
                                       ? "default"
                                       : "outline"}
                                    class="justify-start"
                                    onclick={() =>
                                       (integrations.syncSettings.frequency =
                                          "hourly")}
                                 >
                                    Hourly
                                 </Button>

                                 <Button
                                    variant={integrations.syncSettings
                                       .frequency === "daily"
                                       ? "default"
                                       : "outline"}
                                    class="justify-start"
                                    onclick={() =>
                                       (integrations.syncSettings.frequency =
                                          "daily")}
                                 >
                                    Daily
                                 </Button>

                                 <Button
                                    variant={integrations.syncSettings
                                       .frequency === "weekly"
                                       ? "default"
                                       : "outline"}
                                    class="justify-start"
                                    onclick={() =>
                                       (integrations.syncSettings.frequency =
                                          "weekly")}
                                 >
                                    Weekly
                                 </Button>

                                 <Button
                                    variant={integrations.syncSettings
                                       .frequency === "monthly"
                                       ? "default"
                                       : "outline"}
                                    class="justify-start"
                                    onclick={() =>
                                       (integrations.syncSettings.frequency =
                                          "monthly")}
                                 >
                                    Monthly
                                 </Button>
                              </div>
                           </div>

                           <Separator />

                           <div class="pt-2">
                              <Button>Sync Now</Button>
                              <p class="text-xs text-muted-foreground mt-2">
                                 Last synchronized: {integrations.syncSettings
                                    .lastSync}
                              </p>
                           </div>
                        </div>
                     </div>

                     <div class="flex justify-end mt-6">
                        <Button>
                           <Save class="h-4 w-4 mr-2" />
                           Save Integration Settings
                        </Button>
                     </div>
                  </div>
               {/if}
            </CardContent>
         </Card>
      </div>
   </div>
</div>
