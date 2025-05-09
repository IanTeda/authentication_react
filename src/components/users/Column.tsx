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

/**
 * # User Columns
 * 
 * This is the columns definition for the user table. Columns are where you define 
 * the core of what your table will look like. They define the data that will 
 * be displayed, how it will be formatted, sorted and filtered.
 */
export const columns: ColumnDef<User>[] = [
  // {
  //   id: "id",
  //   header: "ID",
  // },
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
  },
  {
    accessorKey: "isVerified",
    header: "Verified",
  },
  {
    accessorKey: "createdOn",
    header: "Created",
  },
];