import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const Industries = [
  "All",
  "Telecomunicações",
  "Hotelaria",
  "Turismo",
  "Tecnologia",
  "Transportes",
  "Saúde",
  "Agronegócio",
  "Energia",
  "Varejo",
  "Educação",
  "Construção"];

export const Currencies = [
  'All',
  'BRL',
  'JPY',
  'USD',
  'CAD',
  'GBP',
  'EUR'
];

export const currencySymbols: { [key: string]: string } = {
  All: 'R$',
  BRL: 'R$',
  JPY: '¥',
  USD: '$',
  CAD: 'C$',
  GBP: '£',
  EUR: '€',
};

export function convertToBRL(value: number, currency: string): number {
  const conversionRates: { [key: string]: number } = {
    BRL: 1,
    JPY: 0.034,
    USD: 5.2,
    CAD: 4.1,
    GBP: 6.5,
    EUR: 5.6,
  };
  if (!conversionRates[currency]) {
    throw new Error(`Unsupported currency: ${currency}`);
  }
  const floatValue = value / 100;
  const convertedValue = floatValue * conversionRates[currency];
  const integerResult = Math.round(convertedValue * 100);
  return integerResult;
}
