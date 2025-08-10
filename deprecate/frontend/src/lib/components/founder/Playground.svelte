<script lang="ts">
  import { startupSchema } from "$lib/schemas/startup-schema";
  import { Button } from "@/components/ui/button";
  import { Textarea } from "@/components/ui/textarea";

  let jsonInput = $state("");
  let result = $state<any>(null);
  let error = $state<string | null>(null);

  // Use callback prop instead of createEventDispatcher
  let { onPopulate }: { onPopulate?: (data: any) => void } = $props();

  function validateJson() {
    error = null;
    result = null;
    try {
      const parsed = JSON.parse(jsonInput);
      const validation = startupSchema.safeParse(parsed);
      if (validation.success) {
        result = validation.data;
        // Call the callback function instead of dispatching event
        // validation.data)
        onPopulate?.(result);
      } else {
        error = JSON.stringify(validation.error.format(), null, 2);
      }
    } catch (e) {
      error = "Invalid JSON: " + (e as Error).message;
    }
  }

  function clearPlayground() {
    jsonInput = "";
    result = null;
    error = null;
  }
</script>

<div class="space-y-4 p-4 border rounded-lg bg-muted/50">
  <div class="flex justify-between items-center">
    <h3 class="text-lg font-semibold">JSON Playground</h3>
    <div class="flex gap-2">
      <Button variant="outline" size="sm" onclick={clearPlayground}
        >Clear</Button
      >
      <Button size="sm" onclick={validateJson}>Populate Form</Button>
    </div>
  </div>

  <Textarea
    bind:value={jsonInput}
    rows={10}
    class="font-mono text-sm"
    placeholder="Paste your startup JSON here..."
  />

  {#if result}
    <div class="space-y-2">
      <h4 class="font-medium text-green-600">
        ✅ Valid Data - Form Populated!
      </h4>
      <details class="text-sm">
        <summary class="cursor-pointer text-muted-foreground"
          >View parsed data</summary
        >
        <pre
          class="mt-2 p-2 bg-background rounded border overflow-auto max-h-40">{JSON.stringify(
            result,
            null,
            2,
          )}</pre>
      </details>
    </div>
  {/if}

  {#if error}
    <div class="space-y-2">
      <h4 class="font-medium text-destructive">❌ Validation Error</h4>
      <pre
        class="text-destructive text-sm p-2 bg-background rounded border overflow-auto max-h-40">{error}</pre>
    </div>
  {/if}
</div>
