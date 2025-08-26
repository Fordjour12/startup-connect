import { fail, superValidate } from "sveltekit-superforms";
import type { PageServerLoad, Actions } from "./$types";
import { redirect } from "@sveltejs/kit";
import { zod } from "sveltekit-superforms/adapters";
import { loginSchema } from "@/z-schema/login-schema";
import { auth } from "@/auth";
import { USER_ROLES } from "@/db/schema/auth-schema";

export const load: PageServerLoad = async ({ request }) => {
  const session = await auth.api.getSession({
    headers: request.headers,
  })

  if (session?.user.role === USER_ROLES.ADMIN) {
    redirect(302, "/dashboard/admin");
  }

  const form = await superValidate(zod(loginSchema));
  return { form };
};

export const actions = {
  default: async ({ request }) => {
    const form = await superValidate(request, zod(loginSchema));

    if (!form.valid) {
      return fail(400, { form });
    }

    const { email, password } = form.data;

    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    console.log("User logged in successfully", result.user);

  },
} satisfies Actions;
