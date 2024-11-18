'use client';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { subDays, format, setDate } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Industries, Currencies, currencySymbols } from '@/lib/utils';
import { useTransactions } from '@/store/use-transactions';
import { Currency, Filters, formSchema, Industry } from '@/lib/types';

export default function FilterForm() {

    const setLoading = useTransactions((state) => state.setLoading);
    const setDateRange = useTransactions((state) => state.setDateRange);
    const dateRange = useTransactions((state) => state.dateRange);
    const setCurrency = useTransactions((state) => state.setCurrency);
    const currency = useTransactions((state) => state.currency);
    const setIndustry = useTransactions((state) => state.setIndustry);
    const industry = useTransactions((state) => state.industry);
    const setTransactions = useTransactions((state) => state.setTransactions);
    const setPendingSum = useTransactions((state) => state.setPendingSum);
    const setTotalDeposits = useTransactions((state) => state.setTotalDeposits);
    const setTotalWithdraws = useTransactions((state) => state.setTotalWithdraws);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            dateRange: dateRange,
            currency: currency,
            industry: industry,
        },
    });

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            console.log(values);
            console.log("onSubmit");
            setLoading(true);
            const to = format(values.dateRange.to ?? Date.now(), "yyyy-MM-dd");
            const from = format(values.dateRange.from ?? subDays(to, 30), "yyyy-MM-dd");
            setCurrency(values.currency);
            setIndustry(values.industry);
            const response = await fetch(`${baseUrl}/transactions?from=${from}&to=${to}&currency=${values.currency ?? "All"}&industry=${values.industry ?? "All"}`);
            const responseData = await response.json();
            setTransactions(responseData.data);
            setPendingSum(responseData.pendingTransactionsSum);
            setTotalDeposits(responseData.totalDeposits);
            setTotalWithdraws(responseData.totalWithdraws);
            console.log("response data: ");
            console.log(responseData);
            setLoading(false);
            return responseData;
        }
        catch (e) {
            console.log(e);
            setLoading(false);
            return null;
        }

    }

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 m-2">
                <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Industry</FormLabel>
                            <Select onValueChange={(value: Industry) => {
                                field.onChange(value);
                            }} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select the industry." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Industries.map((industry, index) => {
                                        return <SelectItem key={index} value={industry}>{industry}</SelectItem>
                                    })}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Select the industry you want to analyze.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <Select onValueChange={(value: Currency) => {
                                field.onChange(value);
                                console.log(value);

                            }} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select the currency." />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {Currencies.map((currency, index) => {
                                        if (currency === "All")
                                            return <SelectItem key={index} value={currency}>{currency}(Convert to R$)</SelectItem>
                                        return <SelectItem key={index} value={currency}>{currency}({currencySymbols[currency]})</SelectItem>
                                    })}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                Select the currency of the transactions.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="dateRange"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Range of time</FormLabel>

                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[260px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="h-4 w-4 opacity-50" />
                                            {field.value?.from ? (
                                                field.value.to ? (
                                                    <>
                                                        {format(field.value.from, "LLL dd, y")} -{" "}
                                                        {format(field.value.to, "LLL dd, y")}
                                                    </>
                                                ) : (
                                                    format(field.value.from, "LLL dd, y")
                                                )
                                            ) : (
                                                <span>Pick a date</span>
                                            )}
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar

                                        initialFocus
                                        mode="range"
                                        defaultMonth={field.value?.from}
                                        max={30}
                                        selected={field.value}
                                        onSelect={(value) => {
                                            field.onChange(value);
                                            console.log(value);
                                            setDateRange(value ?? dateRange);
                                        }
                                        }
                                        numberOfMonths={2}
                                        disabled={{ after: new Date() }}
                                    />
                                </PopoverContent>
                            </Popover>
                            <FormDescription>
                                The range of time of the transactions.
                                <br /> The max range is 30 days.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className='w-full' variant="outline" type="submit">Submit</Button>
            </form>
        </Form>
    );

}

