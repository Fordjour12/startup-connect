<script lang="ts">
	import { onboardingState } from "./onboarding-state.svelte";
	import { Button } from "@/components/ui/button";
	import { Check, ChevronRight } from "@lucide/svelte";
	import { cn } from "@/utils";

	let { showStepNumbers = true, showProgressBar = true } = $props();
</script>

<div class="w-full space-y-4">
	<!-- Progress Bar -->
	{#if showProgressBar}
		<div class="w-full">
			<div
				class="flex justify-between text-sm text-muted-foreground mb-2"
			>
				<span
					>Step {onboardingState.currentStepIndex + 1} of {onboardingState
						.steps.length}</span
				>
				<span
					>{Math.round(
						(onboardingState.currentStepIndex /
							(onboardingState.steps.length - 1)) *
							100,
					)}% Complete</span
				>
			</div>
			<div class="w-full bg-muted rounded-full h-2">
				<div
					class="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
					style="width: {onboardingState.progressPercentage}%"
				></div>
			</div>
		</div>
	{/if}

	<!-- Step Indicators -->
	{#if showStepNumbers}
		<div class="flex items-center justify-between w-full">
			{#each onboardingState.steps as step, index}
				<div class="flex items-center flex-1">
					<!-- Step Circle -->
					<button
						class={cn(
							"w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 flex-shrink-0",
							{
								"bg-primary text-primary-foreground":
									index === onboardingState.currentStepIndex,
								"bg-muted text-muted-foreground":
									index < onboardingState.currentStepIndex &&
									!onboardingState.isStepCompleted(step.id),
								"bg-green-500 text-white":
									onboardingState.isStepCompleted(step.id),
								"bg-muted/50 text-muted-foreground":
									index > onboardingState.currentStepIndex,
							},
						)}
						onclick={() => {
							if (
								index <= onboardingState.currentStepIndex ||
								onboardingState.isStepCompleted(step.id)
							) {
								onboardingState.goToStep(index);
							}
						}}
						disabled={index > onboardingState.currentStepIndex &&
							!onboardingState.isStepCompleted(step.id)}
					>
						{#if onboardingState.isStepCompleted(step.id)}
							<Check class="w-4 h-4" />
						{:else}
							{index + 1}
						{/if}
					</button>

					<!-- Step Title (only show for current and completed steps) -->
					{#if index === onboardingState.currentStepIndex || onboardingState.isStepCompleted(step.id)}
						<div class="ml-2 hidden sm:block">
							<div class="text-sm font-medium">
								{step.title}
							</div>
							<div class="text-xs text-muted-foreground">
								{step.description}
							</div>
						</div>
					{/if}

					<!-- Connector Line -->
					{#if index < onboardingState.steps.length - 1}
						<div
							class={cn(
								"flex-1 h-0.5 mx-2 transition-all duration-200",
								{
									"bg-primary":
										onboardingState.isStepCompleted(
											step.id,
										),
									"bg-muted":
										!onboardingState.isStepCompleted(
											step.id,
										),
								},
							)}
						></div>
					{/if}
				</div>
			{/each}
		</div>
	{/if}

	<!-- Current Step Info -->
	<div class="text-center space-y-2">
		<h2 class="text-xl font-semibold">
			{onboardingState.currentStep.title}
		</h2>
		<p class="text-sm text-muted-foreground">
			{onboardingState.currentStep.description}
		</p>
	</div>

	<!-- Navigation Buttons -->
	<div class="flex justify-between items-center pt-4">
		<Button
			variant="outline"
			onclick={() => onboardingState.previousStep()}
			disabled={!onboardingState.canGoPrevious}
		>
			Previous
		</Button>

		<div class="flex items-center space-x-2">
			{#if onboardingState.currentStep.canSkip}
				<Button
					variant="ghost"
					onclick={() => onboardingState.nextStep()}
				>
					Skip for now
				</Button>
			{/if}

			<Button
				onclick={() => onboardingState.nextStep()}
				disabled={!onboardingState.canGoNext}
			>
				{#if onboardingState.isComplete}
					Complete Setup
				{:else}
					Continue
					<ChevronRight class="w-4 h-4 ml-2" />
				{/if}
			</Button>
		</div>
	</div>

	<!-- Error Display -->
	{#if onboardingState.errors.general}
		<div
			class="bg-destructive/10 border border-destructive/20 rounded-md p-3"
		>
			<p class="text-sm text-destructive">
				{onboardingState.errors.general}
			</p>
		</div>
	{/if}
</div>
