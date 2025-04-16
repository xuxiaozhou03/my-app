import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const extractJsonFromCallback = <T>(
  callbackString: string,
  callback = "callback"
): T | null => {
  const jsonString = callbackString.match(new RegExp(`${callback}\\((.*)\\)`));
  if (!jsonString) {
    return null;
  }
  return JSON.parse(jsonString[1]) as T;
};

const wait = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));

export const loopRun = async (fns: Array<() => void>, delyTime = 30) => {
  let fn = fns.shift();
  while (fn) {
    await fn();
    await wait(delyTime);
    fn = fns.shift();
  }
};
