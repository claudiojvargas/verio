import "server-only";

import { currentUser } from "@clerk/nextjs/server";

import { db } from "@/lib/db/client";

export class IdentityConflictError extends Error {
  constructor() {
    super("An account already exists with this email and another identity.");
    this.name = "IdentityConflictError";
  }
}

/**
 * Synchronizes the minimum identity required by the Verio domain after Clerk
 * has authenticated the request. Passwords and session tokens never reach the
 * application database.
 */
export async function getOrCreateCurrentUser() {
  const identity = await currentUser();

  if (!identity) {
    return null;
  }

  const primaryEmail = identity.emailAddresses.find(
    ({ id }) => id === identity.primaryEmailAddressId,
  )?.emailAddress;

  if (!primaryEmail) {
    throw new Error("The authenticated identity has no primary email address.");
  }

  const email = primaryEmail.trim().toLowerCase();
  const existingUser = await db.user.findFirst({
    where: {
      OR: [{ identityProviderId: identity.id }, { email }],
    },
  });

  if (existingUser && existingUser.identityProviderId !== identity.id) {
    throw new IdentityConflictError();
  }

  const name = [identity.firstName, identity.lastName].filter(Boolean).join(" ");

  return db.user.upsert({
    where: { identityProviderId: identity.id },
    update: {
      email,
      name: name || null,
      status: "ACTIVE",
    },
    create: {
      identityProviderId: identity.id,
      email,
      name: name || null,
    },
  });
}
