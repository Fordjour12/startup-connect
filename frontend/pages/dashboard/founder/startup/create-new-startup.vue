<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";
import { ref } from "vue";
import { toast } from "vue-sonner";
import FileUpload from '@/components/FileUpload.vue';

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  linkedin?: string;
}

const isLoading = ref(false);
const pitchDeckFile = ref<File | null>(null);
const logoFile = ref<File | null>(null);
const logoPreview = ref<string | null>(null);
const showPreview = ref(true);
const showTeamSection = ref(false);
const productScreenshots = ref<File[]>([]);
const demoVideo = ref<File | null>(null);
const screenshotPreviews = ref<string[]>([]);

const formSchema = toTypedSchema(z.object({
  name: z.string().min(2, "Startup name must be at least 2 characters"),
  description: z.string().min(50, "Description must be at least 50 characters"),
  industry: z.string().min(1, "Please select an industry"),
  location: z.string().min(1, "Please enter a location"),
  fundingStage: z.string().min(1, "Please select a funding stage"),
  foundedYear: z.number().min(4, "Please enter a valid year"),
  teamSize: z.number().min(1, "Please enter team size"),
  website: z.string().url("Please enter a valid website URL"),
  logo: z.any().optional(),
  teamMembers: z.array(z.object({
    name: z.string().min(1, "Name is required"),
    role: z.string().min(1, "Role is required"),
    bio: z.string().min(1, "Bio is required"),
    linkedin: z.string().url("Please enter a valid LinkedIn URL").optional()
  })).optional(),
  funding: z.object({
    total: z.string().min(1, "Please enter total funding"),
    lastRound: z.string().min(1, "Please enter last round"),
    investors: z.string().min(1, "Please enter investors")
  }),
  metrics: z.object({
    revenue: z.string().min(1, "Please enter revenue"),
    growth: z.string().min(1, "Please enter growth"),
    customers: z.string().min(1, "Please enter number of customers")
  }),
  socialMedia: z.object({
    twitter: z.string().url("Please enter a valid Twitter URL").optional(),
    linkedin: z.string().url("Please enter a valid LinkedIn URL").optional(),
    facebook: z.string().url("Please enter a valid Facebook URL").optional(),
    instagram: z.string().url("Please enter a valid Instagram URL").optional()
  }).optional(),
  contact: z.object({
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().optional(),
    address: z.string().optional()
  }),
  businessModel: z.string().min(1, "Please describe your business model"),
  targetMarket: z.string().min(1, "Please describe your target market"),
  competitors: z.string().min(1, "Please list your main competitors"),
  traction: z.object({
    users: z.string().optional(),
    revenue: z.string().optional(),
    growth: z.string().optional(),
    partnerships: z.string().optional()
  }).optional(),
  useOfFunds: z.object({
    product: z.string().min(1, "Please describe product development plans"),
    marketing: z.string().min(1, "Please describe marketing plans"),
    operations: z.string().min(1, "Please describe operational plans"),
    team: z.string().min(1, "Please describe team expansion plans"),
    other: z.string().optional()
  }),
  timeline: z.object({
    past: z.array(z.object({
      date: z.string().min(1, "Date is required"),
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
      type: z.enum(["achievement", "funding", "partnership", "product", "other"])
    })).optional(),
    future: z.array(z.object({
      date: z.string().min(1, "Date is required"),
      title: z.string().min(1, "Title is required"),
      description: z.string().min(1, "Description is required"),
      type: z.enum(["launch", "funding", "partnership", "product", "other"])
    })).optional()
  }).optional()
}));

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: "",
    description: "",
    industry: "",
    location: "",
    fundingStage: "",
    foundedYear: 0,
    teamSize: 0,
    website: "",
    logo: null,
    teamMembers: [],
    funding: {
      total: "",
      lastRound: "",
      investors: ""
    },
    metrics: {
      revenue: "",
      growth: "",
      customers: ""
    },
    socialMedia: {
      twitter: "",
      linkedin: "",
      facebook: "",
      instagram: ""
    },
    contact: {
      email: "",
      phone: "",
      address: ""
    },
    businessModel: "",
    targetMarket: "",
    competitors: "",
    traction: {
      users: "",
      revenue: "",
      growth: "",
      partnerships: ""
    },
    useOfFunds: {
      product: "",
      marketing: "",
      operations: "",
      team: "",
      other: ""
    },
    timeline: {
      past: [],
      future: []
    }
  }
});

const handleFileUpload = (files: File[]) => {
  if (files.length > 0) {
    pitchDeckFile.value = files[0];
  }
};

const handleFileRemove = () => {
  pitchDeckFile.value = null;
};

const handleLogoUpload = (files: File[]) => {
  if (files.length > 0) {
    logoFile.value = files[0];
    // Create preview URL
    logoPreview.value = URL.createObjectURL(files[0]);
  }
};

