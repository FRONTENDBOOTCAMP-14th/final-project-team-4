import useInputConfig from "../useInputConfig"
import styles from "./choice-input.module.css"
import type { InputId } from "../const"

export interface ChoiceInputProps {
  id: InputId
  value?: string
  onChange?: (value: string) => void
  required?: boolean
}

export default function ChoiceInput({
  id,
  value,
  onChange,
  required = true,
}: ChoiceInputProps) {
  const { label, className, options } = useInputConfig(id)

  const selectedValue = value ?? options[0]

  return (
    <fieldset className={styles[className]}>
      <legend>{label}</legend>
      {options.map((option: string) => (
        <div key={option} className={styles.wrapper}>
          <input
            type="radio"
            id={option}
            name={id}
            value={option}
            checked={selectedValue === option}
            onChange={() => onChange?.(option)}
            required={required}
            className="sr-only"
          />
          <label htmlFor={option}>{option}</label>
        </div>
      ))}
    </fieldset>
  )
}
