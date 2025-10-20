import useInputConfig from "../useInputConfig"
import styles from "./range-input.module.css"
import type { InputId } from "../const"

export default function RangeInput({ id }: { id: InputId }) {
  const { className, label, step, percent, percentText } = useInputConfig(id)
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
        />
        <datalist id="markers">
          {percent.map((p, i) => (
            <option value={p} key={p}>
              {percentText[i]}
            </option>
          ))}
        </datalist>
      </div>
    </div>
  )
}
