import DynamicForm from "@/components/dynamic-form/DynamicForm";
import { createUserSchema } from "@components/dynamic-form/utils/FormSchema.ts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosClient from "@/utils/constants/axiosClient";
import toast from "react-hot-toast";
import type { AxiosError } from "axios";
import { Link } from "@tanstack/react-router";
import {useCreateUser} from "@/pages/users/data-access/useFetchData.tsx";
import type {CreateUserPayload} from "@/pages/users/data-access/types.ts";

export default function CreateUser() {
  const queryClient = useQueryClient();
  const createUser = useCreateUser();

  const { data: companiesPaginated } = useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const res = await axiosClient.get("/settings/companies");
      return res.data;
    },
  });


  const companies = companiesPaginated?.data || [];

  const schema = {
    ...createUserSchema,
    fields: {
      ...createUserSchema.fields,
      company_id: {
        ...createUserSchema.fields.company_id,
        props: { ...createUserSchema.fields.company_id.props, data: companies },
      },
    },
  };

  const handleSubmit = (values: Record<string, any>) => {
    const payload: CreateUserPayload = {
      first_name: values.first_name,
      last_name: values.last_name,
      user_email: values.user_email,
      role_name: values.role_name,
      company_id: Number(values.company_id),
    };

    createUser.mutate(payload, {
      onSuccess: (res: any) => {
        const message = res?.data?.message || "User created successfully!";
        toast.success(message);

        queryClient.invalidateQueries({ queryKey: ["users"] });
      },
      onError: (err: unknown) => {
        const error = err as AxiosError;
        const message =
          error.response?.data?.message || error.message || "Failed to create user";
        toast.error(message);
      },
    });
  };

  return <section>
    <div className="page-header">
        <h1>Create New User</h1>
     
      <Link to="/users" className="btn-secondary"> Back</Link>
    </div>
    <DynamicForm schema={schema} onSubmit={handleSubmit} />
  </section>
};
