import Logger from "@/logger";
import { Button } from "./shadcn_ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./shadcn_ui/card";
import { useRouter } from "@tanstack/react-router";

// Import the logger instance
const log = Logger.getInstance();

export function LogOutCard() {

  const router = useRouter();

  const onLoginButtonClick = () => {
    log.debug("Login button click");
    router.navigate({
      to: "/login",
      search: undefined!
    });

  };

  return (
    <div className={"flex flex-col gap-6"}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Logged Out</CardTitle>
          <CardDescription>
            You have been logged. You can close this window or log back in.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={onLoginButtonClick} className="w-full">
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
