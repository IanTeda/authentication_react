//-- ./src/components/users/Column.tsx

/**
 * @file Column.tsx
 * @description This file contains the Column component which is used to
 * display a column in the DataTable. The column can be sorted and filtered
 * by different columns.   The column can also be resized and can be
 * searched by different columns.
 * @reference https://ui.shadcn.com/docs/components/data-table
 */

import type { User } from "@/domains/user";
import type { ColumnDef } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../shadcn_ui/dropdown-menu";
import { Button } from "../shadcn_ui/button";
import { MoreHorizontal } from "lucide-react";

/**
 * # User Columns
 * 
 * This is the columns definition for the user table. Columns are where you define 
 * the core of what your table will look like. They define the data that will 
 * be displayed, how it will be formatted, sorted and filtered.
 */
export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ row }) => {
      const isVerified = row.getValue("isVerified") as boolean;

      const formatted = isVerified ? "Yes" : "No";

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "isVerified",
    header: "Verified",
    cell: ({ row }) => {
      const isVerified = row.getValue("isVerified") as boolean;

      const formatted = isVerified ? "✔️" : "❌";

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "createdOn",
    header: "Created",
    cell: ({ row }) => {
      const date = row.getValue("createdOn") as Date;
      const formatted = new Intl.DateTimeFormat("en-AU", {
        dateStyle: "medium",
      }).format(date);

      return <div className="text-center font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent  align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuItem>Update</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];