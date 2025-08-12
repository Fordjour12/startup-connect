<script lang="ts">
   import { onboardingState } from "@/hooks/onboarding-state.svelte";
   import { Button } from "@/components/ui/button";
   import { Input } from "@/components/ui/input";
   import { Label } from "@/components/ui/label";
   import { Textarea } from "@/components/ui/textarea";
   import {
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardTitle,
   } from "@/components/ui/card";
   import { User, FileText } from "@lucide/svelte";
   import { cn } from "@/utils";
   import {
      basicInfoSchema,
      type BasicInfo,
   } from "@/z-schema/onboarding-schema";
   import { onMount } from "svelte";
   import { toast } from "svelte-sonner";
   import { z } from "zod";

   let { data } = $props();

   // Form data with proper typing
   let formData = $state<BasicInfo>({
      name: "",
      email: "",
      location: "",
      bio: "",
      jobTitle: "",
      industry: "",
      education: "",
      phone: "",
      twitterHandle: "",
      linkedinUrl: "",
      githubProfile: "",
      portfolioWebsite: "",
      city: "",
      timezone: "",
      languages: [],
      employmentStatus: "",
   });

   // Validation state
   let validationErrors = $state<Record<string, string>>({});

   // Initialize form with user data and saved progress
   /*
   $effect(() => {

      // Populate with user data if available
      if (data.user) {
         formData = {
            name: data.user.name || "",
            email: data.user.email || "",
            location: onboardingState.formData.basicInfo.location || "",
            bio: onboardingState.formData.basicInfo.bio || "",
            jobTitle: onboardingState.formData.basicInfo.jobTitle || "",
            industry: onboardingState.formData.basicInfo.industry || "",
            education: onboardingState.formData.basicInfo.education || "",
            phone: onboardingState.formData.basicInfo.phone || "",
            twitterHandle:
               onboardingState.formData.basicInfo.twitterHandle || "",
            linkedinUrl: onboardingState.formData.basicInfo.linkedinUrl || "",
            githubProfile:
               onboardingState.formData.basicInfo.githubProfile || "",
            portfolioWebsite:
               onboardingState.formData.basicInfo.portfolioWebsite || "",
            city: onboardingState.formData.basicInfo.city || "",
            timezone: onboardingState.formData.basicInfo.timezone || "",
            languages: onboardingState.formData.basicInfo.languages || [],
            employmentStatus:
               onboardingState.formData.basicInfo.employmentStatus || "",
            companyStage: onboardingState.formData.basicInfo.companyStage || "",
            teamSize: onboardingState.formData.basicInfo.teamSize,
         };
      } else {
         // Use saved progress if no user data
         formData = {
            name: onboardingState.formData.basicInfo.name || "",
            email: onboardingState.formData.basicInfo.email || "",
            location: onboardingState.formData.basicInfo.location || "",
            bio: onboardingState.formData.basicInfo.bio || "",
            jobTitle: onboardingState.formData.basicInfo.jobTitle || "",
            industry: onboardingState.formData.basicInfo.industry || "",
            education: onboardingState.formData.basicInfo.education || "",
            phone: onboardingState.formData.basicInfo.phone || "",
            twitterHandle:
               onboardingState.formData.basicInfo.twitterHandle || "",
            linkedinUrl: onboardingState.formData.basicInfo.linkedinUrl || "",
            githubProfile:
               onboardingState.formData.basicInfo.githubProfile || "",
            portfolioWebsite:
               onboardingState.formData.basicInfo.portfolioWebsite || "",
            city: onboardingState.formData.basicInfo.city || "",
            timezone: onboardingState.formData.basicInfo.timezone || "",
            languages: onboardingState.formData.basicInfo.languages || [],
            employmentStatus:
               onboardingState.formData.basicInfo.employmentStatus || "",
            companyStage: onboardingState.formData.basicInfo.companyStage || "",
            teamSize: onboardingState.formData.basicInfo.teamSize,
         };
      }
   }); */

   // Validate form using Zod
   function validateForm(): boolean {
      try {
         basicInfoSchema.parse(formData);
         validationErrors = {};
         return true;
      } catch (error) {
         if (error instanceof z.ZodError) {
            const zodErrors = error.errors;
            const newErrors: Record<string, string> = {};

            zodErrors.forEach((err) => {
               const field = err.path[0];
               newErrors[field] = err.message;
            });

            validationErrors = newErrors;
         }
         return false;
      }
   }

   const handleNext = () => {
      if (validateForm()) {
         onboardingState.updateFormData({ basicInfo: formData });
         onboardingState.nextStep();
         toast.success("Basic information saved successfully!");
      } else {
         toast.error("Please fix the errors before continuing.");
      }
   };

   // Get error for a specific field
   function getFieldError(field: keyof BasicInfo): string {
      return validationErrors[field] || "";
   }
