import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";

export type Theme = "light" | "dark";
const storageKey = "_preferred-theme";

export const getThemeServerFn = createServerFn().handler(
	async () => (getCookie(storageKey) || "light") as Theme,
);

export const setThemeServerFn = createServerFn({ method: "POST" }).handler(
	async ({ data }) => {
		if (typeof data === "string") {
			setCookie(storageKey, data);
		} else {
			throw new Error("Invalid data: expected a string");
		}
	},
);
