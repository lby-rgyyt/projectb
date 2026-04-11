import { Link } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const NotFoundPage = () => {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>404</CardTitle>
          <CardDescription>Oops, something went wrong!</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
};

export default NotFoundPage;
