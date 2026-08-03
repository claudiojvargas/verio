"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { getOrCreateCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db/client";
import {
  channelsFromForm,
  normalizeName,
} from "@/modules/businesses/application/normalization";
import {
  businessFormSchema,
  competitorFormSchema,
} from "@/modules/businesses/schemas/business-form";

export type FormActionState =
  | { success: true; message: string }
  | { success: false; message: string; fields?: Record<string, string[]> };

async function requireCurrentUser() {
  const user = await getOrCreateCurrentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}

function validationError(error: import("zod").ZodError): FormActionState {
  return {
    success: false,
    message: "Revise os campos destacados.",
    fields: error.flatten().fieldErrors as Record<string, string[]>,
  };
}

function unexpectedError(error: unknown): FormActionState {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  ) {
    return {
      success: false,
      message: "Este registro já existe ou ocupa a mesma posição.",
    };
  }
  return {
    success: false,
    message: "Não foi possível salvar. Tente novamente.",
  };
}

export async function saveBusiness(input: unknown): Promise<FormActionState> {
  const parsed = businessFormSchema.safeParse(input);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const user = await requireCurrentUser();
    const channels = channelsFromForm(parsed.data);

    await db.$transaction(
      async (transaction) => {
        const membership = await transaction.businessMembership.findFirst({
          where: {
            userId: user.id,
            role: "OWNER",
            business: { status: "ACTIVE" },
          },
        });
        const business = membership
          ? await transaction.business.update({
              where: { id: membership.businessId },
              data: {
                name: parsed.data.name,
                normalizedName: normalizeName(parsed.data.name),
                city: parsed.data.city,
                state: parsed.data.state || null,
              },
            })
          : await transaction.business.create({
              data: {
                name: parsed.data.name,
                normalizedName: normalizeName(parsed.data.name),
                city: parsed.data.city,
                state: parsed.data.state || null,
                memberships: { create: { userId: user.id, role: "OWNER" } },
              },
            });

        for (const channel of channels) {
          await transaction.businessChannel.upsert({
            where: {
              businessId_type: { businessId: business.id, type: channel.type },
            },
            update: channel,
            create: { ...channel, businessId: business.id },
          });
        }

        const presentTypes = channels.map(({ type }) => type);
        await transaction.businessChannel.deleteMany({
          where: {
            businessId: business.id,
            type: { notIn: presentTypes },
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    revalidatePath("/painel");
    revalidatePath("/empresa");
    return { success: true, message: "Empresa salva com sucesso." };
  } catch (error) {
    return unexpectedError(error);
  }
}

export async function archiveBusiness(): Promise<FormActionState> {
  try {
    const user = await requireCurrentUser();
    const membership = await db.businessMembership.findFirst({
      where: { userId: user.id, role: "OWNER", business: { status: "ACTIVE" } },
    });
    if (!membership)
      return { success: false, message: "Empresa não encontrada." };

    await db.business.update({
      where: { id: membership.businessId },
      data: { status: "ARCHIVED" },
    });
    revalidatePath("/painel");
    revalidatePath("/empresa");
    return { success: true, message: "Empresa arquivada." };
  } catch (error) {
    return unexpectedError(error);
  }
}

export async function saveCompetitor(
  input: unknown,
  competitorId?: string,
): Promise<FormActionState> {
  const parsed = competitorFormSchema.safeParse(input);
  if (!parsed.success) return validationError(parsed.error);

  try {
    const user = await requireCurrentUser();
    const membership = await db.businessMembership.findFirst({
      where: { userId: user.id, role: "OWNER", business: { status: "ACTIVE" } },
    });
    if (!membership) {
      return {
        success: false,
        message: "Cadastre sua empresa antes dos concorrentes.",
      };
    }

    await db.$transaction(
      async (transaction) => {
        if (competitorId) {
          const relation = await transaction.competitor.findFirst({
            where: { id: competitorId, businessId: membership.businessId },
          });
          if (!relation) throw new Error("NOT_FOUND");
          await transaction.business.update({
            where: { id: relation.competitorBusinessId },
            data: {
              name: parsed.data.name,
              normalizedName: normalizeName(parsed.data.name),
              city: parsed.data.city,
              state: parsed.data.state || null,
              channels: {
                deleteMany: {},
                create: channelsFromForm(parsed.data),
              },
            },
          });
          return;
        }

        const occupied = await transaction.competitor.findMany({
          where: { businessId: membership.businessId },
          select: { position: true },
        });
        if (occupied.length >= 3) throw new Error("COMPETITOR_LIMIT");
        const position = [1, 2, 3].find(
          (candidate) => !occupied.some((item) => item.position === candidate),
        );
        if (!position) throw new Error("COMPETITOR_LIMIT");

        const competitorBusiness = await transaction.business.create({
          data: {
            name: parsed.data.name,
            normalizedName: normalizeName(parsed.data.name),
            city: parsed.data.city,
            state: parsed.data.state || null,
            channels: { create: channelsFromForm(parsed.data) },
          },
        });
        await transaction.competitor.create({
          data: {
            businessId: membership.businessId,
            competitorBusinessId: competitorBusiness.id,
            createdByUserId: user.id,
            position,
          },
        });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    revalidatePath("/concorrentes");
    return { success: true, message: "Concorrente salvo com sucesso." };
  } catch (error) {
    if (error instanceof Error && error.message === "COMPETITOR_LIMIT") {
      return {
        success: false,
        message: "O limite do MVP é de três concorrentes.",
      };
    }
    return unexpectedError(error);
  }
}

export async function removeCompetitor(
  competitorId: string,
): Promise<FormActionState> {
  try {
    const user = await requireCurrentUser();
    const removed = await db.$transaction(async (transaction) => {
      const relation = await transaction.competitor.findFirst({
        where: {
          id: competitorId,
          business: {
            memberships: { some: { userId: user.id, role: "OWNER" } },
          },
        },
      });
      if (!relation) return false;

      await transaction.competitor.delete({ where: { id: relation.id } });
      const remainingRelations = await transaction.competitor.count({
        where: { competitorBusinessId: relation.competitorBusinessId },
      });
      const memberships = await transaction.businessMembership.count({
        where: { businessId: relation.competitorBusinessId },
      });
      if (remainingRelations === 0 && memberships === 0) {
        await transaction.business.update({
          where: { id: relation.competitorBusinessId },
          data: { status: "ARCHIVED" },
        });
      }
      return true;
    });
    if (!removed)
      return { success: false, message: "Concorrente não encontrado." };
    revalidatePath("/concorrentes");
    return { success: true, message: "Concorrente removido." };
  } catch (error) {
    return unexpectedError(error);
  }
}
