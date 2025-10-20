"use client"
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
  const { data, error, isLoading, mutate } = useRecordCard(recordId, userId)

  const { likeMut, reportMut } = useRecordActions(recordId, userId)

  const { isLiked, likesCount, commentsCount, isReported } =
    useRecordCardStore()

  if (error) return <p>데이터를 불러올 수 없습니다 😢</p>
  if (isLoading || !data) return <p>불러오는 중…</p>

  const dayLabel = data.participant?.streak_days
    ? `${data.participant.streak_days}일차`
    : ""

  return (
    <div className={styles.container} aria-busy={isLoading}>
      <div className={styles.header}>
        <Avatar
          imageUrl={data.user?.avatar_url ?? ""}
          altText={data.user?.nickname ?? "user avatar"}
          responsive="profileSizes"
        />
        <div className={styles.meta}>
          <strong>{data.user?.nickname ?? "익명"}</strong>
          <span>{dayLabel}</span>
          <span>n시간 전</span>
        </div>
      </div>

      <figure className={styles.figure}>
        <Image
          src={data.image_url}
          alt=""
          width={720}
          height={480}
          className={styles.image}
        />
        <figcaption className={styles.caption}>{data.content}</figcaption>
      </figure>

      <div className={styles.actions}>
        <button
          type="button"
          aria-pressed={isLiked}
          onClick={() => likeMut.trigger().then(() => mutate())}
          className={styles.action}
          aria-label="좋아요"
        >
          <Image
            src={isLiked ? "/post/liked-fill.svg" : "/post/like.svg"}
            alt=""
            width={20}
            height={18}
          />
          <span>{likesCount}</span>
        </button>

        <button type="button" className={styles.action} aria-label="댓글">
          <Image src="/post/comment.svg" alt="" width={20} height={19} />
          <span>{commentsCount}</span>
        </button>
        <button
          type="button"
          disabled={isReported}
          onClick={() => reportMut.trigger({ reason: "부적절한 내용" })}
          className={styles.action}
          aria-label="신고하기"
        >
          <Image src="/post/report.svg" alt="" width={14} height={15} />
          <span>{isReported ? "신고됨" : "신고"}</span>
        </button>
      </div>
    </div>
  )
}
