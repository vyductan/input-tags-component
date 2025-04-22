import React from "react";
import { useMergedState } from "@rc-component/util";

import type { InputProps } from "@acme/ui/input";
import { cn } from "@acme/ui";
import { inputSizeVariants, inputVariants } from "@acme/ui/input";
import { Tag } from "@acme/ui/tag";

type InputTagsProps = Omit<
  InputProps,
  "defaultValue" | "value" | "onChange" | "prefix"
> & {
  defaultValue?: string[];
  value?: string[];
  onChange?: (value: string[]) => void;

  /* The max number of items can be selected, only applies when mode is multiple or tags */
  maxCount?: number;
};

const InputTags = ({
  defaultValue,
  value: valueProp,
  onChange,
  maxCount,

  variant,
  size,

  onBlur,

  ...props
}: InputTagsProps) => {
  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const [value, setValue] = useMergedState(defaultValue || [], {
    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    value: valueProp || [],
    onChange: onChange,
  });

  const [pendingDataPoint, setPendingDataPoint] = React.useState("");

  React.useEffect(() => {
    if (pendingDataPoint.includes(",")) {
      const newDataPoints = new Set([
        ...value,
        ...pendingDataPoint.split(",").map((chunk) => chunk.trim()),
      ]);
      onChange?.([...newDataPoints]);
      setPendingDataPoint("");
    }
  }, [pendingDataPoint, onChange, value]);

  const addPendingDataPoint = () => {
    if (pendingDataPoint) {
      const newDataPoints = new Set([...value, pendingDataPoint]);
      setValue([...newDataPoints]);
      setPendingDataPoint("");
    }
  };

  return (
    <div
      className={cn(
        inputVariants({ variant }),
        inputSizeVariants({ size }),
        "gap-2 py-[3px] pl-[3px]",
      )}
    >
      <div className="flex gap-2">
        {value.map((tag) => (
          <Tag
            key={tag}
            closeable
            onClose={() => setValue(value.filter((v) => v !== tag))}
          >
            {tag}
          </Tag>
        ))}
      </div>
      <input
        className={cn(
          "flex-1 outline-none placeholder:text-(--color-text-placeholder)",
          maxCount !== undefined && value.length >= maxCount && `hidden`,
        )}
        value={pendingDataPoint}
        onChange={(e) => {
          setPendingDataPoint(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            addPendingDataPoint();
          } else if (
            e.key === "Backspace" &&
            pendingDataPoint.length === 0 &&
            value.length > 0
          ) {
            e.preventDefault();
            setValue(value.slice(0, -1));
          }
        }}
        onBlur={(e) => {
          onBlur?.(e);
          addPendingDataPoint();
        }}
        {...props}
      />
    </div>
  );
};

export { InputTags };
