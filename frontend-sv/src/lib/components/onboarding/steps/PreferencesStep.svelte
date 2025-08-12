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
   import { Label } from "@/components/ui/label";
   import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
   import { Checkbox } from "@/components/ui/checkbox";
   import { Badge } from "@/components/ui/badge";
   import { Separator } from "@/components/ui/separator";
   import {
      Users,
      Globe,
      MessageSquare,
      Calendar,
      MapPin,
      Settings,
      Bell,
      Heart,
   } from "@lucide/svelte";
   import {
      preferencesSchema,
      type Preferences,
   } from "@/z-schema/onboarding-schema";
   import { toast } from "svelte-sonner";

   // Form data with proper typing
   let formData = $state<Preferences>({
      geographicPreference: "local" as Preferences["geographicPreference"],
      communicationStyle: ["email"] as Preferences["communicationStyle"],
      workingStyle: "collaborative" as Preferences["workingStyle"],
      diversityPreference: true,
      notificationFrequency: "weekly" as Preferences["notificationFrequency"],
   });

   // Validation state
   let validationErrors = $state<Record<string, string>>({});

   // Validate form using Zod
   function validateForm(): boolean {
      try {
         preferencesSchema.parse(formData);
         validationErrors = {};
         return true;
      } catch (error) {
         if (error instanceof Error && "errors" in error) {
            const zodErrors = (error as any).errors;
            const newErrors: Record<string, string> = {};

            zodErrors.forEach((err: any) => {
               const field = err.path[0];
               newErrors[field] = err.message;
            });

            validationErrors = newErrors;
         }
         return false;
      }
   }

   // Get error for a specific field
   function getFieldError(field: keyof Preferences): string {
      return validationErrors[field] || "";
   }

   // Communication style options
   const communicationOptions = [
      { value: "video_calls", label: "Video Calls", icon: "📹" },
      { value: "email", label: "Email", icon: "📧" },
      { value: "in_person", label: "In Person", icon: "🤝" },
      { value: "chat", label: "Chat", icon: "💬" },
   ] as const;

   // Working style options
   const workingStyleOptions = [
      {
         value: "fast_paced",
         label: "Fast-paced",
         description: "Quick iterations and rapid progress",
      },
      {
         value: "collaborative",
         label: "Collaborative",
         description: "Team-focused approach",
      },
      {
         value: "independent",
         label: "Independent",
         description: "Self-directed work style",
      },
      {
         value: "long_term",
         label: "Long-term focused",
         description: "Strategic, sustained effort",
      },
   ] as const;

   // Geographic options
   const geographicOptions = [
      { value: "local", label: "Local", description: "Same city or region" },
      {
         value: "regional",
         label: "Regional",
         description: "Same country or continent",
      },
      {
         value: "global",
         label: "Global",
         description: "Worldwide connections",
      },
   ] as const;

   // Notification options
   const notificationOptions = [
      {
         value: "daily",
         label: "Daily",
         description: "Stay updated with daily notifications",
      },
      {
         value: "weekly",
         label: "Weekly",
         description: "Weekly digest of opportunities",
      },
      {
         value: "monthly",
         label: "Monthly",
         description: "Monthly summary and highlights",
      },
   ] as const;

   function toggleCommunicationStyle(
      style: Preferences["communicationStyle"][number],
   ) {
      if (formData.communicationStyle.includes(style)) {
         if (formData.communicationStyle.length > 1) {
            formData.communicationStyle = formData.communicationStyle.filter(
               (s) => s !== style,
            );
         }
      } else {
         formData.communicationStyle = [...formData.communicationStyle, style];
      }
   }

   // Debounced effect to reduce update frequency
   let updateTimeout: ReturnType<typeof setTimeout> | null = null;

   $effect(() => {
      // Clear existing timeout
      if (updateTimeout) {
         clearTimeout(updateTimeout);
      }

      // Debounce the update to avoid excessive API calls
      updateTimeout = setTimeout(() => {
         onboardingState.updateFormData(formData);
      }, 300); // 300ms debounce
   });

   const handleNext = () => {
      if (validateForm()) {
         onboardingState.updateFormData(formData);
         onboardingState.nextStep();
         toast.success("Preferences saved successfully!");
      } else {
         toast.error("Please fix the errors before continuing.");
      }
   };
