import { allInputs, type InputId } from "./const"

export default function useInputConfig(id: InputId) {
  const config = allInputs.find((i) => i.id === id)
  if (!config) throw new Error("해당 인풋의 config 설정값이 없습니다.")
  return { ...config }
}
