import type { ButtonHTMLAttributes } from "react";

export default function Boton({ className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      {...props}
      className={`rounded-xl bg-teal-600 px-5 py-3 text-base font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    />
  );
}
