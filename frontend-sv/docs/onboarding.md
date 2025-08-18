## **Detailed Onboarding Plan**

Given the schema is large and multi-step, I’d recommend progressive saving for these reasons:

- Prevents frustration if a user drops halfway.
- Makes onboarding resumable across devices.
- Lets you start tailoring recommendations as soon as they complete a step

let setup  an onboarding-state in the hooks folder

### **Step 0 — Welcome & Progress Tracking**

- **Purpose:** Let users know what onboarding will cover, how long it will take (e.g., "5–7 minutes"), and show a progress bar or step indicator.
- **Data Collected:** None (just UX preparation)
- **Notes:**

  - This primes the user for completion.
  - Show the benefits of completing onboarding ("You'll get better matches, recommendations, and visibility.").

---

### **Step 1 — Role Selection**

- **Schema:** `roleSelectionSchema`
- **UI Elements:**

  - 3 cards or buttons: **Founder**, **Investor**, **Supporter**.
  - Each with a short description of what they can do on the platform.
- **Validation:**

  - Required — "Please select a role".
- **UX Tip:**

  - Choosing a role will determine which role-specific questions show up later.
  - If the user changes their role mid-onboarding, reset role-specific fields.

---

### **Step 2 — Basic Information**

- **Schema:** `basicInfoSchema`
- **Sections:**

  1. **Name & Email** (required)
  2. **Profile Picture Upload** (optional but recommended)
  3. **Location, City, Timezone** (optional)
  4. **Bio** (short personal summary)
  5. **Job Title, Industry, Education** (optional)
  6. **Contact Info** (phone, Twitter, LinkedIn, GitHub, Portfolio Website)
  7. **Languages Spoken**
  8. **Employment Status**
- **Validation:**

  - Name: min 2 chars
  - Email: must be valid format
  - URLs: must be valid if provided
- **UX Tip:**

  - Split into **2–3 smaller sub-steps** so it’s not one huge form.
  - Use placeholders like “Jane Doe” or “[https://linkedin.com/in/janedoe”](https://linkedin.com/in/janedoe”).

---

### **Step 3 — Role-Specific Details**

#### **If Investor** → `investorSchema`

- **Fields:**

  - Investment size (select one)
  - Preferred stages (multi-select)
  - Investment history (short text)
  - Risk appetite (radio buttons)
  - Portfolio companies (number input)

#### **If Supporter** → `supporterSchema`

- **Fields:**

  - Support type (multi-select)
  - Availability (radio)
  - Hourly rate (optional number)
  - Expertise (optional text)

#### **If Founder**

- Your current schema doesn’t have a founder-specific section, but you could add:

  - Stage of startup
  - Number of team members
  - Funding status
  - Areas of support needed

---

### **Step 4 — Goals**

- **Schema:** `goalsSchema`
- **Fields:**

  - Personal goals (multi-input tags)
  - Platform goals (multi-input tags)
  - Primary goal (single choice)
  - Specific needs (multi-select)
  - Time commitment (select)
  - Additional goals (optional textarea)
- **Validation:**

  - Primary goal: required
  - Specific needs: at least one
- **UX Tip:**

  - Use “chip” style inputs for goals.
  - Examples for needs: "Find co-founders", "Raise funding", "Get mentorship".

---

### **Step 5 — Skills**

- **Schema:** `skillsSchema`
- **Fields:**

  - Skills (tag-style input)
  - Experience level (required)
  - Industries (tag input)
  - Achievements, Expertise Areas, Certifications (optional textareas)
- **UX Tip:**

  - Pre-fill some skill suggestions based on role.

---

### **Step 6 — Preferences**

- **Schema:** `preferencesSchema`
- **Fields:**

  - Communication methods (multi-select)
  - Communication frequency (select)
  - Notification types (multi-select)
  - Theme preference (light/dark/system)
- **Validation:**

  - At least one communication method is required.

---

### **Step 7 — Review & Confirm**

- **Purpose:** Let the user review all details before submission.
- **UI:**

  - Collapsible sections for each onboarding category.
  - "Edit" buttons to jump back to steps.
- **Actions:**

  - Submit → API call with `onboardingSchema` validated data.

---

### **Step 8 — Success Screen**

- **Message:** "Your profile is ready! Let’s get started."
- **Next Action:** Redirect to dashboard, recommendations, or matches.

---

## **Extra Implementation Notes**

- **Conditional Validation:**
  Use `.refine()` or `.superRefine()` to validate role-specific fields only if that role is selected.
- **Partial Saves:**
  Consider saving after each step so users don’t lose progress if they leave.
- **Mobile-first design:**
  Forms should be scroll-friendly and have big touch targets.
 **Progress Tracking:**
  Show step count ("Step 3 of 7") and a visual progress bar.
