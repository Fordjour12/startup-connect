<script lang="ts">
   let { children } = $props();
</script>

<div class="min-h-screen bg-background">
   <div class="container mx-auto px-4 py-8">
      <div class="flex items-center justify-between mb-8">
         <div class="flex items-center space-x-2">
            <img src="/logo.svg" alt="Logo" class="h-8 w-8" />
            <span class="text-xl font-semibold">StartupConnect</span>
         </div>
         <div class="text-sm text-muted-foreground">Step 1 of 1</div>
      </div>

      {@render children()}
   </div>
</div>
