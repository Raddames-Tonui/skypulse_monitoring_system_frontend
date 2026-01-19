import type { UserContact } from "@/context/data-access/types";

export function normalizeContacts(
  contacts: unknown
): Record<string, string> {
  if (!Array.isArray(contacts)) return {};

  return contacts.reduce<Record<string, string>>((acc, c) => {
    if (c && typeof c === "object" && "type" in c && "value" in c) {
      acc[(c as UserContact).type] = (c as UserContact).value;
    }
    return acc;
  }, {});
}