</script>

<div class="space-y-8">
   <!-- Header -->
   <div class="text-center space-y-4">
      <div
         class="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center"
      >
         <Settings class="w-8 h-8 text-primary" />
      </div>
      <h1 class="text-3xl font-bold tracking-tight">Matching Preferences</h1>
      <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
         Tell us how you prefer to connect and collaborate. This helps us find
         the perfect matches for you.
      </p>
   </div>

   <!-- Communication Preferences -->
   <Card class="border-2 border-primary/10">
      <CardHeader>
         <CardTitle class="flex items-center gap-3 text-xl">
            <MessageSquare class="w-6 h-6 text-primary" />
            Communication Style
         </CardTitle>
         <CardDescription>
            How do you prefer to communicate with potential connections? Select
            all that apply.
         </CardDescription>
      </CardHeader>
      <CardContent class="space-y-6">
         <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {#each communicationOptions as option}
               <button
                  onclick={() => toggleCommunicationStyle(option.value)}
                  class="relative p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-md {formData.communicationStyle.includes(
                     option.value,
                  )
                     ? 'border-primary bg-primary/5 shadow-sm'
                     : 'border-border hover:border-primary/50'}"
               >
                  <div class="flex items-center gap-3">
                     <span class="text-2xl">{option.icon}</span>
                     <div class="text-left">
                        <div class="font-medium">{option.label}</div>
                     </div>
                     {#if formData.communicationStyle.includes(option.value)}
                        <div class="ml-auto">
                           <Badge variant="secondary" class="text-xs">
                              Selected
                           </Badge>
                        </div>
                     {/if}
                  </div>
               </button>
            {/each}
         </div>
         {#if getFieldError("communicationStyle")}
            <p class="text-sm text-destructive flex items-center gap-2">
               <MessageSquare class="w-4 h-4" />
               {getFieldError("communicationStyle")}
            </p>
         {/if}
      </CardContent>
   </Card>

   <!-- Working Style -->
   <Card>
      <CardHeader>
         <CardTitle class="flex items-center gap-3 text-xl">
            <Users class="w-6 h-6 text-primary" />
            Working Style
         </CardTitle>
         <CardDescription>
            What's your preferred approach to collaboration and work?
         </CardDescription>
      </CardHeader>
      <CardContent>
         <RadioGroup bind:value={formData.workingStyle} class="space-y-4">
            {#each workingStyleOptions as option}
               <div
                  class="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
               >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label for={option.value} class="flex-1 cursor-pointer">
                     <div class="font-medium">{option.label}</div>
                     <div class="text-sm text-muted-foreground">
                        {option.description}
                     </div>
                  </Label>
               </div>
            {/each}
         </RadioGroup>
         {#if getFieldError("workingStyle")}
            <p class="text-sm text-destructive mt-2 flex items-center gap-2">
               <Users class="w-4 h-4" />
               {getFieldError("workingStyle")}
            </p>
         {/if}
      </CardContent>
   </Card>

   <!-- Location & Diversity Preferences -->
   <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Geographic Preference -->
      <Card>
         <CardHeader>
            <CardTitle class="flex items-center gap-3 text-xl">
               <Globe class="w-6 h-6 text-primary" />
               Location Preference
            </CardTitle>
            <CardDescription>
               Where are you open to connecting with people?
            </CardDescription>
         </CardHeader>
         <CardContent>
            <RadioGroup
               bind:value={formData.geographicPreference}
               class="space-y-4"
            >
               {#each geographicOptions as option}
                  <div
                     class="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                     <RadioGroupItem value={option.value} id={option.value} />
                     <Label for={option.value} class="flex-1 cursor-pointer">
                        <div class="font-medium">{option.label}</div>
                        <div class="text-sm text-muted-foreground">
                           {option.description}
                        </div>
                     </Label>
                  </div>
               {/each}
            </RadioGroup>
            {#if getFieldError("geographicPreference")}
               <p class="text-sm text-destructive mt-2 flex items-center gap-2">
                  <Globe class="w-4 h-4" />
                  {getFieldError("geographicPreference")}
               </p>
            {/if}
         </CardContent>
      </Card>

      <!-- Notification Frequency -->
      <Card>
         <CardHeader>
            <CardTitle class="flex items-center gap-3 text-xl">
               <Bell class="w-6 h-6 text-primary" />
               Notification Frequency
            </CardTitle>
            <CardDescription>
               How often would you like to receive updates?
            </CardDescription>
         </CardHeader>
         <CardContent>
            <RadioGroup
               bind:value={formData.notificationFrequency}
               class="space-y-4"
            >
               {#each notificationOptions as option}
                  <div
                     class="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                     <RadioGroupItem value={option.value} id={option.value} />
                     <Label for={option.value} class="flex-1 cursor-pointer">
                        <div class="font-medium">{option.label}</div>
                        <div class="text-sm text-muted-foreground">
                           {option.description}
                        </div>
                     </Label>
                  </div>
               {/each}
            </RadioGroup>
            {#if getFieldError("notificationFrequency")}
               <p class="text-sm text-destructive mt-2 flex items-center gap-2">
                  <Bell class="w-4 h-4" />
                  {getFieldError("notificationFrequency")}
               </p>
            {/if}
         </CardContent>
      </Card>
   </div>

   <!-- Diversity Preference -->
   <Card class="border-2 border-boarder bg-primary/5">
      <CardHeader>
         <CardTitle class="flex items-center gap-3 text-xl">
            <Heart class="w-6 h-6 text-green-600" />
            Diversity & Inclusion
         </CardTitle>
         <CardDescription>
            Help us create a more inclusive and diverse community
         </CardDescription>
      </CardHeader>
      <CardContent>
         <label
            class="flex items-start space-x-3 p-4 rounded-lg border-2 border-border bg-primary/5 hover:bg-green-50/50 transition-colors cursor-pointer"
         >
            <Checkbox bind:checked={formData.diversityPreference} />
            <div class="space-y-1">
               <div class="font-medium">Value diverse perspectives</div>
               <div class="text-sm text-muted-foreground">
                  I appreciate and seek out connections with people from
                  different backgrounds, experiences, and perspectives.
               </div>
            </div>
         </label>
      </CardContent>
   </Card>

   <!-- Tips Section -->
   <Card class="border-blue-200 bg-blue-50/30">
      <CardContent class="pt-6">
         <div class="flex items-start space-x-3">
            <div
               class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mt-0.5"
            >
               <span class="text-white text-sm">💡</span>
            </div>
            <div class="space-y-2">
               <p class="font-medium text-blue-900">Pro Tips</p>
               <ul class="text-blue-700 space-y-1 text-sm">
                  <li>
                     • Be specific about your communication preferences to get
                     better matches
                  </li>
                  <li>
                     • Your working style helps set expectations with potential
                     collaborators
                  </li>
                  <li>
                     • You can update these preferences anytime in your profile
                     settings
                  </li>
                  <li>
                     • Diverse connections often lead to more innovative
                     collaborations
                  </li>
               </ul>
            </div>
         </div>
      </CardContent>
   </Card>

   <!-- Action Buttons -->
   <div class="flex justify-between items-center pt-6">
      <Button
         variant="outline"
         onclick={() => onboardingState.previousStep()}
         class="px-8"
      >
         Back
      </Button>

      <Button onclick={handleNext} class="px-8">Continue</Button>
   </div>
</div>
