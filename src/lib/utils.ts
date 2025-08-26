export const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

