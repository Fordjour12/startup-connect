<script lang="ts">
  import { page } from "$app/state";
    import { enhance } from "$app/forms";
    import type { ActionData, PageData } from "./$types";
    import { Button } from "$lib/components/ui/button";
    import { Input } from "$lib/components/ui/input";
    import { Label } from "$lib/components/ui/label";
    import { Switch } from "$lib/components/ui/switch";
    import { Separator } from "$lib/components/ui/separator";
    import { toast } from "svelte-sonner";
    import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
    } from "$lib/components/ui/select";
    import {
        Avatar,
        AvatarFallback,
        AvatarImage,
    } from "$lib/components/ui/avatar";
    import User from "@lucide/svelte/icons/user";
    import Shield from "@lucide/svelte/icons/shield";
    import Bell from "@lucide/svelte/icons/bell";
    import Palette from "@lucide/svelte/icons/palette";
    import Zap from "@lucide/svelte/icons/zap";
    import Database from "@lucide/svelte/icons/database";
    import AlertCircle from "@lucide/svelte/icons/alert-circle";
    import Trash2 from "@lucide/svelte/icons/trash-2";
    import UploadCloud from "@lucide/svelte/icons/upload-cloud";
    import type {
        FounderSettingsData,
        FounderProfileSettings,
        FounderAccountSettings,
    } from "./+page.server";

    let { data, form }: { data: PageData; form: ActionData } = $props();

    let settings = $state(data.settings as FounderSettingsData);
    let currentTab = $state("profile"); // Default tab

    // Reactive statements for form feedback
    $effect(() => {
        if (form?.success && form?.message) {
            toast.success(form.message);
        }
        if (form?.error) {
            toast.error(form.error);
            // If form data is returned on error, update the local state to reflect inputs
            if (form.data) {
                const erroredFormKey =
                    page.form?.action
                        ?.split("/")
                        .pop()
                        ?.split("?")[1]
                        ?.substring(7) ?? "";

                if (erroredFormKey === "updateProfile") {
                    // form.data is the profile object directly
                    settings.profile = {
                        ...settings.profile,
                        ...(form.data as FounderProfileSettings),
                    };
                }
                // Add similar logic for other forms if they return data on error
                else if (erroredFormKey === "updateAccount") {
                    settings.account = {
                        ...settings.account,
                        ...(form.data as FounderAccountSettings),
                    };
                }
            }
        }
    });

    // For profile picture preview
    let profilePicturePreview = $state(
        settings.profile.profilePictureUrl || "",
    );
    function handleProfilePictureChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target?.result) {
                    profilePicturePreview = e.target.result as string;
                    // settings.profile.profilePictureUrl = e.target.result as string; // This would be set upon successful upload
                }
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    const accentColors = [
        { name: "Blue", value: "#3b82f6" },
        { name: "Green", value: "#22c55e" },
        { name: "Purple", value: "#8b5cf6" },
        { name: "Red", value: "#ef4444" },
        { name: "Orange", value: "#f97316" },
    ];

    function getNotificationTypeName(type: string) {
        return type
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }
</script>

<svelte:head>
    <title>{data.seo.title}</title>
    <meta name="description" content={data.seo.description} />
</svelte:head>

