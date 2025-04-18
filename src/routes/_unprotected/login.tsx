import { LoginForm } from "@/components/LoginForm";
import Logger from "@/logger";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

// Import the logger instance
const log = Logger.getInstance();

const redirectSearchSchema = z.object({
  // Catch will avoid the thrown by `.default` and update the redirect search param
  // to`/login?redirect=%2F`, i.e. `/`
  redirect: z.enum(["/", "/account"]).catch("/"),
});

// TODO: not sure why the Tanstack router has this in its example
// type RedirectSearch = z.infer<typeof redirectSearchSchema>;

export const Route = createFileRoute("/_unprotected/login")({
  // Validate redirect search by parsing the search params
  // This can also be done with Typescript type parsing, refer Tanstack example
  // https://tanstack.com/router/v1/docs/framework/react/guide/search-params#enter-validation--typescript
  validateSearch: (search) => redirectSearchSchema.parse(search),
  beforeLoad: async ({ search }) => {
    log.silly("Before login route load...");

    log.silly("The search is: {}", search);
  },
  component: LoginComponent,
});

function LoginComponent() {

  return (
    <div className="w-full max-w-sm md:max-w-3xl">
      <LoginForm />
    </div>
  );
}
