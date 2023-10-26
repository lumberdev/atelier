import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";

const CampaignPasswordPage = () => {
  const { query, replace } = useRouter();
  const { register, handleSubmit } = useForm<{ password: string }>();
  const [error, setError] = useState<{ [key: string]: string }>({});

  const { mutate: signIn } = useMutation<null, any, { password: string }>({
    mutationFn: ({ password }) =>
      axios.post("/api/auth/password", { password, campaign: query.handle }),
    onSuccess: () => {
      replace(`/${query.handle}`);
    },
    onError: (error) => {
      const data = error.response.data;
      setError({ PASSWORD: data.message ?? "Invalid password" });
    },
  });

  const onSubmit = handleSubmit((fields: { password: string }) => {
    signIn({ password: fields.password });
  });

  return (
    <div className="p-8">
      <h1 className="text-lg mb-12">Campaign Password</h1>

      <form onSubmit={onSubmit}>
        <input type="password" {...register("password")} required />
        {error.PASSWORD && <p>{error.PASSWORD}</p>}

        <button type="submit">Enter</button>
      </form>
    </div>
  );
};

export default CampaignPasswordPage;
