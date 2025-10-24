"use client"
import { useState } from "react"
import Image from "next/image"
import Avatar from "@/components/user/avatar/avatar"
import { useRecordActions } from "@/utils/hooks/useRecordActions"
import { useRecordCard } from "@/utils/hooks/useRecordCard"
import useRecordCardStore from "store/useRecordCardStore"
import styles from "./certification-post.module.css"

interface Props {
  recordId: string
  userId?: string | null
}

export default function CertificationPost({ recordId, userId }: Props) {
  const [isFilled, setIsFilled] = useState(false)
  const { data, error, isLoading, mutate } = useRecordCard(recordId, userId)

  const { likeMut, reportMut } = useRecordActions(recordId, userId)

  const { isLiked, likesCount, commentsCount, isReported } =
    useRecordCardStore()

  if (error) return <p>데이터를 불러올 수 없습니다 😢</p>
  if (isLoading || !data) return <p>불러오는 중…</p>

  const date = data.participant?.completed_days
    ? `${data.participant.completed_days}일차`
    : ""

  return (
    <div className={styles.container}>
      <div className={styles.userWrapper}>
        <Avatar
          imageUrl={
            data.image_url ? data.image_url : "/fallback/fallback-user.png"
          }
          altText={data.user?.username ? data.user?.username : "user avatar"}
          responsive="profileSizes"
          className={styles.userAvatar}
        />
        <div>
          <strong className={styles.userName}>
            {data.user?.username ? data.user?.username : "익명"}
          </strong>
          <span className={styles.date}>{date}일차</span>
          <span>n시간 전</span>
        </div>
      </div>

      <figure className={styles.imageWrapper}>
        <Image
          src={data.image_url ? data.image_url : "/fallback/fallback-image.png"}
          alt={styles.caption}
          width={720}
          height={480}
          className={styles.image}
          aria-hidden
        />
      </figure>
      <p className={styles.caption}>
        {data.content ? data.content : "기본 텍스트입니다"}
      </p>

      <div className={styles.buttonWrapper}>
        <button
          type="button"
          aria-pressed={isLiked}
          onClick={async () => {
            setIsFilled((prev) => !prev)
            useRecordCardStore.setState((s) => ({
              likesCount: s.likesCount + (isFilled ? -1 : 1),
              isLiked: !s.isLiked,
            }))
            try {
              await likeMut.trigger()
              await mutate()
            } catch (error) {
              console.error(error)
            }
          }}
          aria-label="좋아요"
          className={styles.like}
        >
          <svg
            width="22"
            height="20"
            viewBox="0 0 22 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 6.51615C1.00002 5.40335 1.33759 4.31674 1.96813 3.39982C2.59867 2.4829 3.49252 1.77881 4.53161 1.38055C5.5707 0.982294 6.70616 0.908598 7.78801 1.1692C8.86987 1.4298 9.84722 2.01243 10.591 2.84015C10.6434 2.89617 10.7067 2.94082 10.7771 2.97135C10.8474 3.00188 10.9233 3.01764 11 3.01764C11.0767 3.01764 11.1526 3.00188 11.2229 2.97135C11.2933 2.94082 11.3566 2.89617 11.409 2.84015C12.1504 2.00705 13.128 1.41952 14.2116 1.15575C15.2952 0.891989 16.4335 0.9645 17.4749 1.36364C18.5163 1.76277 19.4114 2.46961 20.0411 3.39006C20.6708 4.3105 21.0053 5.40091 21 6.51615C21 8.80615 19.5 10.5162 18 12.0162L12.508 17.3292C12.3217 17.5432 12.0919 17.7151 11.834 17.8335C11.5762 17.9518 11.296 18.014 11.0123 18.0158C10.7285 18.0176 10.4476 17.959 10.1883 17.8439C9.92893 17.7288 9.69703 17.5598 9.508 17.3482L4 12.0162C2.5 10.5162 1 8.81615 1 6.51615Z"
              stroke="#F6C944"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={isFilled ? "#F6C944" : "none"}
            />
          </svg>

          <span>{likesCount}</span>
        </button>

        <button type="button" aria-label="댓글">
          <Image
            src="/post/comment.svg"
            alt="댓글"
            width={20}
            height={19}
            role="none"
          />
          <span>{commentsCount}</span>
        </button>
        <button
          type="button"
          disabled={isReported}
          onClick={() => reportMut.trigger({ reason: "부적절한 내용" })}
          className={styles.reportButton}
          aria-label="신고하기"
        >
          <Image
            src="/post/report.svg"
            alt="신고하기"
            width={14}
            height={15}
            role="none"
          />
          <span>{isReported ? "신고됨" : "신고"}</span>
        </button>
      </div>
    </div>
  )
}
