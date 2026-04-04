import { useState, useEffect } from "react";
import type { RegistrationToken } from "../types";
import { useForm } from "react-hook-form";
import api from "../utils/api";
import axios from "axios";

interface TokenItemProps {
  email: string;
  name: string;
  link: string;
  status: string;
}
interface TokenFormData {
  name: string;
  email: string;
}

const RegistrationTokenManagement = () => {
  const [tokens, setTokens] = useState<RegistrationToken[]>([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TokenFormData>({ defaultValues: { name: "", email: "" } });

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const res = await api.get("/api/registration-tokens/all");
        setTokens(res.data.tokens);
      } catch (err) {
        console.log(err);
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
      reset();
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const msg = error.response.data.error;
        alert(msg);
      }
    }
  };

  return (
    <>
      <div>
        <div>
          <label>Employee Name *</label>
          <input
            {...register("name", {
              required: "Employee name is required.",
            })}
          />
          {errors.name && <span>{errors.name.message}</span>}
        </div>
        <div>
          <label>Employee Email *</label>
          <input
            {...register("email", {
              required: "Employee email is required.",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email format.",
              },
            })}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </div>
        <button
          type="button"
          onClick={handleSubmit(onSend)}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Generate Token & Send Email"}
        </button>
      </div>

      <div>
        <h3>Token History</h3>
        <table>
          <thead>
            <tr>
              <th>EMAIL</th>
              <th>NAME</th>
              <th>REGISTRATION LINK</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((t) => {
              return (
                <TokenItem
                  key={t.id}
                  name={t.name}
                  email={t.email}
                  link={t.link}
                  status={t.status}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

const TokenItem = ({ email, name, link, status }: TokenItemProps) => {
  return (
    <tr>
      <td>{email}</td>
      <td>{name}</td>
      <td>{link}</td>
      <td>{status}</td>
    </tr>
  );
};

export default RegistrationTokenManagement;
