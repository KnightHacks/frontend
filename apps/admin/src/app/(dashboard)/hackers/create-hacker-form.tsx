import { Button } from "@knighthacks/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@knighthacks/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@knighthacks/ui/select";
import { Textarea } from "@knighthacks/ui/textarea";
import { toast } from "@knighthacks/ui/toast";
import { CreateHackerSchema } from "@knighthacks/validators";

import { api } from "~/trpc";

export function CreateHackerForm() {
  const utils = api.useUtils();
  const createHacker = api.hacker.adminCreate.useMutation({
    onSuccess: async () => {
      await utils.hacker.adminAll.invalidate();
      toast("Success!", {
        description: "User added",
      });
    },
  });

  const form = useForm({
    schema: CreateHackerSchema,
    defaultValues: {
      survey1: "",
      survey2: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          createHacker.mutate(data);
        })}
        className="flex flex-col justify-center space-y-6"
      >
        <FormField
          control={form.control}
          name="survey1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Why do you want to attend Knight Hacks?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Why do you want to attend Knight Hacks?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="survey2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What do you want to learn at Knight Hacks?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What do you want to learn at Knight Hacks?"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <HackathonSelect form={form} />
        <UserSelect form={form} />
        <StatusSelect form={form} />
        <Button type="submit">Create Hacker</Button>
      </form>
    </Form>
  );
}

function HackathonSelect({
  form,
}: {
  form: ReturnType<typeof useForm<typeof CreateHackerSchema>>;
}) {
  const {
    data: hackathons,
    isPending,
    isError,
  } = api.hackathon.adminAll.useQuery();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading hackathons</div>;
  }

  return (
    <FormField
      control={form.control}
      name="hackathonId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Hackathon</FormLabel>
          <Select
            onValueChange={(value) => {
              field.onChange(parseInt(value));
            }}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a hackathon" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {hackathons.map((hackathon) => (
                <SelectItem key={hackathon.id} value={hackathon.id.toString()}>
                  {hackathon.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function UserSelect({
  form,
}: {
  form: ReturnType<typeof useForm<typeof CreateHackerSchema>>;
}) {
  const { data: users, isPending, isError } = api.user.adminAll.useQuery();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading hackathons</div>;
  }

  return (
    <FormField
      control={form.control}
      name="userId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>User</FormLabel>
          <Select onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id.toString()}>
                  {user.firstName} {user.lastName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

function StatusSelect({
  form,
}: {
  form: ReturnType<typeof useForm<typeof CreateHackerSchema>>;
}) {
  return (
    <FormField
      control={form.control}
      name="status"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Status</FormLabel>
          <Select onValueChange={field.onChange}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {["applied", "accepted", "waitlisted", "checkedin"].map(
                (status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ),
              )}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
