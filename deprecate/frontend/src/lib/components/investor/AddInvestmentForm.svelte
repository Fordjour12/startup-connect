<script lang="ts">
    import { Button } from "$lib/components/ui/button";
    import {
        Dialog,
        DialogContent,
        DialogDescription,
        DialogFooter,
        DialogHeader,
        DialogTitle,
        DialogTrigger,
    } from "$lib/components/ui/dialog";
    import { FormLabel } from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
    import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
    } from "$lib/components/ui/select";
    import { portfolioManager } from "@/hooks/PortfolioManager.svelte";

    // Local state
    let open = $state(false);

    // Form data
    let company = $state("");
    let amount = $state(0);
    let currentValue = $state(0);
    let stage = $state("Seed");
    let riskLevel = $state("Medium");
    let dateInvested = $state(new Date().toISOString().split("T")[0]);
    let formErrors = $state<Record<string, string>>({});

    // Validate form input
    function validateForm(): boolean {
        formErrors = {};
        let isValid = true;

        if (!company.trim()) {
            formErrors.company = "Company name is required";
            isValid = false;
        }

        if (amount <= 0) {
            formErrors.amount = "Amount must be greater than 0";
            isValid = false;
        }

        if (currentValue < 0) {
            formErrors.currentValue = "Current value cannot be negative";
            isValid = false;
        }

        if (!dateInvested) {
            formErrors.dateInvested = "Investment date is required";
            isValid = false;
        }

        return isValid;
    }

    // Handle form submission
    function handleSubmit() {
        if (!validateForm()) return;

        // Add investment using the portfolio manager
        portfolioManager.addInvestment({
            company,
            amount,
            currentValue,
            date: dateInvested,
            stage,
            riskLevel,
        });

        // Reset form and close dialog
        resetForm();
        open = false;
    }

    // Reset form values
    function resetForm() {
        company = "";
        amount = 0;
        currentValue = 0;
        stage = "Seed";
        riskLevel = "Medium";
        dateInvested = new Date().toISOString().split("T")[0];
        formErrors = {};
    }
</script>

<Dialog bind:open onOpenChange={() => resetForm()}>
    <DialogTrigger>
        <Button variant="default">Add Investment</Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
        <DialogHeader>
            <DialogTitle>Add New Investment</DialogTitle>
            <DialogDescription>
                Add details of your new startup investment to track in your
                portfolio.
            </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4 py-4">
            <div class="grid grid-cols-4 items-center gap-4">
                <FormLabel class="text-right" for="company">Company</FormLabel>
                <div class="col-span-3">
                    <Input
                        id="company"
                        bind:value={company}
                        class={formErrors.company ? "border-destructive" : ""}
                    />
                    {#if formErrors.company}
                        <p class="text-xs text-destructive mt-1">
                            {formErrors.company}
                        </p>
                    {/if}
                </div>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <FormLabel class="text-right" for="amount">Amount ($)</FormLabel
                >
                <div class="col-span-3">
                    <Input
                        id="amount"
                        type="number"
                        bind:value={amount}
                        class={formErrors.amount ? "border-destructive" : ""}
                    />
                    {#if formErrors.amount}
                        <p class="text-xs text-destructive mt-1">
                            {formErrors.amount}
                        </p>
                    {/if}
                </div>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <FormLabel class="text-right" for="currentValue"
                    >Current Value ($)</FormLabel
                >
                <div class="col-span-3">
                    <Input
                        id="currentValue"
                        type="number"
                        bind:value={currentValue}
                        class={formErrors.currentValue
                            ? "border-destructive"
                            : ""}
                    />
                    {#if formErrors.currentValue}
                        <p class="text-xs text-destructive mt-1">
                            {formErrors.currentValue}
                        </p>
                    {/if}
                </div>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <FormLabel class="text-right" for="dateInvested"
                    >Date Invested</FormLabel
                >
                <div class="col-span-3">
                    <Input
                        id="dateInvested"
                        type="date"
                        bind:value={dateInvested}
                        class={formErrors.dateInvested
                            ? "border-destructive"
                            : ""}
                    />
                    {#if formErrors.dateInvested}
                        <p class="text-xs text-destructive mt-1">
                            {formErrors.dateInvested}
                        </p>
                    {/if}
                </div>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <FormLabel class="text-right" for="stage">Stage</FormLabel>
                <div class="col-span-3">
                    <Select type="single" bind:value={stage}>
                        <SelectTrigger>
                            {stage ? stage : "Select stage"}
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Pre-seed">Pre-seed</SelectItem>
                            <SelectItem value="Seed">Seed</SelectItem>
                            <SelectItem value="Series A">Series A</SelectItem>
                            <SelectItem value="Series B">Series B</SelectItem>
                            <SelectItem value="Series C+">Series C+</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div class="grid grid-cols-4 items-center gap-4">
                <FormLabel class="text-right" for="riskLevel"
                    >Risk Level</FormLabel
                >
                <div class="col-span-3">
                    <Select type="single" bind:value={riskLevel}>
                        <SelectTrigger>
                            {riskLevel ? riskLevel : "Select risk level"}
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Low">Low</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
        <DialogFooter>
            <Button variant="outline" onclick={() => (open = false)}
                >Cancel</Button
            >
            <Button type="submit" onclick={handleSubmit}>Add Investment</Button>
        </DialogFooter>
    </DialogContent>
</Dialog>
