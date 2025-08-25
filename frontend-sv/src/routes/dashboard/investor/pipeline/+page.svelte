<script lang="ts">
   import DueDiligenceTabContent from "$lib/components/investor/DueDiligenceTabContent.svelte";
   import PipelineKanbanVisualization from "$lib/components/investor/PipelineKanbanVisualization.svelte";
   import { Badge } from "$lib/components/ui/badge";
   import { Button } from "$lib/components/ui/button";
   import {
      Card,
      CardContent,
      CardDescription,
      CardFooter,
      CardHeader,
      CardTitle,
   } from "$lib/components/ui/card";
   import {
      Tabs,
      TabsContent,
      TabsList,
      TabsTrigger,
   } from "$lib/components/ui/tabs";
   import { Plus } from "@lucide/svelte";
   import type { PageData } from "./$types";
   import CollaborationTabContent from "$lib/components/investor/CollaborationTabContent.svelte";
   import DealComparisonTabContent from "$lib/components/investor/DealComparisonTabContent.svelte";
   import CommitteeTabContent from "$lib/components/investor/CommitteeTabContent.svelte";

   // Get server-loaded data
   let { data }: { data: PageData } = $props();

   // Initialize reactive state from server data
   const pipelineStages = $state(data.pipelineStages);
   const pipelineDeals = $state(data.pipelineDeals);
   const dueDiligenceTemplates = $state(data.dueDiligenceTemplates);
   const activeDueDiligence = $state(data.activeDueDiligence);
   const teamMembers = $state(data.teamMembers);
   const externalCollaborators = $state(data.externalCollaborators);
   const sharedDeals = $state(data.sharedDeals);
   const committeeMeetings = $state(data.committeeMeetings);
   const comparisonMetrics = $state(data.comparisonMetrics);
   const dealEvaluations = $state(data.dealEvaluations);

   // Active tab
   let activeTab = $state("pipeline");

   // Get deals by stage
   function getDealsByStage(stage: string) {
      return pipelineDeals
         .filter((deal) => deal.stage === stage)
         .map((deal) => ({
            ...deal,
            valuation: parseFloat(deal.valuation),
            targetAmount: parseFloat(deal.targetAmount),
         }));
   }

   // Get deal by ID
   function getDealById(id: number) {
      return pipelineDeals.find((deal) => deal.id === id);
   }

   // Get team member by ID
   function getTeamMemberById(id: number) {
      return teamMembers.find((member) => member.id === id);
   }

   // Get priority badge class
   function getPriorityClass(priority: string) {
      switch (priority) {
         case "high":
            return "bg-destructive text-destructive-foreground";
         case "medium":
            return "bg-amber-500 text-white";
         case "low":
            return "bg-muted text-muted-foreground";
         default:
            return "bg-secondary text-secondary-foreground";
      }
   }

   // Get active due diligence for a deal
   function getActiveDueDiligenceForDeal(dealId: number) {
      return activeDueDiligence.find((dd) => dd.dealId === dealId);
   }

   // Format currency string
   function formatCurrency(value: string) {
      return value;
   }

   // Format date string
   function formatDate(dateStr: string) {
      return new Date(dateStr).toLocaleDateString("en-US", {
         year: "numeric",
         month: "short",
         day: "numeric",
      });
   }

   // Get material status class
   function getMaterialStatusClass(status: string) {
      switch (status) {
         case "completed":
            return "bg-emerald-500 text-white";
         case "in_progress":
            return "bg-amber-500 text-white";
         case "not_started":
            return "bg-slate-400 text-white";
         default:
            return "bg-secondary text-secondary-foreground";
      }
   }
</script>

<div class="px-4 py-8">
   <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
   >
      <div>
         <h1 class="text-3xl font-bold mb-2">Deal Flow Management</h1>
         <p class="text-muted-foreground mb-6">
            Track potential investments through the pipeline, conduct due
            diligence, and prepare for investment decisions
         </p>
      </div>
      <div class="flex space-x-4">
         <Button>
            <Plus class="size-4 mr-2" />
            Add New Deal
         </Button>
      </div>
   </div>

   <!-- grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-6 -->
   <div class="">
      <!-- md:col-span-3 lg:col-span-4 -->
      <div class="">
         <Tabs
            value={activeTab}
            onValueChange={(value) => (activeTab = value)}
            class="w-full"
         >
            <TabsList>
               <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
               <TabsTrigger value="due-diligence">Due Diligence</TabsTrigger>

               <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
               <TabsTrigger value="comparison">Deal Comparison</TabsTrigger>
               <TabsTrigger value="committee">Committee</TabsTrigger>
            </TabsList>

            <!-- Pipeline Tab - Kanban-style visualization -->
            <TabsContent value="pipeline" class="space-y-4">
               <div>
                  <PipelineKanbanVisualization
                     {pipelineStages}
                     {getDealsByStage}
                     {getPriorityClass}
                     {getActiveDueDiligenceForDeal}
                  />
               </div>
            </TabsContent>

            <!-- Due Diligence Tab - Workflow and Checklists -->
            <TabsContent value="due-diligence" class="space-y-6">
               <DueDiligenceTabContent
                  {activeDueDiligence}
                  {dueDiligenceTemplates}
                  {getDealById}
                  {formatDate}
               />
            </TabsContent>

            <!-- Collaboration Tab - Team Coordination and Sharing -->
            <TabsContent value="collaboration" class="space-y-6">
               <CollaborationTabContent
                  {teamMembers}
                  {externalCollaborators}
                  {sharedDeals}
                  {getDealById}
               />
            </TabsContent>

            <!-- Comparison Tab - Evaluating multiple opportunities -->
            <TabsContent value="comparison" class="space-y-6">
               <DealComparisonTabContent
                  {dealEvaluations}
                  {comparisonMetrics}
                  {getDealById}
               />
            </TabsContent>

            <!-- Committee Tab - Investment Committee Materials -->
            <TabsContent value="committee" class="space-y-6">
               <CommitteeTabContent
                  {committeeMeetings}
                  {getDealById}
                  {getTeamMemberById}
                  {getMaterialStatusClass}
               />
            </TabsContent>
         </Tabs>
      </div>
   </div>
</div>
