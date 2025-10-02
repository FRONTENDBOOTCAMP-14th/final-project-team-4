interface BaseReport {
  id: string
  reporter_id: string
  report_reason: string
}

interface ChallengeReport extends BaseReport {
  challenge_id: string
}

interface RecordReport extends BaseReport {
  record_id: string
}

interface RecordCommentReport extends BaseReport {
  record_comment_id: string
}

type Report = ChallengeReport | RecordReport | RecordCommentReport

export default Report
