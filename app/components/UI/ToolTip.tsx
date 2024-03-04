import React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";

interface Props {
  children: any;
  content: string;
}
export default function TooltipComponent({ children, content }: Props) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-white w-fit max-w-[250px] h-fit p-4 rounded-md flex justify-center items-center"
            sideOffset={5}
          >
            <span className="text-xs text-zinc-600">{content}</span>
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
