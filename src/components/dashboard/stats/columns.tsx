"use client"

import { Transaction } from "@/lib/types"
import { CellContext, ColumnDef, Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Badge } from '@/components/ui/badge';
import { ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableCell } from "../../ui/table"
import { format } from "date-fns";
import { useTransactions } from "@/store/use-transactions";

interface AmountcellProps {
  row: Row<Transaction>;
}
function AmountCell({ row }: AmountcellProps & React.PropsWithChildren) {
  const amount = Number(row.getValue("amount")) / 100;
  const currency = useTransactions((state) => state.currency);
  const formatted = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency === 'All' ? 'BRL' : currency,
  }).format(amount)
  return (<div className="p-2 font-medium">{formatted}</div>);
}

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (<TableCell>
        {format(new Date(row.getValue("date")), 'MMM dd, yyyy')}
      </TableCell>)
    }
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "desc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <AmountCell row={row} />
    },
  },
  {
    accessorKey: "transaction_type",
    header: () => <div className=" ml-2 text-left">Type</div>,
    cell: ({ row }) => {
      return (<TableCell className="flex justify-left">
        <Badge variant={row.getValue("transaction_type") === 'deposit' ? 'success' : 'destructive'}>
          {row.getValue("transaction_type")}
        </Badge>
      </TableCell>)
    }
  },
  {
    accessorKey: "industry",
    header: () => <div className=" ml-2 text-left">Industry</div>,
    cell: ({ row }) => <div className="p-2 font-medium">{row.getValue("industry")}</div>
  },
]