"use client";

import { useState } from "react";

import { Button } from "@knighthacks/ui/button";
import { Sheet, SheetContent } from "@knighthacks/ui/sheet";

import { DataTable } from "~/app/_components/data-table";
import { trpc } from "~/trpc";
import { AddUserForm } from "./add-user-form";
import { columns } from "./columns";

export default function Users() {
  const [addUserFormSheetOpen, setAddUserFormSheetOpen] = useState(false);

  return (
    <div className="px-4">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4">
          <Button onClick={() => setAddUserFormSheetOpen(true)}>
            Add User
          </Button>
        </div>
        <UsersTable />
      </div>
      <Sheet open={addUserFormSheetOpen} onOpenChange={setAddUserFormSheetOpen}>
        <SheetContent>
          <AddUserForm />
        </SheetContent>
      </Sheet>
    </div>
  );
}

export function UsersTable() {
  const { data: users, isLoading, error } = trpc.users.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  return <DataTable columns={columns} data={users} />;
}
