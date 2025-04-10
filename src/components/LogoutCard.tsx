import { Button } from "./shadcn_ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./shadcn_ui/card";

export function LogOutCard() {

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
          <Button variant="secondary" className="w-full">
            Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
