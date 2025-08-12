# Sign Up and OnBoarding

**Goal:**
Build a responsive, modern, and visually appealing sign-up and onboarding flow.

**Requirements:**

1. **Sign-Up**

   * Implement an account registration form with fields: `name`, `email`, `password`, and any other required basics.
   * On successful sign-up, store the user with a **default role** of `"user"`.
   * Auth library **Better-Auth** and have enabled "organization and admin" (use context 7 for **Better-Auth**)

2. **Onboarding Flow**

   * Step 1: **Welcome Screen** – greet the user and briefly explain the onboarding process.
   * Step 2: **Role Selection** – user chooses **one** role: `"founder"`, `"investor"`, or `"support"`.
   * Step 3: **Basic Information** – capture personal details (profile image, location, short bio, etc.).
   * Step 4: **Goals** – allow the user to set personal or platform-related goals.
   * Step 5: **Skills** – allow selection of relevant skills from a predefined list or custom input.
   * Step 6: **Preferences** – gather user preferences related to their chosen role.
   * Step 7: **Review** – show all collected information for confirmation.
   * Step 8: **Complete** – finalize onboarding, save all data to the database, and update the user role based on their selection in Step 2.

3. **Post-Onboarding**

   * Redirect the user to their respective dashboard based on their final role:

     * `"founder"` → Founder Dashboard
     * `"investor"` → Investor Dashboard
     * `"support"` → Support Dashboard

4. **UI/UX Requirements**

   * Fully **responsive** (mobile-first design with breakpoints for tablet and desktop).
   * **Modern design style**: clean typography, smooth animations, clear visual hierarchy.
   * Use a **stepper** or **progress indicator** for onboarding steps.
   * Include **form validation** and **inline error messages** for all inputs can use zod or a better approach.
   * Use a **modal or slide-over** for role selection if space is limited on mobile.

5. **Technical Notes**

   * Store temporary onboarding progress in state in **hooks/onboarding-state.ts** so the user can continue if they refresh.
   * Use an **API endpoint** to persist each step or save all steps at the end.
   * Ensure accessibility (keyboard navigation, ARIA labels).
   * Protect onboarding routes so only authenticated users can access them.
