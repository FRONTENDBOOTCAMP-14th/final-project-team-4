import styles from "./file-input.module.css"
import type { InputId } from "../const"

export default function FileInput({ id }: { id: InputId }) {
  return (
    <div className={styles[id]}>
      <label htmlFor={id} tabIndex={50}>
        이미지 등록
      </label>
      <input type="file" id={id} name={id} />
      <small>썸네일 권장 크기: 400 x 800</small>
    </div>
  )
}
