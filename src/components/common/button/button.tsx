import { clsx } from "clsx"
import styles from "./button.module.css"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className: string
  type: "button" | "submit" | "reset"
}

export default function Button({
  className,
  children,
  type,
  ...props
}: ButtonProps) {
  return (
    <button
      className={clsx(styles.button, styles[className])}
      type={type}
      {...props}
    >
      {children}
    </button>
  )
}