const handleLogoRemove = () => {
  logoFile.value = null;
  if (logoPreview.value) {
    URL.revokeObjectURL(logoPreview.value);
    logoPreview.value = null;
  }
};

const addTeamMember = () => {
  const currentTeamMembers = form.values.teamMembers || [];
  form.setFieldValue('teamMembers', [
    ...currentTeamMembers,
    {
      name: '',
      role: '',
      bio: '',
      linkedin: ''
    }
  ]);
};

const removeTeamMember = (index: number) => {
  const currentTeamMembers = form.values.teamMembers || [];
  form.setFieldValue('teamMembers', currentTeamMembers.filter((_, i) => i !== index));
};

const togglePreview = () => {
  showPreview.value = !showPreview.value;
};

const toggleTeamSection = () => {
  showTeamSection.value = !showTeamSection.value;
};

const handleScreenshotUpload = (files: File[]) => {
  productScreenshots.value = files;
  // Create preview URLs
  screenshotPreviews.value = files.map(file => URL.createObjectURL(file));
};

const handleScreenshotRemove = (index: number) => {
  productScreenshots.value.splice(index, 1);
  URL.revokeObjectURL(screenshotPreviews.value[index]);
  screenshotPreviews.value.splice(index, 1);
};

const handleDemoVideoUpload = (files: File[]) => {
  if (files.length > 0) {
    demoVideo.value = files[0];
  }
};

const handleDemoVideoRemove = () => {
  demoVideo.value = null;
};

const addPastMilestone = () => {
  const currentPast = form.values.timeline?.past || [];
  form.setFieldValue('timeline.past', [
    ...currentPast,
    {
      date: '',
      title: '',
      description: '',
      type: 'achievement'
    }
  ]);
};

const removePastMilestone = (index: number) => {
  const currentPast = form.values.timeline?.past || [];
  form.setFieldValue('timeline.past', currentPast.filter((_, i) => i !== index));
};

const addFutureMilestone = () => {
  const currentFuture = form.values.timeline?.future || [];
  form.setFieldValue('timeline.future', [
    ...currentFuture,
    {
      date: '',
      title: '',
      description: '',
      type: 'launch'
    }
  ]);
};

const removeFutureMilestone = (index: number) => {
  const currentFuture = form.values.timeline?.future || [];
  form.setFieldValue('timeline.future', currentFuture.filter((_, i) => i !== index));
};

