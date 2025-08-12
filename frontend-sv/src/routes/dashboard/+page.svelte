<script lang="ts">
  import { page } from "$app/stores";
</script>

<div class="container py-8">
  <div class="max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-2">Dashboard</h1>
    <p class="text-muted-foreground mb-8">Welcome to your StartupConnect dashboard</p>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-2">Profile</h2>
        <p class="text-muted-foreground">Manage your profile and settings</p>
      </div>
      
      <div class="border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-2">Connections</h2>
        <p class="text-muted-foreground">View and manage your connections</p>
      </div>
      
      <div class="border rounded-lg p-6">
        <h2 class="text-xl font-semibold mb-2">Notifications</h2>
        <p class="text-muted-foreground">View your recent notifications</p>
      </div>
    </div>
  </div>
</div>