import useInputConfig from "../useInputConfig"
import styles from "./date-input.module.css"
import type { InputId } from "../const"

export default function DateInput({ id }: { id: InputId }) {
  const { className, label } = useInputConfig(id)
  return (
    <div className={styles[className]}>
      <label htmlFor={id}>{label}</label>
      <input type="date" id={id} name={id} />
    </div>
  )
}
