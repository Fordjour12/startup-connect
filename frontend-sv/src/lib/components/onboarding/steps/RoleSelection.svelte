<script lang="ts">
   import {
      Card,
      CardContent,
      CardDescription,
      CardHeader,
      CardTitle,
   } from "@/components/ui/card";
   import { Button } from "@/components/ui/button";
   import { Check } from "@lucide/svelte";
   import { onboardingState } from "@/hooks/onboarding-state.svelte";
   import {
      roleSelectionSchema,
      type UserRole,
      type RoleSelection,
   } from "@/z-schema/onboarding-schema";
   import { toast } from "svelte-sonner";
   import { z } from "zod";

   let { data } = $props();

   // Form data with proper typing
   let formData = $state<RoleSelection>({
      role: "" as RoleSelection["role"],
   });

   // Validation state
   let validationErrors = $state<Record<string, string>>({});

   // Initialize form with saved progress
   $effect(() => {
      formData = {
         role:
            (onboardingState.formData.role as RoleSelection["role"]) ||
            ("" as RoleSelection["role"]),
      };
   });

   // Validate form using Zod
   function validateForm(): boolean {
      try {
         roleSelectionSchema.parse(formData);
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
   function getFieldError(field: keyof RoleSelection): string {
      return validationErrors[field] || "";
   }

   const handleRoleSelect = (roleId: UserRole) => {
      formData.role = roleId;
      onboardingState.updateFormData({ role: roleId });
   };

   const handleNext = () => {
      if (validateForm()) {
         onboardingState.nextStep();
         toast.success("Role selected successfully!");
      } else {
         toast.error("Please select a role before continuing.");
      }
   };
</script>

<div class="space-y-6">
   <div class="text-center space-y-2">
      <h2 class="text-xl font-semibold">Choose your role</h2>
      <p class="text-sm text-muted-foreground">
         Select the role that best describes you to customize your experience
      </p>
   </div>

   <div class="grid gap-4 md:grid-cols-1">
      {#each data.roles as role}
         <Card
            class="cursor-pointer transition-all duration-200 hover:shadow-md {role.id ===
            formData.role
               ? 'ring-2 ring-primary bg-primary/5'
               : 'hover:bg-muted/50'}"
            onclick={() => handleRoleSelect(role.id)}
         >
            <CardHeader class="pb-3">
               <div class="flex items-start space-x-4">
                  <div class="text-3xl">{role.icon}</div>
                  <div class="flex-1">
                     <CardTitle class="text-lg">{role.title}</CardTitle>
                     <CardDescription class="mt-1">
                        {role.description}
                     </CardDescription>
                  </div>
                  {#if role.id === formData.role}
                     <div class="flex-shrink-0">
                        <div
                           class="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                        >
                           <Check class="w-4 h-4 text-primary-foreground" />
                        </div>
                     </div>
                  {/if}
               </div>
            </CardHeader>
            <CardContent class="pt-0">
               <ul class="space-y-2">
                  {#each role.features as feature}
                     <li
                        class="flex items-center space-x-2 text-sm text-muted-foreground"
                     >
                        <Check class="w-4 h-4 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                     </li>
                  {/each}
               </ul>
            </CardContent>
         </Card>
      {/each}
   </div>

   {#if getFieldError("role")}
      <div class="text-center">
         <p class="text-sm text-destructive">
            {getFieldError("role")}
         </p>
      </div>
   {/if}

   <!-- Action Buttons -->
   <div class="flex justify-between items-center pt-4">
      <Button variant="outline" onclick={() => onboardingState.previousStep()}>
         Back
      </Button>

      <Button onclick={handleNext}>
         Continue with {formData.role
            ? data.roles.find((r: any) => r.id === formData.role)?.title ||
              "Selected Role"
            : "Select Role"}
      </Button>
   </div>

   <div class="text-center">
      <p class="text-xs text-muted-foreground">
         You can change your role later in your account settings
      </p>
   </div>
</div>
