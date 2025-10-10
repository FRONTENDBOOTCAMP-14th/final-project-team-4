import { clsx } from "clsx"
import styles from "./button.module.css"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className: string
}

export default function Button({ className, children, ...props }: ButtonProps) {
  return (
    <button className={clsx(styles.button, styles[className])} {...props}>
      {children}
    </button>
  )
}
