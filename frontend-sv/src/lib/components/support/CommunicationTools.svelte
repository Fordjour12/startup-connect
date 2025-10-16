<script lang="ts">
  import { onMount } from "svelte";
  import { Card, CardContent, CardHeader, CardTitle } from "$lib/components/ui/card";
  import { Button } from "$lib/components/ui/button";
  import { Badge } from "$lib/components/ui/badge";
  import { Input } from "$lib/components/ui/input";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Avatar, AvatarFallback } from "$lib/components/ui/avatar";
  import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
  import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "$lib/components/ui/select";
  import { TICKET_STATUS, TICKET_PRIORITY } from "$lib/db/schema";

  interface Message {
    id: string;
    senderId: string;
    senderName: string;
    senderType: 'customer' | 'agent' | 'system';
    message: string;
    timestamp: Date;
    attachments?: Array<{
      name: string;
      url: string;
      size: number;
    }>;
    isInternal?: boolean;
  }

  interface ResponseTemplate {
    id: string;
    name: string;
    category: string;
    content: string;
    variables: string[];
  }

  interface Props {
    ticketId: string;
    customerId: string;
    customerName: string;
    currentStatus: string;
    currentPriority: string;
    messages: Message[];
    onSendMessage?: (message: string, isInternal?: boolean) => void;
    onUpdateStatus?: (status: string) => void;
    onUpdatePriority?: (priority: string) => void;
    onEscalate?: (reason: string, urgency: string) => void;
  }

  let {
    ticketId,
    customerId,
    customerName,
    currentStatus,
    currentPriority,
    messages,
    onSendMessage,
    onUpdateStatus,
    onUpdatePriority,
    onEscalate
  }: Props = $props();

  let newMessage = $state("");
  let newInternalNote = $state("");
  let selectedTemplate = $state("");
  let showTemplates = $state(false);
  let showEscalateDialog = $state(false);
  let escalationReason = $state("");
  let escalationUrgency = $state("medium");
  let isSending = $state(false);

  // Mock response templates
  let responseTemplates = $state<ResponseTemplate[]>([
    {
      id: "welcome",
      name: "Welcome Message",
      category: "General",
      content: "Hello! Thank you for reaching out. I'm here to help you with your question about [TOPIC]. How can I assist you today?",
      variables: ["TOPIC"]
    },
    {
      id: "investor-matching-help",
      name: "Investor Matching Help",
      category: "For Founders",
      content: "I'd be happy to help you with investor matching! To get the best results, please ensure your startup profile is complete with:\n\n• Company description\n• Funding needs\n• Industry category\n• Team information\n\nWould you like me to review your profile and suggest improvements?",
      variables: []
    },
    {
      id: "due-diligence-guide",
      name: "Due Diligence Guide",
      category: "For Investors",
      content: "Here's how to conduct due diligence on our platform:\n\n1. Review the startup's profile and pitch deck\n2. Check their financial documents\n3. Schedule a call using our platform\n4. Use our collaboration tools to track your process\n\nWould you like me to walk you through any of these steps?",
      variables: []
    },
    {
      id: "technical-issue",
      name: "Technical Issue Response",
      category: "Technical Support",
      content: "I'm sorry you're experiencing this technical issue. Let me help you troubleshoot:\n\n1. Please try clearing your browser cache and cookies\n2. Ensure you're using a supported browser (Chrome, Firefox, Safari)\n3. Try accessing the platform from an incognito/private window\n\nIf the issue persists, please provide more details about what you're seeing.",
      variables: []
    }
  ]);

  function sendMessage(isInternal = false) {
    if (!newMessage.trim() || isSending) return;

    const message = newMessage.trim();
    isSending = true;

    try {
      onSendMessage?.(message, isInternal);
      newMessage = "";
    } finally {
      isSending = false;
    }
  }

  function sendInternalNote() {
    if (!newInternalNote.trim() || isSending) return;

    const note = newInternalNote.trim();
    isSending = true;

    try {
      onSendMessage?.(note, true);
      newInternalNote = "";
    } finally {
      isSending = false;
    }
  }

  function applyTemplate(templateId: string) {
    const template = responseTemplates.find(t => t.id === templateId);
    if (template) {
      newMessage = template.content;
      showTemplates = false;
    }
  }

  function escalateTicket() {
    if (!escalationReason.trim()) return;

    onEscalate?.(escalationReason.trim(), escalationUrgency);
    showEscalateDialog = false;
    escalationReason = "";
    escalationUrgency = "medium";
  }

  function formatTime(date: Date): string {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      [TICKET_STATUS.OPEN]: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      [TICKET_STATUS.IN_PROGRESS]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      [TICKET_STATUS.PENDING]: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      [TICKET_STATUS.RESOLVED]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      [TICKET_STATUS.CLOSED]: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  }

  function getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      [TICKET_PRIORITY.CRITICAL]: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
      [TICKET_PRIORITY.HIGH]: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      [TICKET_PRIORITY.MEDIUM]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      [TICKET_PRIORITY.LOW]: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    };
    return colors[priority] || "bg-gray-100 text-gray-800";
  }
