export interface InputConfig {
  id: string
  label: string
  className?: string
  placeholder?: string
  maxLength?: number
  step?: number
  percent?: string[]
  percentText?: string
  options?: string[]
}

const textInput = [
  {
    id: "title",
    label: "타이틀",
    placeholder: "타이틀을 입력해주세요.",
    maxLength: 40,
  },
  {
    id: "description",
    label: "소개",
    placeholder: "챌린지에 대한 소개를 입력해주세요.",
    maxLength: 300,
  },

  {
    id: "tags",
    label: "해시 태그",
    placeholder: "# 해시태그 (최대 10개 입력 가능)",
    maxLength: 10,
  },
]

const choiceInput = [
  {
    id: "category",
    className: "category",
    label: "카테고리",
    options: ["건강 / 운동", "학습", "습관", "취미"],
  },
  {
    id: "uploading_type",
    className: "uploadingType",
    label: "인증 방법",
    options: ["사진 인증", "텍스트 인증", "출석체크 인증"],
  },
]

const dateInput = [
  {
    id: "start_at",
    className: "startAt",
    label: "시작 날짜",
  },
  {
    id: "end_at",
    className: "endAt",
    label: "종료 날짜",
  },
]

const rangeInput = [
  {
    id: "success_threshold_percent",
    className: "successPercent",
    label: "성공 기준",
    step: 10,
    percent: ["80", "90", "100"],
    percentText: ["느슨한", "꼼꼼한", "완벽한"],
  },
]

export const allInputs: InputConfig[] = [
  ...textInput,
  ...choiceInput,
  ...dateInput,
  ...rangeInput,
]

export type InputId = (typeof allInputs)[number]["id"]
