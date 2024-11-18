import { DateRange } from "react-day-picker";
import { z } from "zod";
export type Currency = 'All' | 'BRL' | 'JPY' | 'USD' | 'CAD' | 'GBP' | 'EUR';
export type Industry =
  'All' |
  "Telecomunicações" |
  "Hotelaria" |
  "Turismo" |
  "Tecnologia" |
  "Transportes" |
  "Saúde" |
  "Agronegócio" |
  "Energia" |
  "Varejo" |
  "Educação" |
  "Construção";

export interface Transaction {
  date: string;
  amount: number;
  transaction_type: 'deposit' | 'withdraw';
  currency: Currency;
  account: string;
  industry: Industry;
  state: string;
}

export interface User {
  email: string;
  name: string;
}

export interface AuthState {
  user: { email: string; name: string, password: string } | null;
  isAuthenticated: boolean;
  login: (email: string, name: string, password: string) => void;
  logout: () => void;
}

export type Filters = {
  dateRange: DateRange,
  currency: Currency,
  industry: Industry,
};

export const formSchema = z.object({
  dateRange: z.custom<DateRange>(),
  currency: z.custom<Currency>(),
  industry: z.custom<Industry>(),
})

export type TransactionState = {
  loading: boolean,
  setLoading: (loading: boolean) => void;
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  pendingSum: number;
  setPendingSum: (sum: number) => void;
  totalDeposits: number;
  setTotalDeposits: (sum: number) => void;
  totalWithdraws: number;
  setTotalWithdraws: (sum: number) => void;
  dateRange: DateRange;
  setDateRange: (range: DateRange) => void;
  currency: Currency
  setCurrency: (currency: Currency) => void;
  industry: Industry;
  setIndustry: (industry: Industry) => void;
}