<div class="container mx-auto px-4 py-8">
    <div class="mb-8">
        <h1 class="text-3xl font-bold">Settings</h1>
        <p class="text-muted-foreground mt-1">
            Manage your founder profile, account, and preferences.
        </p>
    </div>

    <div class="flex flex-col md:flex-row gap-8">
        <!-- Sidebar Navigation -->
        <nav class="md:w-1/4 lg:w-1/5 space-y-1">
            <Button
                variant={currentTab === "profile" ? "secondary" : "ghost"}
                class="w-full justify-start"
                onclick={() => (currentTab = "profile")}
            >
                <User class="mr-2 h-4 w-4" /> Profile
            </Button>
            <Button
                variant={currentTab === "account" ? "secondary" : "ghost"}
                class="w-full justify-start"
                onclick={() => (currentTab = "account")}
            >
                <Shield class="mr-2 h-4 w-4" /> Account & Security
            </Button>
            <Button
                variant={currentTab === "notifications" ? "secondary" : "ghost"}
                class="w-full justify-start"
                onclick={() => (currentTab = "notifications")}
            >
                <Bell class="mr-2 h-4 w-4" /> Notifications
            </Button>
            <Button
                variant={currentTab === "appearance" ? "secondary" : "ghost"}
                class="w-full justify-start"
                onclick={() => (currentTab = "appearance")}
            >
                <Palette class="mr-2 h-4 w-4" /> Appearance
            </Button>
            <Button
                variant={currentTab === "integrations" ? "secondary" : "ghost"}
                class="w-full justify-start"
                onclick={() => (currentTab = "integrations")}
            >
                <Zap class="mr-2 h-4 w-4" /> Integrations
            </Button>
            <Button
                variant={currentTab === "data" ? "secondary" : "ghost"}
                class="w-full justify-start"
                onclick={() => (currentTab = "data")}
            >
                <Database class="mr-2 h-4 w-4" /> Data & Privacy
            </Button>
        </nav>

        <!-- Content Area -->
        <div class="flex-1">
            {#if currentTab === "profile"}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Settings</CardTitle>
                        <CardDescription
                            >Update your personal and company information.</CardDescription
                        >
                    </CardHeader>
                    <form method="POST" action="?/updateProfile" use:enhance>
                        <CardContent class="space-y-6">
                            <div class="flex items-center gap-4">
                                <Avatar class="h-20 w-20">
                                    <AvatarImage
                                        src={profilePicturePreview}
                                        alt={settings.profile.fullName}
                                    />
                                    <AvatarFallback
                                        >{settings.profile.fullName
                                            ?.substring(0, 2)
                                            .toUpperCase() ||
                                            "AV"}</AvatarFallback
                                    >
                                </Avatar>
                                <div>
                                    <Label
                                        for="profilePicture"
                                        class="mb-1 block"
                                        >Profile Picture</Label
                                    >
                                    <Input
                                        id="profilePicture"
                                        type="file"
                                        name="profilePicture"
                                        onchange={handleProfilePictureChange}
                                        class="text-sm"
                                    />
                                    <p
                                        class="text-xs text-muted-foreground mt-1"
                                    >
                                        PNG, JPG, GIF up to 5MB.
                                    </p>
                                </div>
                            </div>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="space-y-1">
                                    <Label for="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        name="fullName"
                                        value={settings.profile.fullName}
                                        oninput={(e) =>
                                            (settings.profile.fullName =
                                                e.currentTarget.value)}
                                    />
                                </div>
                                <div class="space-y-1">
                                    <Label for="role">Role</Label>
                                    <Input
                                        id="role"
                                        name="role"
                                        value={settings.profile.role}
                                        oninput={(e) =>
                                            (settings.profile.role =
                                                e.currentTarget.value)}
                                    />
                                </div>
                            </div>

                            <Separator />
                            <h4 class="text-lg font-medium">
                                Company Information
                            </h4>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="space-y-1">
                                    <Label for="companyName">Company Name</Label
                                    >
                                    <Input
                                        id="companyName"
                                        name="companyName"
                                        value={settings.profile.companyName}
                                        oninput={(e) =>
                                            (settings.profile.companyName =
                                                e.currentTarget.value)}
                                    />
                                </div>
                                <div class="space-y-1">
                                    <Label for="companyWebsite"
                                        >Company Website</Label
                                    >
                                    <Input
                                        id="companyWebsite"
                                        name="companyWebsite"
                                        type="url"
                                        value={settings.profile.companyWebsite}
                                        oninput={(e) =>
                                            (settings.profile.companyWebsite =
                                                e.currentTarget.value)}
                                    />
                                </div>
                                <div class="space-y-1">
                                    <Label for="companyIndustry">Industry</Label
                                    >
                                    <Input
                                        id="companyIndustry"
                                        name="companyIndustry"
                                        value={settings.profile.companyIndustry}
                                        oninput={(e) =>
                                            (settings.profile.companyIndustry =
                                                e.currentTarget.value)}
                                    />
                                </div>
                                <div class="space-y-1">
                                    <Label for="companyStage"
                                        >Company Stage</Label
                                    >
                                    <Select type="single" name="companyStage">
                                        <SelectTrigger id="companyStage">
                                            Select stage...
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Idea"
                                                >Idea</SelectItem
                                            >
                                            <SelectItem value="MVP"
                                                >MVP</SelectItem
                                            >
                                            <SelectItem value="Pre-Seed"
                                                >Pre-Seed</SelectItem
                                            >
                                            <SelectItem value="Seed"
                                                >Seed</SelectItem
                                            >
                                            <SelectItem value="Series A"
                                                >Series A</SelectItem
                                            >
                                            <SelectItem value="Series B+"
                                                >Series B+</SelectItem
                                            >
                                            <SelectItem value="Growth"
                                                >Growth</SelectItem
                                            >
                                            <SelectItem value="Established"
                                                >Established</SelectItem
                                            >
                                        </SelectContent>
                                    </Select>
                                    <input
                                        type="hidden"
                                        name="companyStage"
                                        value={settings.profile.companyStage}
                                    />
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">Save Profile</Button>
                        </CardFooter>
                    </form>
                </Card>
            {:else if currentTab === "account"}
                <Card>
                    <CardHeader>
                        <CardTitle>Account & Security</CardTitle>
                        <CardDescription
                            >Manage your email, password, and two-factor
                            authentication.</CardDescription
                        >
                    </CardHeader>
                    <form method="POST" action="?/updateAccount" use:enhance>
                        <CardContent class="space-y-6">
                            <div class="space-y-1">
                                <Label for="email">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={settings.account.email}
                                    on:input={(e) =>
                                        (settings.account.email =
                                            e.currentTarget.value)}
                                />
                            </div>

                            <Separator />
                            <h4 class="text-lg font-medium">Change Password</h4>
                            <div class="space-y-1">
                                <Label for="currentPassword"
                                    >Current Password</Label
                                >
                                <Input
                                    id="currentPassword"
                                    name="currentPassword"
                                    type="password"
                                    placeholder="Enter current password"
                                />
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="space-y-1">
                                    <Label for="newPassword">New Password</Label
                                    >
                                    <Input
                                        id="newPassword"
                                        name="newPassword"
                                        type="password"
                                        placeholder="Enter new password"
                                    />
                                </div>
                                <div class="space-y-1">
                                    <Label for="confirmPassword"
                                        >Confirm New Password</Label
                                    >
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Confirm new password"
                                    />
                                </div>
                            </div>

                            <Separator />
                            <h4 class="text-lg font-medium">
                                Two-Factor Authentication (2FA)
                            </h4>
                            <div
                                class="flex items-center justify-between rounded-lg border p-4"
                            >
                                <div>
                                    <Label
                                        for="twoFactorEnabled"
                                        class="font-medium">Enable 2FA</Label
                                    >
                                    <p class="text-sm text-muted-foreground">
                                        Enhance your account security by
                                        requiring a second form of verification.
                                    </p>
                                </div>
                                <Switch
                                    id="twoFactorEnabled"
                                    name="twoFactorEnabled"
                                    checked={settings.account.twoFactorEnabled}
                                    onchange={(e) =>
                                        (settings.account.twoFactorEnabled =
                                            e.currentTarget.checked)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">Save Account Settings</Button>
                        </CardFooter>
                    </form>
                </Card>
            {:else if currentTab === "notifications"}
                <Card>
                    <CardHeader>
                        <CardTitle>Notification Preferences</CardTitle>
                        <CardDescription
                            >Choose how you want to be notified about important
                            activities.</CardDescription
                        >
                    </CardHeader>
                    <form
                        method="POST"
                        action="?/updateNotificationPreferences"
                        use:enhance
                    >
                        <CardContent class="space-y-6">
                            <div class="space-y-4">
                                <div
                                    class="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 items-center mb-2 font-medium text-sm text-muted-foreground"
                                >
                                    <span class="col-span-1 sm:col-span-1"
                                        >Notification Type</span
                                    >
                                    <span class="text-center hidden sm:block"
                                        >In-App</span
                                    >
                                    <span class="text-center hidden sm:block"
                                        >Email</span
                                    >
                                </div>
                                {#each settings.notificationPreferences as pref (pref.type)}
                                    <div
                                        class="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 items-center py-3 border-b last:border-b-0"
                                    >
                                        <div class="col-span-2 sm:col-span-1">
                                            <Label
                                                for="{pref.type}-inApp"
                                                class="font-medium"
                                                >{getNotificationTypeName(
                                                    pref.type,
                                                )}</Label
                                            >
                                            <p
                                                class="text-xs text-muted-foreground"
                                            >
                                                {pref.description}
                                            </p>
                                        </div>
                                        <div
                                            class="flex items-center justify-end sm:justify-center"
                                        >
                                            <Switch
                                                id="{pref.type}-inApp"
                                                name="{pref.type}-inApp"
                                                checked={pref.inApp}
                                                onchange={(e) =>
                                                    (pref.inApp =
                                                        e.currentTarget.checked)}
                                            />
                                            <span class="sm:hidden ml-2 text-sm"
                                                >In-App</span
                                            >
                                        </div>
                                        <div
                                            class="flex items-center justify-end sm:justify-center"
                                        >
                                            <Switch
                                                id="{pref.type}-email"
                                                name="{pref.type}-email"
                                                checked={pref.email}
                                                onchange={(e) =>
                                                    (pref.email =
                                                        e.currentTarget.checked)}
                                            />
                                            <span class="sm:hidden ml-2 text-sm"
                                                >Email</span
                                            >
                                        </div>
                                    </div>
                                {/each}
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit"
                                >Save Notification Preferences</Button
                            >
                        </CardFooter>
                    </form>
                </Card>
            {:else if currentTab === "appearance"}
                <Card>
                    <CardHeader>
                        <CardTitle>Appearance Settings</CardTitle>
                        <CardDescription
                            >Customize the look and feel of your dashboard.</CardDescription
                        >
                    </CardHeader>
                    <form method="POST" action="?/updateAppearance" use:enhance>
                        <CardContent class="space-y-6">
                            <div class="space-y-1">
                                <Label for="theme">Theme</Label>
                                <Select type="single" name="theme">
                                    <SelectTrigger id="theme">
                                        Select theme...
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="light"
                                            >Light</SelectItem
                                        >
                                        <SelectItem value="dark"
                                            >Dark</SelectItem
                                        >
                                        <SelectItem value="system"
                                            >System Default</SelectItem
                                        >
                                    </SelectContent>
                                </Select>
                                <input
                                    type="hidden"
                                    name="theme"
                                    value={settings.appearance.theme}
                                />
                            </div>

                            <div class="space-y-1">
                                <Label for="accentColor">Accent Color</Label>
                                <div class="flex gap-2 flex-wrap">
                                    {#each accentColors as color}
                                        <Button
                                            type="button"
                                            variant={settings.appearance
                                                .accentColor === color.value
                                                ? "default"
                                                : "outline"}
                                            onclick={() =>
                                                (settings.appearance.accentColor =
                                                    color.value)}
                                            class="h-8 w-8 p-0 border-2"
                                            style="background-color: {color.value}; border-color: {settings
                                                .appearance.accentColor ===
                                            color.value
                                                ? 'var(--ring)'
                                                : color.value};"
                                            title={color.name}
                                        >
                                            <span class="sr-only"
                                                >{color.name}</span
                                            >
                                        </Button>
                                    {/each}
                                </div>
                                <input
                                    type="hidden"
                                    name="accentColor"
                                    value={settings.appearance.accentColor}
                                />
                            </div>

                            <div class="space-y-1">
                                <Label for="dashboardLayout"
                                    >Dashboard Layout</Label
                                >
                                <Select type="single" name="dashboardLayout">
                                    <SelectTrigger id="dashboardLayout">
                                        Select layout...
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="comfortable"
                                            >Comfortable</SelectItem
                                        >
                                        <SelectItem value="compact"
                                            >Compact</SelectItem
                                        >
                                    </SelectContent>
                                </Select>
                                <input
                                    type="hidden"
                                    name="dashboardLayout"
                                    value={settings.appearance.dashboardLayout}
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button type="submit">Save Appearance</Button>
                        </CardFooter>
                    </form>
                </Card>
            {:else if currentTab === "integrations"}
                <Card>
                    <CardHeader>
                        <CardTitle>Integrations</CardTitle>
                        <CardDescription
                            >Connect your favorite tools and services.</CardDescription
                        >
                    </CardHeader>
                    <CardContent class="space-y-4">
                        {#each settings.integrations as integration (integration.name)}
                            <div
                                class="flex items-center justify-between rounded-lg border p-4"
                            >
                                <div class="flex items-center gap-3">
                                    <!-- Placeholder for actual icon -->
                                    <div
                                        class="h-8 w-8 bg-muted rounded-sm flex items-center justify-center"
                                    >
                                        <Zap
                                            class="h-4 w-4 text-muted-foreground"
                                        />
                                    </div>
                                    <div>
                                        <h4 class="font-medium">
                                            {integration.name}
                                        </h4>
                                        <p
                                            class="text-sm text-muted-foreground"
                                        >
                                            {integration.description}
                                        </p>
                                    </div>
                                </div>
                                <form
                                    method="POST"
                                    action="?/manageIntegration"
                                    use:enhance
                                >
                                    <input
                                        type="hidden"
                                        name="integrationName"
                                        value={integration.name}
                                    />
                                    <input
                                        type="hidden"
                                        name="connect"
                                        value={!integration.connected}
                                    />
                                    <Button
                                        type="submit"
                                        variant={integration.connected
                                            ? "destructive"
                                            : "outline"}
                                    >
                                        {integration.connected
                                            ? "Disconnect"
                                            : "Connect"}
                                    </Button>
                                </form>
                            </div>
                        {/each}
                        {#if settings.integrations.length === 0}
                            <p class="text-muted-foreground text-center py-4">
                                No integrations available yet.
                            </p>
                        {/if}
                    </CardContent>
                </Card>
            {:else if currentTab === "data"}
                <div class="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Export</CardTitle>
                            <CardDescription
                                >Download a copy of your key data.</CardDescription
                            >
                        </CardHeader>
                        <CardContent>
                            <p class="text-sm text-muted-foreground mb-4">
                                You can request an export of your profile,
                                company information, and other relevant data.
                                This will be provided as a JSON file.
                            </p>
                            <form
                                method="POST"
                                action="?/exportData"
                                use:enhance
                            >
                                <Button type="submit" variant="outline">
                                    <Database class="mr-2 h-4 w-4" /> Request Data
                                    Export
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    <Card class="border-destructive">
                        <CardHeader>
                            <CardTitle
                                class="text-destructive flex items-center"
                            >
                                <AlertCircle class="mr-2 h-5 w-5" /> Danger Zone
                            </CardTitle>
                            <CardDescription
                                >These actions are irreversible. Please proceed
                                with caution.</CardDescription
                            >
                        </CardHeader>
                        <CardContent>
                            <h4 class="font-medium mb-2">Delete Account</h4>
                            <p class="text-sm text-muted-foreground mb-4">
                                Permanently delete your account and all
                                associated data. This action cannot be undone.
                            </p>
                            <form
                                method="POST"
                                action="?/deleteAccount"
                                use:enhance
                                onsubmit={(e) => {
                                    if (
                                        !confirm(
                                            "Are you sure you want to permanently delete your account? This action cannot be undone.",
                                        )
                                    ) {
                                        e.preventDefault();
                                    }
                                }}
                            >
                                <Button type="submit" variant="destructive">
                                    <Trash2 class="mr-2 h-4 w-4" /> Delete My Account
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            {/if}
        </div>
    </div>
</div>
