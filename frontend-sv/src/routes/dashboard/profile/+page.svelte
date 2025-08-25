<script lang="ts">
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
  import {
	User,
	Mail,
	Building2,
	MapPin,
	Calendar,
	Edit,
	Save,
	X
} from '@lucide/svelte';

  export let data: { user: any };

  const { user } = data;

  let editing = false;

  // Mock user profile data - in real app, this would come from API
  let profileData = {
    name: user.name || 'John Doe',
    email: user.email || 'john@example.com',
    role: user.role || 'USER',
    company: 'TechFlow Solutions',
    location: 'San Francisco, CA',
    bio: 'Passionate entrepreneur with 5+ years of experience in SaaS and technology startups.',
    website: 'https://techflow.com',
    linkedin: 'https://linkedin.com/in/johndoe',
    twitter: 'https://twitter.com/johndoe',
    joined: '2023-01-15'
  };

  function getInitials(name: string) {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  function getRoleDisplayName(role: string) {
    return role.charAt(0).toUpperCase() + role.slice(1);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function toggleEditing() {
    editing = !editing;
  }

  function saveProfile() {
    // In real app, this would save to API
    editing = false;
  }

  function cancelEditing() {
    // Reset form data
    editing = false;
  }
</script>

<svelte:head>
  <title>Profile - StartupConnect</title>
  <meta name="description" content="Manage your profile and account settings" />
</svelte:head>

<div class="container py-8">
  <div class="max-w-4xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold mb-2">Profile</h1>
        <p class="text-muted-foreground text-lg">
          Manage your profile information and account settings
        </p>
      </div>
      {#if !editing}
        <Button onclick={toggleEditing}>
          <Edit class="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      {:else}
        <div class="flex space-x-2">
          <Button variant="outline" onclick={cancelEditing}>
            <X class="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onclick={saveProfile}>
            <Save class="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      {/if}
    </div>

    <!-- Profile Overview -->
    <Card class="mb-8">
      <CardHeader>
        <div class="flex items-center space-x-6">
          <Avatar class="w-24 h-24">
            <AvatarImage src="" alt={profileData.name} />
            <AvatarFallback class="text-2xl">{getInitials(profileData.name)}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle class="text-2xl">{profileData.name}</CardTitle>
            <div class="flex items-center space-x-2 mt-2">
              <Badge variant="secondary">{getRoleDisplayName(profileData.role)}</Badge>
              <Badge variant="outline">Member since {formatDate(profileData.joined)}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p class="text-muted-foreground text-lg">{profileData.bio}</p>
      </CardContent>
    </Card>

    <!-- Profile Details -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Personal Information -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center space-x-2">
            <User class="h-5 w-5" />
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <label for="fullName" class="text-sm font-medium">Full Name</label>
            {#if editing}
              <input 
                id="fullName"
                type="text" 
                bind:value={profileData.name}
                class="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
              />
            {:else}
              <p class="mt-1 text-sm">{profileData.name}</p>
            {/if}
          </div>
          
          <div>
            <label for="email" class="text-sm font-medium">Email</label>
            {#if editing}
              <input 
                id="email"
                type="email" 
                bind:value={profileData.email}
                class="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
              />
            {:else}
              <p class="mt-1 text-sm">{profileData.email}</p>
            {/if}
          </div>
          
          <div>
            <label for="company" class="text-sm font-medium">Company</label>
            {#if editing}
              <input 
                id="company"
                type="text" 
                bind:value={profileData.company}
                class="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
              />
            {:else}
              <p class="mt-1 text-sm">{profileData.company}</p>
            {/if}
          </div>
          
          <div>
            <label for="location" class="text-sm font-medium">Location</label>
            {#if editing}
              <input 
                id="location"
                type="text" 
                bind:value={profileData.location}
                class="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
              />
            {:else}
              <p class="mt-1 text-sm">{profileData.location}</p>
            {/if}
          </div>
        </CardContent>
      </Card>

      <!-- Contact & Social -->
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center space-x-2">
            <Mail class="h-5 w-5" />
            <span>Contact & Social</span>
          </CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <label for="website" class="text-sm font-medium">Website</label>
            {#if editing}
              <input 
                id="website"
                type="url" 
                bind:value={profileData.website}
                class="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
              />
            {:else}
              <p class="mt-1 text-sm">
                <a href={profileData.website} target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
                  {profileData.website}
                </a>
              </p>
            {/if}
          </div>
          
          <div>
            <label for="linkedin" class="text-sm font-medium">LinkedIn</label>
            {#if editing}
              <input 
                id="linkedin"
                type="url" 
                bind:value={profileData.linkedin}
                class="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
              />
            {:else}
              <p class="mt-1 text-sm">
                <a href={profileData.linkedin} target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
                  {profileData.linkedin}
                </a>
              </p>
            {/if}
          </div>
          
          <div>
            <label for="twitter" class="text-sm font-medium">Twitter</label>
            {#if editing}
              <input 
                id="twitter"
                type="url" 
                bind:value={profileData.twitter}
                class="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
              />
            {:else}
              <p class="mt-1 text-sm">
                <a href={profileData.twitter} target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
                  {profileData.twitter}
                </a>
              </p>
            {/if}
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Bio Section -->
    <Card class="mt-6">
      <CardHeader>
        <CardTitle>About Me</CardTitle>
        <CardDescription>Tell others about yourself and your experience</CardDescription>
      </CardHeader>
              <CardContent>
          {#if editing}
            <textarea 
              id="bio"
              bind:value={profileData.bio}
              rows={4}
              class="w-full px-3 py-2 border border-input rounded-md bg-background"
              placeholder="Tell us about yourself..."
            ></textarea>
          {:else}
            <p class="text-muted-foreground">{profileData.bio}</p>
          {/if}
        </CardContent>
    </Card>

    <!-- Account Settings -->
    <Card class="mt-6">
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account preferences and security</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 class="font-medium">Change Password</h3>
            <p class="text-sm text-muted-foreground">Update your account password</p>
          </div>
          <Button variant="outline">Change</Button>
        </div>
        
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 class="font-medium">Two-Factor Authentication</h3>
            <p class="text-sm text-muted-foreground">Add an extra layer of security</p>
          </div>
          <Button variant="outline">Enable</Button>
        </div>
        
        <div class="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h3 class="font-medium">Notification Preferences</h3>
            <p class="text-sm text-muted-foreground">Manage your email and push notifications</p>
          </div>
          <Button variant="outline">Configure</Button>
        </div>
      </CardContent>
    </Card>

    <!-- Coming Soon Notice -->
    <Card class="mt-8 text-center">
      <CardHeader>
        <CardTitle>More Profile Features Coming Soon</CardTitle>
        <CardDescription>
          We're working on additional profile features including skill endorsements, 
          portfolio showcase, and advanced privacy controls.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" disabled>
          Coming Soon
        </Button>
      </CardContent>
    </Card>
  </div>
</div>
