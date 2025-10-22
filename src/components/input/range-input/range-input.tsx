import useInputConfig from "../useInputConfig"
import styles from "./range-input.module.css"

interface RangeInputProps {
  id: string
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  infoMessage?: string
}

export default function RangeInput({
  id,
  value,
  onChange,
  infoMessage,
}: RangeInputProps) {
  const { className, label, step, percent, percentText } = useInputConfig(id)

  const controlledValue = value ?? percent.at(0) ?? 0

  return (
    <div className={styles[className]}>
      <label htmlFor={id}>{label}</label>
      <div className={styles.controls}>
        <input
          type="range"
          id={id}
          name={id}
          min={percent.at(0)}
          max={percent.at(-1)}
          step={step}
          list="markers"
          value={controlledValue}
          onChange={(e) => onChange?.(Number(e.target.value))}
        />
        <datalist id="markers">
          {percent.map((p, i) => (
            <option value={p} key={p}>
              {percentText?.[i]}
            </option>
          ))}
        </datalist>
      </div>
      {infoMessage && <div className={styles.info}>{infoMessage}</div>}
    </div>
  )
}
