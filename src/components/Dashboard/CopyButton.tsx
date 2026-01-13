"use client";

import toast from "react-hot-toast";

type Props = {
  value: string;
  label?: string;
  className?: string;
};

const CopyButton = ({ value, label = "Copy", className }: Props) => {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied to clipboard");
    } catch (error: any) {
      toast.error(error?.message || "Unable to copy");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`rounded-lg border border-stroke px-3 py-1 text-xs font-medium hover:border-primary hover:text-primary dark:border-dark-3 dark:hover:border-primary ${className || ""}`}
    >
      {label}
    </button>
  );
};

export default CopyButton;
