import type { ChannelType } from "@prisma/client";

type ChannelValue = Readonly<{
  type: ChannelType;
  value: string;
}>;

export function getChannelValue(
  channels: readonly ChannelValue[],
  type: ChannelType,
) {
  return channels.find((channel) => channel.type === type)?.value ?? "";
}
