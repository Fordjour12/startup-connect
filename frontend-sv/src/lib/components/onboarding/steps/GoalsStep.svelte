<script lang="ts">
   import { onboardingState } from "@/hooks/onboarding-state.svelte";
   import { Button } from "@/components/ui/button";
   import {
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardTitle,
   } from "@/components/ui/card";
   import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
   import { Checkbox } from "@/components/ui/checkbox";
   import { Label } from "@/components/ui/label";
   import { Textarea } from "@/components/ui/textarea";
   import { Target, Clock } from "@lucide/svelte";
   import { goalsSchema, type Goals } from "@/z-schema/onboarding-schema";
   import { toast } from "svelte-sonner";
   import { z } from "zod";

   // Form data with proper typing
   let formData = $state<Goals>({
      personalGoals: [],
      platformGoals: [],
      primaryGoal: "",
      specificNeeds: [],
      timeCommitment: "",
      additionalGoals: "",
   });

   // Validation state
   let validationErrors = $state<Record<string, string>>({});

   // Initialize form with saved progress
   $effect(() => {
      formData = {
         personalGoals: onboardingState.formData.goals.personalGoals || [],
         platformGoals: onboardingState.formData.goals.platformGoals || [],
         primaryGoal: onboardingState.formData.goals.primaryGoal || "",
         specificNeeds: onboardingState.formData.goals.specificNeeds || [],
         timeCommitment: onboardingState.formData.goals.timeCommitment || "",
         additionalGoals: onboardingState.formData.goals.additionalGoals || "",
      };
   });

   // Validate form using Zod
   function validateForm(): boolean {
      try {
         goalsSchema.parse(formData);
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

   // Get error for a specific field
   function getFieldError(field: keyof Goals): string {
      return validationErrors[field] || "";
   }

   const primaryGoals = [
      {
         value: "find_cofounders",
         label: "Find Co-founders",
         description: "Looking for partners to build my startup with",
         icon: "👥",
      },
      {
         value: "raise_funding",
         label: "Raise Funding",
         description: "Seeking investment to grow my startup",
         icon: "💰",
      },
      {
         value: "find_investors",
         label: "Find Investors",
         description: "Looking for investors to connect with",
         icon: "🎯",
      },
      {
         value: "offer_mentorship",
         label: "Offer Mentorship",
         description: "Want to help other founders succeed",
         icon: "🤝",
      },
      {
         value: "provide_services",
         label: "Provide Services",
         description: "Offer professional services to startups",
         icon: "🛠️",
      },
      {
         value: "invest_in_startups",
         label: "Invest in Startups",
         description: "Looking for promising startups to invest in",
         icon: "📈",
      },
      {
         value: "network",
         label: "Network",
         description: "Connect with the startup community",
         icon: "🌐",
      },
      {
         value: "learn",
         label: "Learn",
         description: "Learn from experienced founders and investors",
         icon: "📚",
      },
   ] as const;

   const specificNeeds = [
      { value: "technical_expertise", label: "Technical Expertise" },
      { value: "business_development", label: "Business Development" },
      { value: "marketing_sales", label: "Marketing & Sales" },
      { value: "legal_advice", label: "Legal Advice" },
      { value: "financial_planning", label: "Financial Planning" },
      { value: "product_development", label: "Product Development" },
      { value: "team_building", label: "Team Building" },
      { value: "market_research", label: "Market Research" },
      { value: "fundraising_strategy", label: "Fundraising Strategy" },
   ] as const;

   const timeCommitments = [
      {
         value: "1-5_hours",
         label: "1-5 hours per week",
         description: "Light engagement",
      },
      {
         value: "5-10_hours",
         label: "5-10 hours per week",
         description: "Moderate engagement",
      },
      {
         value: "10-20_hours",
         label: "10-20 hours per week",
         description: "Active engagement",
      },
      {
         value: "20+_hours",
         label: "20+ hours per week",
         description: "Full-time engagement",
      },
   ] as const;

   /*
   const handleSpecificNeedToggle = (need: string) => {
      if (formData.specificNeeds.includes(need)) {
         formData.specificNeeds = formData.specificNeeds.filter(
            (n: string) => n !== need,
         );
      } else {
         formData.specificNeeds = [...formData.specificNeeds, need];
      }
   };

   const handleNext = () => {
      if (validateForm()) {
         // Save form data before moving to next step
         onboardingState.updateFormData({
            goals: {
               personalGoals: formData.personalGoals,
               platformGoals: formData.platformGoals,
               primaryGoal: formData.primaryGoal,
               specificNeeds: [...formData.specificNeeds],
               timeCommitment: formData.timeCommitment,
               additionalGoals: formData.additionalGoals,
            }
         });
         onboardingState.nextStep();
         toast.success("Goals saved successfully!");
      } else {
         toast.error("Please fix the errors before continuing.");
      }
   };
   */
</script>

<div class="space-y-6">
   <!-- Header -->
   <div class="text-center space-y-2">
      <div
         class="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center"
      >
         <Target class="w-6 h-6 text-primary" />
      </div>
      <h2 class="text-2xl font-semibold">What are your goals?</h2>
      <p class="text-muted-foreground">
         This helps us connect you with the right people and resources.
      </p>
   </div>

   <!-- Primary Goal -->
   <Card>
      <CardHeader>
         <CardTitle>Primary Goal *</CardTitle>
         <CardDescription>
            What's your main reason for joining StartupConnect?
         </CardDescription>
      </CardHeader>
      <CardContent>
         <RadioGroup
            value={formData.primaryGoal}
            onValueChange={(value) =>
               (formData.primaryGoal = value as Goals["primaryGoal"])}
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
         >
            {#each primaryGoals as goal}
               <div class="flex items-center space-x-3">
                  <RadioGroupItem value={goal.value} id={goal.value} />
                  <Label
                     for={goal.value}
                     class="flex-1 cursor-pointer p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                     <div class="flex items-center space-x-3">
                        <span class="text-2xl">{goal.icon}</span>
                        <div>
                           <div class="font-medium">{goal.label}</div>
                           <div class="text-sm text-muted-foreground">
                              {goal.description}
                           </div>
                        </div>
                     </div>
                  </Label>
               </div>
            {/each}
         </RadioGroup>
         {#if getFieldError("primaryGoal")}
            <p class="text-sm text-destructive mt-2">
               {getFieldError("primaryGoal")}
            </p>
         {/if}
      </CardContent>
   </Card>

   <!-- Specific Needs -->
   <Card>
      <CardHeader>
         <CardTitle>Specific Needs *</CardTitle>
         <CardDescription>
            What specific help or resources are you looking for? (Select all
            that apply)
         </CardDescription>
      </CardHeader>

      <!--<CardContent>
         <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            {#each specificNeeds as need}
               <div class="flex items-center space-x-2">
                  <Checkbox
                     id={need.value}
                     checked={formData.specificNeeds.includes(need.value)}
                     onCheckedChange={() =>
                        handleSpecificNeedToggle(need.value)}
                  />
                  <Label for={need.value} class="text-sm cursor-pointer">
                     {need.label}
                  </Label>
               </div>
            {/each}
         </div>
         {#if getFieldError("specificNeeds")}
            <p class="text-sm text-destructive mt-2">
               {getFieldError("specificNeeds")}
            </p>
         {/if}
      </CardContent> -->
   </Card>

   <!-- Time Commitment -->
   <Card>
      <CardHeader>
         <CardTitle class="flex items-center space-x-2">
            <Clock class="w-5 h-5" />
            <span>Time Commitment *</span>
         </CardTitle>
         <CardDescription>
            How much time can you dedicate to the platform?
         </CardDescription>
      </CardHeader>
      <CardContent>
         <RadioGroup
            value={formData.timeCommitment}
            onValueChange={(value) =>
               (formData.timeCommitment = value as Goals["timeCommitment"])}
            class="space-y-3"
         >
            {#each timeCommitments as commitment}
               <div class="flex items-center space-x-3">
                  <RadioGroupItem
                     value={commitment.value}
                     id={commitment.value}
                  />
                  <Label
                     for={commitment.value}
                     class="flex-1 cursor-pointer p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                     <div>
                        <div class="font-medium">
                           {commitment.label}
                        </div>
                        <div class="text-sm text-muted-foreground">
                           {commitment.description}
                        </div>
                     </div>
                  </Label>
               </div>
            {/each}
         </RadioGroup>
         {#if getFieldError("timeCommitment")}
            <p class="text-sm text-destructive mt-2">
               {getFieldError("timeCommitment")}
            </p>
         {/if}
      </CardContent>
   </Card>

   <!-- Additional Goals -->
   <Card>
      <CardHeader>
         <CardTitle>Additional Goals</CardTitle>
         <CardDescription>
            Any other goals or objectives you'd like to share?
         </CardDescription>
      </CardHeader>
      <CardContent>
         <Textarea
            placeholder="Tell us about any other goals, aspirations, or specific outcomes you're hoping to achieve..."
            bind:value={formData.additionalGoals}
            rows={3}
            maxlength={300}
         />
         <p class="text-xs text-muted-foreground mt-2">
            {formData.additionalGoals?.length || 0}/300 characters
         </p>
         {#if getFieldError("additionalGoals")}
            <p class="text-sm text-destructive mt-2">
               {getFieldError("additionalGoals")}
            </p>
         {/if}
      </CardContent>
   </Card>

   <!-- Tips -->
   <Card class="border-green-200 bg-green-50/50">
      <CardContent class="pt-6">
         <div class="flex items-start space-x-3">
            <div
               class="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mt-0.5"
            >
               <span class="text-white text-xs">💡</span>
            </div>
            <div class="text-sm">
               <p class="font-medium text-green-900 mb-1">Matching Tips</p>
               <ul class="text-green-700 space-y-1">
                  <li>• Be specific about your needs to get better matches</li>
                  <li>
                     • Your time commitment helps set expectations with
                     connections
                  </li>
                  <li>
                     • You can update your goals anytime in your profile
                     settings
                  </li>
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

      <!-- <Button onclick={handleNext}>Continue</Button> -->
   </div>
</div>