</script>

<div class="space-y-6">
   <!-- Header -->
   <div class="text-center space-y-2">
      <div
         class="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"
      >
         <User class="w-6 h-6 text-primary" />
      </div>
      <h2 class="text-2xl font-semibold">Tell us about yourself</h2>
      <p class="text-muted-foreground">
         This information helps us personalize your experience and connect you
         with the right people.
      </p>
   </div>

   <!-- Required Information -->
   <Card>
      <CardHeader>
         <CardTitle class="flex items-center space-x-2">
            <User class="w-5 h-5" />
            <span>Required Information</span>
         </CardTitle>
         <CardDescription>
            These fields are required to create your profile
         </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
         <div class="space-y-2">
            <Label for="name">Full Name *</Label>
            <Input
               id="name"
               name="name"
               type="text"
               placeholder="Enter your full name"
               bind:value={formData.name}
               class={cn(getFieldError("name") && "border-destructive")}
            />
            {#if getFieldError("name")}
               <p class="text-sm text-destructive">
                  {getFieldError("name")}
               </p>
            {/if}
         </div>

         <!-- Email -->
         <div class="space-y-2">
            <Label for="email">Email Address *</Label>
            <Input
               id="email"
               type="email"
               placeholder="Enter your email address"
               bind:value={formData.email}
               class={cn(getFieldError("email") && "border-destructive")}
            />
            {#if getFieldError("email")}
               <p class="text-sm text-destructive">
                  {getFieldError("email")}
               </p>
            {/if}
         </div>

         <!-- Location -->
         <div class="space-y-2">
            <Label for="location">Location *</Label>
            <Input
               id="location"
               type="text"
               placeholder="City, Country (e.g., San Francisco, USA)"
               bind:value={formData.location}
               class={cn(getFieldError("location") && "border-destructive")}
            />
            {#if getFieldError("location")}
               <p class="text-sm text-destructive">
                  {getFieldError("location")}
               </p>
            {/if}
         </div>
      </CardContent>
   </Card>

   <!-- Professional Information -->
   <Card>
      <CardHeader>
         <CardTitle class="flex items-center space-x-2">
            <FileText class="w-5 h-5" />
            <span>Professional Information</span>
         </CardTitle>
         <CardDescription>
            Share your professional background and expertise
         </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
         <!-- Job Title -->
         <div class="space-y-2">
            <Label for="jobTitle">Job Title</Label>
            <Input
               id="jobTitle"
               type="text"
               placeholder="e.g., Software Engineer, Founder, Investor"
               bind:value={formData.jobTitle}
               class={cn(getFieldError("jobTitle") && "border-destructive")}
            />
            {#if getFieldError("jobTitle")}
               <p class="text-sm text-destructive">
                  {getFieldError("jobTitle")}
               </p>
            {/if}
         </div>

         <!-- Industry -->
         <div class="space-y-2">
            <Label for="industry">Industry</Label>
            <Input
               id="industry"
               type="text"
               placeholder="e.g., Technology, Healthcare, Finance"
               bind:value={formData.industry}
               class={cn(getFieldError("industry") && "border-destructive")}
            />
            {#if getFieldError("industry")}
               <p class="text-sm text-destructive">
                  {getFieldError("industry")}
               </p>
            {/if}
         </div>

         <!-- Education -->
         <div class="space-y-2">
            <Label for="education">Education</Label>
            <Input
               id="education"
               type="text"
               placeholder="e.g., B.S. Computer Science from Stanford University"
               bind:value={formData.education}
            />
         </div>

         <!-- Bio -->
         <div class="space-y-2">
            <Label for="bio">Bio</Label>
            <Textarea
               id="bio"
               placeholder="Tell us a bit about yourself, your background, and what you're passionate about..."
               bind:value={formData.bio}
               rows={4}
               maxlength={500}
            />
            <p class="text-xs text-muted-foreground">
               {formData.bio?.length || 0}/500 characters
            </p>
            {#if getFieldError("bio")}
               <p class="text-sm text-destructive">
                  {getFieldError("bio")}
               </p>
            {/if}
         </div>
      </CardContent>
   </Card>

   <!-- Contact Information -->
   <Card>
      <CardHeader>
         <CardTitle class="flex items-center space-x-2">
            <FileText class="w-5 h-5" />
            <span>Contact & Social</span>
         </CardTitle>
         <CardDescription>
            How can others reach you and connect with you online?
         </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
         <!-- Phone -->
         <div class="space-y-2">
            <Label for="phone">Phone Number</Label>
            <Input
               id="phone"
               type="tel"
               placeholder="e.g., +1 (555) 123-4567"
               bind:value={formData.phone}
            />
         </div>

         <!-- LinkedIn -->
         <div class="space-y-2">
            <Label for="linkedinUrl">LinkedIn Profile</Label>
            <Input
               id="linkedinUrl"
               type="url"
               placeholder="https://linkedin.com/in/yourprofile"
               bind:value={formData.linkedinUrl}
               class={cn(getFieldError("linkedinUrl") && "border-destructive")}
            />
            {#if getFieldError("linkedinUrl")}
               <p class="text-sm text-destructive">
                  {getFieldError("linkedinUrl")}
               </p>
            {/if}
         </div>

         <!-- Twitter -->
         <div class="space-y-2">
            <Label for="twitterHandle">Twitter/X Handle</Label>
            <Input
               id="twitterHandle"
               type="text"
               placeholder="e.g., @yourhandle"
               bind:value={formData.twitterHandle}
            />
         </div>

         <!-- GitHub -->
         <div class="space-y-2">
            <Label for="githubProfile">GitHub Profile</Label>
            <Input
               id="githubProfile"
               type="url"
               placeholder="https://github.com/yourusername"
               bind:value={formData.githubProfile}
            />
         </div>

         <!-- Portfolio -->
         <div class="space-y-2">
            <Label for="portfolioWebsite">Portfolio Website</Label>
            <Input
               id="portfolioWebsite"
               type="url"
               placeholder="https://yourportfolio.com"
               bind:value={formData.portfolioWebsite}
            />
         </div>
      </CardContent>
   </Card>

   <!-- Location & Demographics -->
   <Card>
      <CardHeader>
         <CardTitle class="flex items-center space-x-2">
            <FileText class="w-5 h-5" />
            <span>Location & Demographics</span>
         </CardTitle>
         <CardDescription>
            Help us connect you with people in your area and timezone
         </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
         <!-- City -->
         <div class="space-y-2">
            <Label for="city">City/Region</Label>
            <Input
               id="city"
               type="text"
               placeholder="e.g., San Francisco, CA"
               bind:value={formData.city}
            />
         </div>

         <!-- Timezone -->
         <div class="space-y-2">
            <Label for="timezone">Timezone</Label>
            <Input
               id="timezone"
               type="text"
               placeholder="e.g., PST, EST, GMT+1"
               bind:value={formData.timezone}
            />
         </div>

         <!-- Languages -->
         <div class="space-y-2">
            <Label for="languages">Languages (comma separated)</Label>
            <Input
               id="languages"
               type="text"
               placeholder="e.g., English, Spanish, French"
               bind:value={formData.languages}
            />
         </div>
      </CardContent>
   </Card>

   <!-- Current Status -->
   <Card>
      <CardHeader>
         <CardTitle class="flex items-center space-x-2">
            <FileText class="w-5 h-5" />
            <span>Current Status</span>
         </CardTitle>
         <CardDescription>
            Tell us about your current professional situation
         </CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
         <!-- Employment Status -->
         <div class="space-y-2">
            <Label for="employmentStatus">Employment Status</Label>
            <Input
               id="employmentStatus"
               type="text"
               placeholder="e.g., Full-time, Part-time, Freelancer, Student"
               bind:value={formData.employmentStatus}
            />
         </div>
      </CardContent>
   </Card>

   <!-- Tips -->
   <Card class="border-foreground/50 bg-foreground/20">
      <CardContent class="pt-6">
         <div class="flex items-start space-x-3">
            <div
               class="w-5 h-5 bg-background/50 rounded-full flex items-center justify-center mt-0.5"
            >
               <span class="text-white text-xs">💡</span>
            </div>
            <div class="text-sm">
               <p class="font-medium mb-1 font-head">Profile Tips</p>
               <ul class="space-y-1">
                  <li>
                     • Use your real name to build trust with other members
                  </li>
                  <li>
                     • Add a bio to help others understand your background and
                     interests
                  </li>
                  <li>
                     • Include your LinkedIn profile to increase credibility
                  </li>
                  <li>• You can always update this information later</li>
               </ul>
            </div>
         </div>
      </CardContent>
   </Card>

   <!-- Action Buttons -->
   <div class="flex justify-between items-center pt-4">
      <Button variant="outline" onclick={() => onboardingState.previousStep()}>
         Back
      </Button>

      <Button onclick={handleNext}>Continue</Button>
   </div>
</div>
