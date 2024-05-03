"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import { COUNTRIES, MAJORS, SCHOOLS, SHIRT_SIZES } from "@knighthacks/consts";
import { CheckIcon, ChevronDownIcon, cn } from "@knighthacks/ui";
import { Button } from "@knighthacks/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@knighthacks/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@knighthacks/ui/form";
import { Input } from "@knighthacks/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@knighthacks/ui/popover";
import { ScrollArea } from "@knighthacks/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@knighthacks/ui/select";
import { toast } from "@knighthacks/ui/toast";
import { ProfileApplicationFormSchema } from "@knighthacks/validators";

import { trpc } from "~/trpc/client";

export function ProfileForm() {
  const form = useForm({
    schema: ProfileApplicationFormSchema,
    defaultValues: {
      phone: "",
      age: 18,
      shirtSize: "SM",
      major: "Computer Science",
      school: "The University of Central Florida",
      gradYear: (new Date().getFullYear() + 4).toString(),
      address1: "",
      address2: "",
      city: "",
      state: "",
      zip: "",
      country: "United States",
      github: "",
      personalWebsite: "",
      linkedin: "",
    },
  });
  const { getToken } = useAuth();

  const router = useRouter();
  const createProfile = trpc.user.profileApplication.useMutation({
    onSuccess: async () => {
      toast("Success!", {
        description: "Created user profile",
      });
      router.refresh();
    },
    onError: (error) => {
      toast("Error!", {
        description: error.message,
      });
    },
  });

  return (
    <div className="mx-auto w-full max-w-screen-sm px-8 pb-8 pt-20">
      <h1 className="mb-4 text-center text-2xl font-bold">
        Create Your Profile!
      </h1>
      <Form {...form}>
        <form
          className="space-y-4"
          onSubmit={form.handleSubmit(async (data) => {
            const token = await getToken();

            let resumeKey = "";
            if (data.resume && token) {
              try {
                resumeKey = await uploadResume(data.resume, token);
              } catch {
                toast("Error!", {
                  description: "Failed to upload resume",
                });
              }
            }

            createProfile.mutate({
              ...data,
              resume: resumeKey,
            });
          })}
        >
          <h2 className="text-xl font-semibold">About You</h2>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Phone" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Age" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="shirtSize"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shirt Size</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your shirt size" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SHIRT_SIZES.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="major"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Major</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between px-3",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? MAJORS.find((major) => major === field.value)
                          : "Select your major"}
                        <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <MajorsComboBox value={field.value} form={form} />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="school"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>School</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between px-3",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? SCHOOLS.find((school) => school === field.value)
                          : "Select your school"}
                        <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <SchoolsCombobox value={field.value} form={form} />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gradYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Graduation Year</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your graduation year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from(
                      { length: 5 },
                      (_, i) => new Date().getFullYear() + i,
                    ).map((year) => (
                      <SelectItem key={year} value={String(year)}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <h2 className="text-xl font-semibold">Shipping Information</h2>
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Country</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "justify-between px-3",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value
                          ? COUNTRIES.find((country) => country === field.value)
                          : "Select your country"}
                        <ChevronDownIcon className="h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="p-0">
                    <CountriesCombobox value={field.value} form={form} />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="State" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zip Code</FormLabel>
                <FormControl>
                  <Input placeholder="Zip Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 1</FormLabel>
                <FormControl>
                  <Input placeholder="Address Line 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address Line 2</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Address Line 2"
                    {...field}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <h2 className="text-xl font-semibold">For Our Sponsors</h2>
          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub</FormLabel>
                <FormControl>
                  <Input placeholder="GitHub" {...field} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="personalWebsite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Personal Website</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Personal Website"
                    {...field}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn</FormLabel>
                <FormControl>
                  <Input
                    placeholder="LinkedIn"
                    {...field}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="resume"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Resume</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => field.onChange(e.target.files?.[0])}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Create User Profile
          </Button>
        </form>
      </Form>
    </div>
  );
}

function MajorsComboBox({
  value,
  form,
}: {
  value: (typeof MAJORS)[number];
  form: ReturnType<typeof useForm<typeof ProfileApplicationFormSchema>>;
}) {
  const [search, setSearch] = useState("");
  const filteredMajors = useMemo(() => {
    return MAJORS.filter((major) =>
      major.toLowerCase().includes(search.toLowerCase()),
    ).slice(0, 5);
  }, [search]);

  return (
    <Command>
      <CommandInput
        value={search}
        onValueChange={setSearch}
        placeholder="Search majors..."
      />
      <CommandEmpty>No major found.</CommandEmpty>
      <ScrollArea>
        <CommandGroup>
          {filteredMajors.map((major) => (
            <CommandItem
              value={major}
              key={major}
              onSelect={() => {
                form.setValue("major", major);
              }}
            >
              <CheckIcon
                className={cn(
                  "mr-2 h-4 w-4",
                  major === value ? "opacity-100" : "opacity-0",
                )}
              />
              {major}
            </CommandItem>
          ))}
        </CommandGroup>
      </ScrollArea>
    </Command>
  );
}

function SchoolsCombobox({
  value,
  form,
}: {
  value: (typeof SCHOOLS)[number];
  form: ReturnType<typeof useForm<typeof ProfileApplicationFormSchema>>;
}) {
  const [search, setSearch] = useState("");
  const filteredSchools = useMemo(() => {
    return SCHOOLS.filter((school) =>
      school.toLowerCase().includes(search.toLowerCase()),
    ).slice(0, 5);
  }, [search]);

  return (
    <Command>
      <CommandInput
        value={search}
        onValueChange={setSearch}
        placeholder="Search schools..."
      />
      <CommandEmpty>No school found.</CommandEmpty>
      <ScrollArea>
        <CommandGroup>
          {filteredSchools.map((school) => (
            <CommandItem
              value={school}
              key={school}
              onSelect={() => {
                form.setValue("school", school);
              }}
            >
              <CheckIcon
                className={cn(
                  "mr-2 h-4 w-4",
                  school === value ? "opacity-100" : "opacity-0",
                )}
              />
              {school}
            </CommandItem>
          ))}
        </CommandGroup>
      </ScrollArea>
    </Command>
  );
}

function CountriesCombobox({
  value,
  form,
}: {
  value: (typeof COUNTRIES)[number];
  form: ReturnType<typeof useForm<typeof ProfileApplicationFormSchema>>;
}) {
  const [search, setSearch] = useState("");
  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter((country) =>
      country.toLowerCase().includes(search.toLowerCase()),
    ).slice(0, 5);
  }, [search]);

  return (
    <Command>
      <CommandInput
        value={search}
        onValueChange={setSearch}
        placeholder="Search countries..."
      />
      <CommandEmpty>No school found.</CommandEmpty>
      <ScrollArea>
        <CommandGroup>
          {filteredCountries.map((country) => (
            <CommandItem
              value={country}
              key={country}
              onSelect={() => {
                form.setValue("country", country);
              }}
            >
              <CheckIcon
                className={cn(
                  "mr-2 h-4 w-4",
                  country === value ? "opacity-100" : "opacity-0",
                )}
              />
              {country}
            </CommandItem>
          ))}
        </CommandGroup>
      </ScrollArea>
    </Command>
  );
}

export async function uploadResume(resume: File, token: string) {
  const formData = new FormData();
  formData.append("resume", resume);
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/resume/upload/${resume.name}`,
    {
      method: "PUT",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const { key } = (await res.json()) as { key: string };
  return key;
}