const onSubmit = form.handleSubmit(async (values) => {
  isLoading.value = true;
  try {
    // Here you would typically make an API call to create the startup
    const response = await $fetch("/api/create-new-startup",{
      method: "POST",
      body: values
    })
    // console.log("Creating startup:", values);
    // console.log("Pitch deck file:", pitchDeckFile.value);

    toast.success("Startup created successfully", {
      description: "Your startup profile has been created and is now visible to investors."
    });
  } catch (error: unknown) {
    toast.error("Failed to create startup", {
      description: error instanceof Error ? error.message : "There was an error creating your startup profile."
    });
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="container mx-auto py-8">
    <div class=" mx-auto">
      <div class="flex flex-col gap-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold mb-2">Create New Startup</h1>
            <p class="text-muted-foreground">Fill in your startup details to create your profile</p>
          </div>
          <Button variant="outline" @click="togglePreview">
            {{ showPreview ? 'Hide Preview' : 'Show Preview' }}
          </Button>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Form Section -->
          <div :class="{ 'lg:col-span-2': !showPreview }">
            <form @submit="onSubmit" class="space-y-8">
              <!-- Basic Information -->
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Tell us about your startup</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <!-- Logo Upload -->
                  <FormField v-slot="{ componentField }" name="logo">
                    <FormItem>
                      <FormLabel>Startup Logo</FormLabel>
                      <div class="flex items-start gap-4">
                        <!-- <div v-if="logoPreview" class="w-24 h-24 rounded-lg overflow-hidden border">
                          <img :src="logoPreview" alt="Startup logo preview" class="w-full h-full object-cover" />
                        </div> -->
                        <div class="flex-1">
                          <FormControl>
                            <FileUpload
                              accept="image/*"
                              :max-size="2"
                              :multiple="false"
                              @upload="handleLogoUpload"
                              @remove="handleLogoRemove"
                            />
                          </FormControl>
                          <p class="text-sm text-muted-foreground mt-2">
                            Upload your startup logo (max 2MB, recommended size: 400x400px)
                          </p>
                        </div>
                      </div>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField v-slot="{ componentField }" name="name">
                    <FormItem>
                      <FormLabel>Startup Name</FormLabel>
                      <FormControl>
                        <Input v-bind="componentField" placeholder="Enter your startup name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField v-slot="{ componentField }" name="description">
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea v-bind="componentField" placeholder="Describe your startup" class="min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <div class="grid grid-cols-2 gap-4">
                    <FormField v-slot="{ componentField }" name="industry">
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <Select v-bind="componentField">
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Technology">Technology</SelectItem>
                            <SelectItem value="Healthcare">Healthcare</SelectItem>
                            <SelectItem value="Fintech">Fintech</SelectItem>
                            <SelectItem value="Clean Energy">Clean Energy</SelectItem>
                            <SelectItem value="E-commerce">E-commerce</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="location">
                      <FormItem>
                        <FormLabel>Location</FormLabel>
                        <FormControl>
                          <Input v-bind="componentField" placeholder="City, Country" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </div>
                </CardContent>
              </Card>

              <!-- Company Details -->
              <Card>
                <CardHeader>
                  <CardTitle>Company Details</CardTitle>
                  <CardDescription>Additional information about your company</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <FormField v-slot="{ componentField }" name="foundedYear">
                      <FormItem>
                        <FormLabel>Founded Year</FormLabel>
                        <FormControl>
                          <Input v-bind="componentField" type="number" placeholder="YYYY" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="teamSize">
                      <FormItem>
                        <FormLabel>Team Size</FormLabel>
                        <FormControl>
                          <Input v-bind="componentField" type="number" placeholder="Number of employees" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </div>

                  <FormField v-slot="{ componentField }" name="website">
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input v-bind="componentField" placeholder="https://your-startup.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </CardContent>
              </Card>

              <!-- Funding Information -->
              <Card>
                <CardHeader>
                  <CardTitle>Funding Information</CardTitle>
                  <CardDescription>Details about your funding status</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <FormField v-slot="{ componentField }" name="fundingStage">
                    <FormItem>
                      <FormLabel>Funding Stage</FormLabel>
                      <Select v-bind="componentField">
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select funding stage" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Pre-seed">Pre-seed</SelectItem>
                          <SelectItem value="Seed">Seed</SelectItem>
                          <SelectItem value="Series A">Series A</SelectItem>
                          <SelectItem value="Series B">Series B</SelectItem>
                          <SelectItem value="Series C+">Series C+</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <div class="grid grid-cols-2 gap-4">
                    <FormField v-slot="{ componentField }" name="funding.total">
                      <FormItem>
                        <FormLabel>Total Funding</FormLabel>
                        <FormControl>
                          <Input v-bind="componentField" placeholder="e.g., $1M" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="funding.lastRound">
                      <FormItem>
                        <FormLabel>Last Round</FormLabel>
                        <FormControl>
                          <Input v-bind="componentField" placeholder="e.g., Series A" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </div>

                  <FormField v-slot="{ componentField }" name="funding.investors">
                    <FormItem>
                      <FormLabel>Investors</FormLabel>
                      <FormControl>
                        <Input v-bind="componentField" placeholder="List your investors (comma-separated)" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </CardContent>
              </Card>

              <!-- Key Metrics -->
              <Card>
                <CardHeader>
                  <CardTitle>Key Metrics</CardTitle>
                  <CardDescription>Your startup's performance metrics</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <FormField v-slot="{ componentField }" name="metrics.revenue">
                      <FormItem>
                        <FormLabel>Revenue</FormLabel>
                        <FormControl>
                          <Input v-bind="componentField" placeholder="e.g., $500K ARR" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="metrics.growth">
                      <FormItem>
                        <FormLabel>Growth Rate</FormLabel>
                        <FormControl>
                          <Input v-bind="componentField" placeholder="e.g., 200% YoY" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </div>

                  <FormField v-slot="{ componentField }" name="metrics.customers">
                    <FormItem>
                      <FormLabel>Number of Customers</FormLabel>
                      <FormControl>
                        <Input v-bind="componentField" placeholder="e.g., 50+ Enterprise Clients" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </CardContent>
              </Card>

              <!-- Team Section -->
              <Card>
                <CardHeader>
                  <div class="flex items-center justify-between">
                    <div>
                      <CardTitle>Team Members</CardTitle>
                      <CardDescription>Add information about your team</CardDescription>
                    </div>
                    <Button variant="outline" type="button" @click="toggleTeamSection">
                      {{ showTeamSection ? 'Hide Team Section' : 'Show Team Section' }}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent v-if="showTeamSection" class="space-y-4">
                  <div v-for="(member, index) in form?.values?.teamMembers || []" :key="index" class="p-4 border rounded-lg space-y-4">
                    <div class="flex justify-between items-center">
                      <h3 class="font-medium">Team Member {{ index + 1 }}</h3>
                      <Button variant="ghost" type="button" @click="removeTeamMember(index)" class="text-destructive">
                        Remove
                      </Button>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                      <FormField v-slot="{ componentField }" :name="`teamMembers.${index}.name`">
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input v-bind="componentField" placeholder="Full name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </FormField>
                      <FormField v-slot="{ componentField }" :name="`teamMembers.${index}.role`">
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <Input v-bind="componentField" placeholder="e.g., CEO, CTO" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </FormField>
                    </div>
                    <FormField v-slot="{ componentField }" :name="`teamMembers.${index}.bio`">
                      <FormItem>
                        <FormLabel>Bio</FormLabel>
                        <FormControl>
                          <Textarea v-bind="componentField" placeholder="Brief description of experience and expertise" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" :name="`teamMembers.${index}.linkedin`">
                      <FormItem>
                        <FormLabel>LinkedIn Profile (Optional)</FormLabel>
                        <FormControl>
                          <Input v-bind="componentField" placeholder="https://linkedin.com/in/..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </div>
                  <Button type="button" variant="outline" @click="addTeamMember" class="w-full">
                    Add Team Member
                  </Button>
                </CardContent>
              </Card>

              <!-- Pitch Deck Upload -->
              <Card>
                <CardHeader>
                  <CardTitle>Pitch Deck</CardTitle>
                  <CardDescription>Upload your startup's pitch deck (PDF, PPT, or PPTX)</CardDescription>
                </CardHeader>
                <CardContent>
                  <FileUpload
                    accept=".pdf,.ppt,.pptx"
                    :max-size="10"
                    :multiple="false"
                    @upload="handleFileUpload"
                    @remove="handleFileRemove"
                  />
                </CardContent>
              </Card>

              <!-- Business Information -->
              <Card>
                <CardHeader>
                  <CardTitle>Business Information</CardTitle>
                  <CardDescription>Details about your business model and market</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <FormField v-slot="{ componentField }" name="businessModel">
                    <FormItem>
                      <FormLabel>Business Model</FormLabel>
                      <FormControl>
                        <Textarea v-bind="componentField" placeholder="Describe your business model and revenue streams" class="min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField v-slot="{ componentField }" name="targetMarket">
                    <FormItem>
                      <FormLabel>Target Market</FormLabel>
                      <FormControl>
                        <Textarea v-bind="componentField" placeholder="Describe your target market and customer segments" class="min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField v-slot="{ componentField }" name="competitors">
                    <FormItem>
                      <FormLabel>Competitors</FormLabel>
                      <FormControl>
                        <Textarea v-bind="componentField" placeholder="List your main competitors and your competitive advantages" class="min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </CardContent>
              </Card>

              <!-- Traction -->
              <Card>
                <CardHeader>
                  <CardTitle>Traction & Milestones</CardTitle>
                  <CardDescription>Show your startup's progress and achievements</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <FormField v-slot="{ componentField }" name="traction.users">
                      <FormItem>
                        <FormLabel>Active Users/Customers</FormLabel>
                        <FormControl>
                          <Input v-bind="componentField" placeholder="e.g., 10,000+ active users" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="traction.revenue">
                      <FormItem>
                        <FormLabel>Revenue Growth</FormLabel>
                        <FormControl>
                          <Input v-bind="componentField" placeholder="e.g., 200% YoY growth" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="traction.growth">
                      <FormItem>
                        <FormLabel>User Growth</FormLabel>
                        <FormControl>
                          <Input v-bind="componentField" placeholder="e.g., 50% MoM growth" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="traction.partnerships">
                      <FormItem>
                        <FormLabel>Key Partnerships</FormLabel>
                        <FormControl>
                          <Input v-bind="componentField" placeholder="e.g., Strategic partnerships" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </div>
                </CardContent>
              </Card>

              <!-- Timeline & Milestones -->
              <Card>
                <CardHeader>
                  <CardTitle>Timeline & Milestones</CardTitle>
                  <CardDescription>Showcase your past achievements and future plans</CardDescription>
                </CardHeader>
                <CardContent class="space-y-8">
                  <!-- Past Milestones -->
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <h3 class="text-lg font-semibold">Past Achievements</h3>
                      <Button type="button" variant="outline" @click="addPastMilestone">
                        Add Past Milestone
                      </Button>
                    </div>
                    
                    <div v-for="(milestone, index) in form?.values?.timeline?.past || []" :key="index" class="p-4 border rounded-lg space-y-4">
                      <div class="flex justify-between items-center">
                        <h4 class="font-medium">Past Milestone {{ index + 1 }}</h4>
                        <Button variant="ghost" type="button" @click="removePastMilestone(index)" class="text-destructive">
                          Remove
                        </Button>
                      </div>

                      <div class="grid grid-cols-2 gap-4">
                        <FormField v-slot="{ componentField }" :name="`timeline.past.${index}.date`">
                          <FormItem>
                            <FormLabel>Date</FormLabel>
                            <FormControl>
                              <Input v-bind="componentField" type="date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField }" :name="`timeline.past.${index}.type`">
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select v-bind="componentField">
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="achievement">Achievement</SelectItem>
                                <SelectItem value="funding">Funding</SelectItem>
                                <SelectItem value="partnership">Partnership</SelectItem>
                                <SelectItem value="product">Product</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        </FormField>
                      </div>

                      <FormField v-slot="{ componentField }" :name="`timeline.past.${index}.title`">
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input v-bind="componentField" placeholder="e.g., Reached 10,000 users" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </FormField>

                      <FormField v-slot="{ componentField }" :name="`timeline.past.${index}.description`">
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea v-bind="componentField" placeholder="Describe the milestone and its impact" class="min-h-[100px]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </FormField>
                    </div>
                  </div>

                  <!-- Future Milestones -->
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <h3 class="text-lg font-semibold">Future Plans</h3>
                      <Button type="button" variant="outline" @click="addFutureMilestone">
                        Add Future Milestone
                      </Button>
                    </div>
                    
                    <div v-for="(milestone, index) in form?.values?.timeline?.future || []" :key="index" class="p-4 border rounded-lg space-y-4">
                      <div class="flex justify-between items-center">
                        <h4 class="font-medium">Future Milestone {{ index + 1 }}</h4>
                        <Button variant="ghost" type="button" @click="removeFutureMilestone(index)" class="text-destructive">
                          Remove
                        </Button>
                      </div>

                      <div class="grid grid-cols-2 gap-4">
                        <FormField v-slot="{ componentField }" :name="`timeline.future.${index}.date`">
                          <FormItem>
                            <FormLabel>Target Date</FormLabel>
                            <FormControl>
                              <Input v-bind="componentField" type="date" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField }" :name="`timeline.future.${index}.type`">
                          <FormItem>
                            <FormLabel>Type</FormLabel>
                            <Select v-bind="componentField">
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="launch">Product Launch</SelectItem>
                                <SelectItem value="funding">Funding Round</SelectItem>
                                <SelectItem value="partnership">Partnership</SelectItem>
                                <SelectItem value="product">Product Update</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        </FormField>
                      </div>

                      <FormField v-slot="{ componentField }" :name="`timeline.future.${index}.title`">
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input v-bind="componentField" placeholder="e.g., Launch Enterprise Version" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </FormField>

                      <FormField v-slot="{ componentField }" :name="`timeline.future.${index}.description`">
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea v-bind="componentField" placeholder="Describe the planned milestone and expected impact" class="min-h-[100px]" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </FormField>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <!-- Contact Information -->
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>How investors can reach you</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <FormField v-slot="{ componentField }" name="contact.email">
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input v-bind="componentField" type="email" placeholder="contact@startup.com" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="contact.phone">
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input v-bind="componentField" type="tel" placeholder="+1 (555) 000-0000" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </div>

                  <FormField v-slot="{ componentField }" name="contact.address">
                    <FormItem>
                      <FormLabel>Address (Optional)</FormLabel>
                      <FormControl>
                        <Input v-bind="componentField" placeholder="Company address" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </CardContent>
              </Card>

              <!-- Social Media -->
              <Card>
                <CardHeader>
                  <CardTitle>Social Media</CardTitle>
                  <CardDescription>Your startup's social media presence</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="grid grid-cols-2 gap-4">
                    <FormField v-slot="{ componentField }" name="socialMedia.linkedin">
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <Input v-bind="componentField" placeholder="https://linkedin.com/company/..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="socialMedia.twitter">
                      <FormItem>
                        <FormLabel>Twitter</FormLabel>
                        <FormControl>
                          <Input v-bind="componentField" placeholder="https://twitter.com/..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="socialMedia.facebook">
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input v-bind="componentField" placeholder="https://facebook.com/..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="socialMedia.instagram">
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input v-bind="componentField" placeholder="https://instagram.com/..." />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    </FormField>
                  </div>
                </CardContent>
              </Card>

              <!-- Product Media -->
              <Card>
                <CardHeader>
                  <CardTitle>Product Media</CardTitle>
                  <CardDescription>Upload screenshots and demo video of your product</CardDescription>
                </CardHeader>
                <CardContent class="space-y-6">
                  <!-- Screenshots -->
                  <FormField v-slot="{ componentField }" name="screenshots">
                    <FormItem>
                      <FormLabel>Product Screenshots</FormLabel>
                      <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div v-for="(preview, index) in screenshotPreviews" :key="index" class="relative group">
                          <img :src="preview" alt="Product screenshot" class="w-full h-48 object-cover rounded-lg" />
                          <Button
                            variant="destructive"
                            size="icon"
                            class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            @click="handleScreenshotRemove(index)"
                          >
                            <span class="sr-only">Remove screenshot</span>
                            ×
                          </Button>
                        </div>
                      </div>
                      <FormControl>
                        <FileUpload
                          accept="image/*"
                          :max-size="5"
                          :multiple="true"
                          @upload="handleScreenshotUpload"
                        />
                      </FormControl>
                      <p class="text-sm text-muted-foreground">
                        Upload up to 6 screenshots (max 5MB each, recommended size: 1200x800px)
                      </p>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <!-- Demo Video -->
                  <FormField v-slot="{ componentField }" name="demoVideo">
                    <FormItem>
                      <FormLabel>Demo Video</FormLabel>
                      <div v-if="demoVideo" class="flex items-center gap-4">
                        <div class="flex-1">
                          <p class="text-sm">{{ demoVideo.name }}</p>
                        </div>
                        <Button variant="ghost" size="sm" @click="handleDemoVideoRemove">
                          Remove
                        </Button>
                      </div>
                      <FormControl>
                        <FileUpload
                          accept="video/*"
                          :max-size="50"
                          :multiple="false"
                          @upload="handleDemoVideoUpload"
                        />
                      </FormControl>
                      <p class="text-sm text-muted-foreground">
                        Upload a demo video (max 50MB, supported formats: MP4, WebM)
                      </p>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </CardContent>
              </Card>

              <!-- Use of Funds -->
              <Card>
                <CardHeader>
                  <CardTitle>Use of Funds</CardTitle>
                  <CardDescription>Detail how you plan to use the investment</CardDescription>
                </CardHeader>
                <CardContent class="space-y-6">
                  <FormField v-slot="{ componentField }" name="useOfFunds.product">
                    <FormItem>
                      <FormLabel>Product Development</FormLabel>
                      <FormControl>
                        <Textarea
                          v-bind="componentField"
                          placeholder="Describe your product development plans, including features, improvements, and technical infrastructure"
                          class="min-h-[150px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField v-slot="{ componentField }" name="useOfFunds.marketing">
                    <FormItem>
                      <FormLabel>Marketing & Growth</FormLabel>
                      <FormControl>
                        <Textarea
                          v-bind="componentField"
                          placeholder="Detail your marketing strategy, customer acquisition plans, and growth initiatives"
                          class="min-h-[150px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField v-slot="{ componentField }" name="useOfFunds.operations">
                    <FormItem>
                      <FormLabel>Operations & Infrastructure</FormLabel>
                      <FormControl>
                        <Textarea
                          v-bind="componentField"
                          placeholder="Explain your operational plans, including scaling infrastructure, tools, and systems"
                          class="min-h-[150px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField v-slot="{ componentField }" name="useOfFunds.team">
                    <FormItem>
                      <FormLabel>Team Expansion</FormLabel>
                      <FormControl>
                        <Textarea
                          v-bind="componentField"
                          placeholder="Describe your hiring plans, team structure, and organizational growth"
                          class="min-h-[150px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>

                  <FormField v-slot="{ componentField }" name="useOfFunds.other">
                    <FormItem>
                      <FormLabel>Other Uses (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          v-bind="componentField"
                          placeholder="Any other planned uses of funds"
                          class="min-h-[150px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </CardContent>
              </Card>

              <div class="flex justify-end">
                <Button type="submit" :disabled="isLoading">
                  <span v-if="isLoading" class="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  {{ isLoading ? "Creating Startup..." : "Create Startup" }}
                </Button>
              </div>
            </form>
          </div>

          <!-- Preview Section -->
          <div v-if="showPreview" class="space-y-8">
            <Card>
              <CardHeader>
                <div class="flex items-center gap-4">
                  <div v-if="logoPreview" class="w-16 h-16 rounded-lg overflow-hidden">
                    <img :src="logoPreview" alt="Startup logo" class="w-full h-full object-cover" />
                  </div>
                  <div v-else class="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                    <span class="text-2xl">🚀</span>
                  </div>
                  <div>
                    <CardTitle>{{ form?.values?.name || 'Your Startup Name' }}</CardTitle>
                    <CardDescription>{{ form?.values?.industry || 'Industry' }}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent class="space-y-6">
                <div>
                  <h3 class="text-lg font-semibold mb-2">About</h3>
                  <p class="text-muted-foreground">{{ form?.values?.description || 'Startup description will appear here' }}</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <h3 class="text-lg font-semibold">Key Metrics</h3>
                    <div class="space-y-2">
                      <div class="flex items-center gap-2">
                        <span class="text-muted-foreground">Revenue:</span>
                        <span>{{ form?.values?.metrics?.revenue || 'Not specified' }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-muted-foreground">Growth:</span>
                        <span>{{ form?.values?.metrics?.growth || 'Not specified' }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-muted-foreground">Customers:</span>
                        <span>{{ form?.values?.metrics?.customers || 'Not specified' }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-2">
                    <h3 class="text-lg font-semibold">Funding</h3>
                    <div class="space-y-2">
                      <div class="flex items-center gap-2">
                        <span class="text-muted-foreground">Total:</span>
                        <span>{{ form?.values?.funding?.total || 'Not specified' }}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <span class="text-muted-foreground">Last Round:</span>
                        <span>{{ form?.values?.funding?.lastRound || 'Not specified' }}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="form?.values?.businessModel || form?.values?.targetMarket || form?.values?.competitors">
                  <h3 class="text-lg font-semibold mb-4">Business Information</h3>
                  <div class="space-y-4">
                    <div v-if="form?.values?.businessModel">
                      <h4 class="font-medium">Business Model</h4>
                      <p class="text-sm text-muted-foreground">{{ form.values.businessModel }}</p>
                    </div>
                    <div v-if="form?.values?.targetMarket">
                      <h4 class="font-medium">Target Market</h4>
                      <p class="text-sm text-muted-foreground">{{ form.values.targetMarket }}</p>
                    </div>
                    <div v-if="form?.values?.competitors">
                      <h4 class="font-medium">Competitors</h4>
                      <p class="text-sm text-muted-foreground">{{ form.values.competitors }}</p>
                    </div>
                  </div>
                </div>

                <div v-if="form?.values?.traction?.users || form?.values?.traction?.revenue || form?.values?.traction?.growth || form?.values?.traction?.partnerships">
                  <h3 class="text-lg font-semibold mb-4">Traction</h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div v-if="form?.values?.traction?.users">
                      <h4 class="font-medium">Active Users</h4>
                      <p class="text-sm text-muted-foreground">{{ form.values.traction.users }}</p>
                    </div>
                    <div v-if="form?.values?.traction?.revenue">
                      <h4 class="font-medium">Revenue Growth</h4>
                      <p class="text-sm text-muted-foreground">{{ form.values.traction.revenue }}</p>
                    </div>
                    <div v-if="form?.values?.traction?.growth">
                      <h4 class="font-medium">User Growth</h4>
                      <p class="text-sm text-muted-foreground">{{ form.values.traction.growth }}</p>
                    </div>
                    <div v-if="form?.values?.traction?.partnerships">
                      <h4 class="font-medium">Partnerships</h4>
                      <p class="text-sm text-muted-foreground">{{ form.values.traction.partnerships }}</p>
                    </div>
                  </div>
                </div>

                <div v-if="form?.values?.teamMembers?.length > 0">
                  <h3 class="text-lg font-semibold mb-4">Team</h3>
                  <div class="grid grid-cols-1 gap-4">
                    <div v-for="(member, index) in form.values.teamMembers" :key="index" class="p-4 border rounded-lg">
                      <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                          <span class="text-lg">👤</span>
                        </div>
                        <div>
                          <h4 class="font-medium">{{ member.name || 'Team Member Name' }}</h4>
                          <p class="text-sm text-muted-foreground">{{ member.role || 'Role' }}</p>
                        </div>
                      </div>
                      <p class="mt-2 text-sm">{{ member.bio || 'Team member bio will appear here' }}</p>
                      <a v-if="member.linkedin" :href="member.linkedin" target="_blank" class="text-sm text-primary hover:underline mt-2 inline-block">
                        LinkedIn Profile
                      </a>
                    </div>
                  </div>
                </div>

                <div v-if="form?.values?.contact?.email || form?.values?.contact?.phone || form?.values?.contact?.address">
                  <h3 class="text-lg font-semibold mb-4">Contact Information</h3>
                  <div class="space-y-2">
                    <div v-if="form?.values?.contact?.email" class="flex items-center gap-2">
                      <span class="text-muted-foreground">Email:</span>
                      <a :href="`mailto:${form.values.contact.email}`" class="text-primary hover:underline">
                        {{ form.values.contact.email }}
                      </a>
                    </div>
                    <div v-if="form?.values?.contact?.phone" class="flex items-center gap-2">
                      <span class="text-muted-foreground">Phone:</span>
                      <a :href="`tel:${form.values.contact.phone}`" class="text-primary hover:underline">
                        {{ form.values.contact.phone }}
                      </a>
                    </div>
                    <div v-if="form?.values?.contact?.address" class="flex items-center gap-2">
                      <span class="text-muted-foreground">Address:</span>
                      <span>{{ form.values.contact.address }}</span>
                    </div>
                  </div>
                </div>

                <div v-if="form?.values?.socialMedia?.linkedin || form?.values?.socialMedia?.twitter || form?.values?.socialMedia?.facebook || form?.values?.socialMedia?.instagram">
                  <h3 class="text-lg font-semibold mb-4">Social Media</h3>
                  <div class="flex flex-wrap gap-4">
                    <a v-if="form?.values?.socialMedia?.linkedin" :href="form.values.socialMedia.linkedin" target="_blank" class="text-primary hover:underline">
                      LinkedIn
                    </a>
                    <a v-if="form?.values?.socialMedia?.twitter" :href="form.values.socialMedia.twitter" target="_blank" class="text-primary hover:underline">
                      Twitter
                    </a>
                    <a v-if="form?.values?.socialMedia?.facebook" :href="form.values.socialMedia.facebook" target="_blank" class="text-primary hover:underline">
                      Facebook
                    </a>
                    <a v-if="form?.values?.socialMedia?.instagram" :href="form.values.socialMedia.instagram" target="_blank" class="text-primary hover:underline">
                      Instagram
                    </a>
                  </div>
                </div>

                <div v-if="pitchDeckFile">
                  <h3 class="text-lg font-semibold mb-2">Pitch Deck</h3>
                  <div class="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>📄</span>
                    <span>{{ pitchDeckFile.name }}</span>
                  </div>
                </div>

                <!-- Product Media Preview -->
                <div v-if="screenshotPreviews.length > 0 || demoVideo" class="space-y-4">
                  <h3 class="text-lg font-semibold">Product Media</h3>
                  <div v-if="screenshotPreviews.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div v-for="(preview, index) in screenshotPreviews" :key="index">
                      <img :src="preview" alt="Product screenshot" class="w-full h-48 object-cover rounded-lg" />
                    </div>
                  </div>
                  <div v-if="demoVideo" class="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>🎥</span>
                    <span>{{ demoVideo.name }}</span>
                  </div>
                </div>

                <!-- Timeline Preview -->
                <div v-if="form?.values?.timeline?.past?.length > 0 || form?.values?.timeline?.future?.length > 0" class="space-y-6">
                  <h3 class="text-lg font-semibold">Timeline & Milestones</h3>
                  
                  <!-- Past Milestones -->
                  <div v-if="form?.values?.timeline?.past?.length > 0" class="space-y-4">
                    <h4 class="font-medium">Past Achievements</h4>
                    <div class="space-y-4">
                      <div v-for="(milestone, index) in form.values.timeline.past" :key="index" class="p-4 border rounded-lg">
                        <div class="flex items-center gap-2 mb-2">
                          <span class="text-sm text-muted-foreground">{{ milestone.date }}</span>
                          <span class="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                            {{ milestone.type }}
                          </span>
                        </div>
                        <h5 class="font-medium">{{ milestone.title }}</h5>
                        <p class="text-sm text-muted-foreground mt-1">{{ milestone.description }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Future Milestones -->
                  <div v-if="form?.values?.timeline?.future?.length > 0" class="space-y-4">
                    <h4 class="font-medium">Future Plans</h4>
                    <div class="space-y-4">
                      <div v-for="(milestone, index) in form.values.timeline.future" :key="index" class="p-4 border rounded-lg">
                        <div class="flex items-center gap-2 mb-2">
                          <span class="text-sm text-muted-foreground">Target: {{ milestone.date }}</span>
                          <span class="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary">
                            {{ milestone.type }}
                          </span>
                        </div>
                        <h5 class="font-medium">{{ milestone.title }}</h5>
                        <p class="text-sm text-muted-foreground mt-1">{{ milestone.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Use of Funds Preview -->
                <div v-if="form?.values?.useOfFunds" class="space-y-4">
                  <h3 class="text-lg font-semibold">Use of Funds</h3>
                  <div class="space-y-4">
                    <div v-if="form.values.useOfFunds.product">
                      <h4 class="font-medium">Product Development</h4>
                      <p class="text-sm text-muted-foreground whitespace-pre-line">{{ form.values.useOfFunds.product }}</p>
                    </div>
                    <div v-if="form.values.useOfFunds.marketing">
                      <h4 class="font-medium">Marketing & Growth</h4>
                      <p class="text-sm text-muted-foreground whitespace-pre-line">{{ form.values.useOfFunds.marketing }}</p>
                    </div>
                    <div v-if="form.values.useOfFunds.operations">
                      <h4 class="font-medium">Operations & Infrastructure</h4>
                      <p class="text-sm text-muted-foreground whitespace-pre-line">{{ form.values.useOfFunds.operations }}</p>
                    </div>
                    <div v-if="form.values.useOfFunds.team">
                      <h4 class="font-medium">Team Expansion</h4>
                      <p class="text-sm text-muted-foreground whitespace-pre-line">{{ form.values.useOfFunds.team }}</p>
                    </div>
                    <div v-if="form.values.useOfFunds.other">
                      <h4 class="font-medium">Other Uses</h4>
                      <p class="text-sm text-muted-foreground whitespace-pre-line">{{ form.values.useOfFunds.other }}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
