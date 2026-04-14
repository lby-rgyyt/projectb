import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../store";
import { setCredentials } from "../store/slices/authSlice";
import api from "../utils/api";
import { handleError } from "../utils/error";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";
import FormInput from "@/components/form/FormInput";

const signInSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { username: "", password: "" },
  });

  const handleSubmit = async (data: SignInFormData) => {
    try {
      const response = await api.post("/api/auth/login", data);
      await dispatch(
        setCredentials({
          // token: response.data.token,
          employee: response.data.employee,
        }),
      );
      const employee = response.data.employee;
      if (employee.role === "employee") {
        if (
          employee.onboardingApplication &&
          employee.onboardingApplication.status === "approved"
        ) {
          navigate("/personal-info");
        } else {
          console.log("onboardingApplication:", employee.onboardingApplication);
          console.log("status:", employee.onboardingApplication?.status);
          navigate("/onboarding-application");
          // setTimeout(() => navigate("/onboarding-application"));
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const data = error.response.data;
        const msg = data.error || data.errors;

        if (typeof msg === "string") {
          if (msg.toLowerCase().includes("username")) {
            form.setError("username", { message: "Username does not exist" });
          } else if (msg.toLowerCase().includes("password")) {
            form.setError("password", { message: "Incorrect password" });
          } else {
            form.setError("username", { message: msg });
          }
        } else {
          form.setError("username", {
            message: "Login failed. Please try again.",
          });
        }
      } else {
        handleError(error);
      }
    }
  };
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>
            Sign in to your Employee Portal account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              noValidate
              className="flex flex-col gap-4"
            >
              <FormInput
                form={form}
                name="username"
                label="Username"
                placeholder="Enter your username"
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <fieldset className="flex gap-2">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff /> : <Eye />}
                        </Button>
                      </fieldset>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
};

export default SignInPage;
