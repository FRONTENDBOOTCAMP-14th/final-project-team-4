import useInputConfig from "../useInputConfig"
import styles from "./choice-input.module.css"
import type { InputId } from "../const"

export interface ChoiceInputProps {
  id: InputId
  type?: "checkbox" | "radio"
  required?: boolean
}

export default function ChoiceInput({
  id,
  type = "radio",
  required = true,
}: ChoiceInputProps) {
  const { label, className, options } = useInputConfig(id)

  return (
    <fieldset className={styles[className]}>
      <legend>{label}</legend>
      {options.map((option: string, index: number) => (
        <div key={option} className={styles.wrapper}>
          <input
            type={type}
            id={option}
            className="sr-only"
            name={id}
            defaultChecked={index === 0}
            value={option}
            required={required}
          />
          <label htmlFor={option}>{option}</label>
        </div>
      ))}
    </fieldset>
  )
}
