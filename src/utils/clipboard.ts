import type { DateGroup } from "../types";
import { formatDateWithDay } from "./date";

export function formatDateGroup(group: DateGroup): string {
  const lines = group.todos.map((todo, index) => `${index + 1}. ${todo.content}`);
  return [formatDateWithDay(group.date), ...lines].join("\n");
}

export function formatAllGroups(groups: DateGroup[]): string {
  return groups.map(formatDateGroup).join("\n\n");
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return legacyCopy(text);
  }
}

function legacyCopy(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  let success = false;
  try {
    success = document.execCommand("copy");
  } catch {
    success = false;
  }
  document.body.removeChild(textarea);
  return success;
}