</script>

<div class="space-y-4">
  <!-- Ticket Controls -->
  <Card>
    <CardHeader>
      <CardTitle class="text-lg">Ticket Controls</CardTitle>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="text-sm font-medium mb-2 block">Status</label>
          <Select value={currentStatus} onValueChange={(value) => onUpdateStatus?.(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TICKET_STATUS.OPEN}>Open</SelectItem>
              <SelectItem value={TICKET_STATUS.IN_PROGRESS}>In Progress</SelectItem>
              <SelectItem value={TICKET_STATUS.PENDING}>Pending</SelectItem>
              <SelectItem value={TICKET_STATUS.RESOLVED}>Resolved</SelectItem>
              <SelectItem value={TICKET_STATUS.CLOSED}>Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label class="text-sm font-medium mb-2 block">Priority</label>
          <Select value={currentPriority} onValueChange={(value) => onUpdatePriority?.(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TICKET_PRIORITY.LOW}>Low</SelectItem>
              <SelectItem value={TICKET_PRIORITY.MEDIUM}>Medium</SelectItem>
              <SelectItem value={TICKET_PRIORITY.HIGH}>High</SelectItem>
              <SelectItem value={TICKET_PRIORITY.CRITICAL}>Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div class="flex items-end">
          <Button
            variant="destructive"
            class="w-full"
            onclick={() => showEscalateDialog = true}
          >
            Escalate
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>

  <!-- Communication Tabs -->
  <Tabs value="customer" class="w-full">
    <TabsList class="grid w-full grid-cols-2">
      <TabsTrigger value="customer">Customer Communication</TabsTrigger>
      <TabsTrigger value="internal">Internal Notes</TabsTrigger>
    </TabsList>

    <!-- Customer Communication Tab -->
    <TabsContent value="customer" class="space-y-4">
      <!-- Message History -->
      <Card>
        <CardHeader>
          <CardTitle class="text-lg">Conversation with {customerName}</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4 max-h-96 overflow-y-auto">
            {#each messages.filter(m => !m.isInternal) as message}
              <div class="flex {message.senderType === 'agent' ? 'justify-end' : 'justify-start'}">
                <div class="flex items-start space-x-3 max-w-xs lg:max-w-md">
                  {#if message.senderType !== 'agent'}
                    <Avatar class="w-8 h-8 flex-shrink-0">
                      <AvatarFallback class="text-xs">
                        {message.senderName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  {/if}

                  <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-1">
                      <span class="text-xs font-medium text-muted-foreground">
                        {message.senderName}
                      </span>
                      <span class="text-xs text-muted-foreground">
                        {formatTime(message.timestamp)}
                      </span>
                      {#if message.senderType === 'system'}
                        <Badge variant="outline" class="text-xs">System</Badge>
                      {/if}
                    </div>

                    <div class="p-3 rounded-lg {
                      message.senderType === 'agent'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }">
                      <p class="text-sm whitespace-pre-wrap">{message.message}</p>

                      {#if message.attachments && message.attachments.length > 0}
                        <div class="mt-2 space-y-1">
                          {#each message.attachments as attachment}
                            <div class="flex items-center space-x-2 text-xs">
                              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                              <a href={attachment.url} target="_blank" rel="noopener noreferrer" class="hover:underline">
                                {attachment.name}
                              </a>
                              <span class="text-muted-foreground">
                                ({(attachment.size / 1024).toFixed(1)} KB)
                              </span>
                            </div>
                          {/each}
                        </div>
                      {/if}
                    </div>
                  </div>

                  {#if message.senderType === 'agent'}
                    <Avatar class="w-8 h-8 flex-shrink-0">
                      <AvatarFallback class="text-xs">
                        {message.senderName.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </CardContent>
      </Card>

      <!-- Response Composer -->
      <Card>
        <CardHeader>
          <div class="flex items-center justify-between">
            <CardTitle class="text-lg">Send Response</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onclick={() => showTemplates = !showTemplates}
            >
              Templates
            </Button>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <!-- Response Templates -->
          {#if showTemplates}
            <div class="border rounded-lg p-4 space-y-3">
              <h4 class="font-medium">Response Templates</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                {#each responseTemplates as template}
                  <Button
                    variant="outline"
                    size="sm"
                    class="justify-start text-left h-auto p-3"
                    onclick={() => applyTemplate(template.id)}
                  >
                    <div>
                      <div class="font-medium text-sm">{template.name}</div>
                      <div class="text-xs text-muted-foreground">{template.category}</div>
                    </div>
                  </Button>
                {/each}
              </div>
            </div>
          {/if}

          <!-- Message Input -->
          <div class="space-y-3">
            <Textarea
              bind:value={newMessage}
              placeholder="Type your response to the customer..."
              rows="4"
            />

            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  Attach File
                </Button>
              </div>

              <Button
                onclick={() => sendMessage(false)}
                disabled={!newMessage.trim() || isSending}
              >
                {isSending ? "Sending..." : "Send Response"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>

    <!-- Internal Notes Tab -->
    <TabsContent value="internal" class="space-y-4">
      <!-- Internal Notes History -->
      <Card>
        <CardHeader>
          <CardTitle class="text-lg">Internal Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="space-y-4 max-h-96 overflow-y-auto">
            {#each messages.filter(m => m.isInternal) as note}
              <div class="border-l-4 border-blue-500 pl-4">
                <div class="flex items-center space-x-2 mb-2">
                  <Avatar class="w-6 h-6">
                    <AvatarFallback class="text-xs">
                      {note.senderName.split(' ').map(n => n[0]).join('').toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span class="text-sm font-medium">{note.senderName}</span>
                  <span class="text-xs text-muted-foreground">
                    {formatDate(note.timestamp)} at {formatTime(note.timestamp)}
                  </span>
                  <Badge variant="outline" class="text-xs">Internal</Badge>
                </div>
                <p class="text-sm whitespace-pre-wrap">{note.message}</p>
              </div>
            {/each}

            {#if messages.filter(m => m.isInternal).length === 0}
              <div class="text-center py-8 text-muted-foreground">
                <p>No internal notes yet</p>
              </div>
            {/if}
          </div>
        </CardContent>
      </Card>

      <!-- Add Internal Note -->
      <Card>
        <CardHeader>
          <CardTitle class="text-lg">Add Internal Note</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <Textarea
            bind:value={newInternalNote}
            placeholder="Add a private note for the support team..."
            rows="3"
          />

          <div class="flex justify-end">
            <Button
              onclick={sendInternalNote}
              disabled={!newInternalNote.trim() || isSending}
            >
              {isSending ? "Adding..." : "Add Note"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  </Tabs>

  <!-- Escalation Dialog -->
  {#if showEscalateDialog}
    <Card class="border-red-200 bg-red-50/50 dark:bg-red-950/50">
      <CardHeader>
        <CardTitle class="text-lg text-red-800 dark:text-red-300">Escalate Ticket</CardTitle>
      </CardHeader>
      <CardContent class="space-y-4">
        <div>
          <label class="text-sm font-medium mb-2 block">Urgency Level</label>
          <Select bind:value={escalationUrgency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low - Can wait for next business day</SelectItem>
              <SelectItem value="medium">Medium - Should be addressed today</SelectItem>
              <SelectItem value="high">High - Needs immediate attention</SelectItem>
              <SelectItem value="critical">Critical - Emergency situation</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label class="text-sm font-medium mb-2 block">Reason for Escalation</label>
          <Textarea
            bind:value={escalationReason}
            placeholder="Please explain why this ticket needs escalation..."
            rows="3"
          />
        </div>

        <div class="flex justify-end space-x-2">
          <Button
            variant="outline"
            onclick={() => showEscalateDialog = false}
          >
            Cancel
          </Button>
          <Button
            onclick={escalateTicket}
            disabled={!escalationReason.trim()}
          >
            Escalate Ticket
          </Button>
        </div>
      </CardContent>
    </Card>
  {/if}
</div>
