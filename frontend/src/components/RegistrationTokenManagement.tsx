import { useState, useEffect } from "react";
import type { RegistrationToken } from "../types";
import { useForm } from "react-hook-form";
import api from "../utils/api";
import { handleError } from "../utils/error";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FormInput from "@/components/form/FormInput";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { toast } from "sonner";
import axios from "axios";

const tokenSchema = z.object({
  name: z.string().min(1, "Employee name is required"),
  email: z.email("Invalid email format").min(1, "Employee email is required"),
});

type TokenFormData = z.infer<typeof tokenSchema>;

const RegistrationTokenManagement = () => {
  const [tokens, setTokens] = useState<RegistrationToken[]>([]);

  const form = useForm<TokenFormData>({
    resolver: zodResolver(tokenSchema),
    defaultValues: { name: "", email: "" },
  });

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const res = await api.get("/api/registration-tokens/all");
        setTokens(res.data.tokens);
      } catch (err) {
        handleError(err);
      }
    };
    fetchTokens();
  }, []);

  const onSend = async (data: TokenFormData) => {
    try {
      await api.post("/api/registration-tokens/invite", data);
      const res = await api.get("/api/registration-tokens/all");
      setTokens(res.data.tokens);
      // clear form
      form.reset();
      toast.success("Registration email sent successfully!");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const msg = err.response.data.error;
        if (typeof msg === "string") {
          form.setError("email", { message: msg });
        }
      } else {
        handleError(err);
      }
    }
  };

  return (
    <section className="flex flex-col gap-6">
      {/* Send Invitation */}
      <Card>
        <CardHeader>
          <CardTitle>Send Registration Invitation</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSend)}
              noValidate
              className="flex flex-col gap-4"
            >
              <FormInput
                form={form}
                name="name"
                label="Employee Name *"
                placeholder="Full name"
              />
              <FormInput
                form={form}
                name="email"
                label="Employee Email *"
                placeholder="email@example.com"
              />
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting
                  ? "Sending..."
                  : "Generate Token & Send Email"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Token History */}
      <Card>
        <CardHeader>
          <CardTitle>Token History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Registration Link</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens.map((t) => (
                <TableRow key={t.id}>
                  <TableCell>{t.email}</TableCell>
                  <TableCell>{t.name}</TableCell>
                  <TableCell className="max-w-32 truncate">
                    <a href={t.link}>{t.link}</a>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        t.status === "registered"
                          ? "default"
                          : t.status === "expired"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {t.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
};

export default RegistrationTokenManagement;
