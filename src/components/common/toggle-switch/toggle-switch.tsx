import styles from "./toggle-switch.module.css"

interface ToggleSwitchProps {
  name: string
  onLabel?: string
  offLabel?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
}

export default function ToggleSwitch({
  name,
  onLabel = "ON",
  offLabel = "OFF",
  checked = true,
  onChange,
}: ToggleSwitchProps) {
  const handleToggle = () => {
    onChange?.(!checked)
  }

  return (
    <label className={styles.toggle}>
      {checked ? onLabel : offLabel}
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={handleToggle}
        aria-checked={checked}
        value={String(checked)}
      />
    </label>
  )
}
