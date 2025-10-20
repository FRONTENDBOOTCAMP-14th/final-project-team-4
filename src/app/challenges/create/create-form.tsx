"use client"

import Button from "@/components/common/button/button"
import ToggleSwitch from "@/components/common/toggle-switch/toggle-switch"
import {
  ChoiceInput,
  DateInput,
  FileInput,
  RangeInput,
  TagInput,
  TextInput,
} from "@/components/input"
import styles from "./create-form.module.css"
import { handleSubmit } from "./hadleSubmit"

export default function CreateForm() {
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.imageArea}>
        <FileInput id="thumbnail" />
      </div>
      <div className={styles.scrollArea}>
        <TextInput id="title" />
        <ChoiceInput id="category" />
        <TagInput id="tags" />
        <TextInput id="description" as="textarea" required={false} />
        <ChoiceInput id="uploading_type" />
        <DateInputs />
        <RangeInput id="success_threshold_percent" />
        <ToggleInput />
        <Buttons />
      </div>
    </form>
  )
}

function DateInputs() {
  return (
    <div className={styles.dates}>
      <span>기간</span>
      <div>
        <DateInput id="start_at" />
        <DateInput id="end_at" />
      </div>
    </div>
  )
}

function ToggleInput() {
  return (
    <div className={styles.toggle}>
      <span>챌린지 공개 여부</span>
      <ToggleSwitch name="is_public" onLabel="공개" offLabel="비공개" />
    </div>
  )
}

function Buttons() {
  return (
    <div className={styles.buttons}>
      <Button type="submit" className="primary">
        생성하기
      </Button>
      <Button type="reset" className="edit">
        취소하기
      </Button>
    </div>
  )
}
