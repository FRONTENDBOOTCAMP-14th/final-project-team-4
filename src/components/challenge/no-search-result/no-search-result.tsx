import styles from "./no-search-result.module.css"

interface NoSearchResultProps {
  keyword?: string
}

export default function NoSearchResult({ keyword }: NoSearchResultProps) {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.title}>
          {keyword ? `"${keyword}"에` : ""} 대한 검색 결과가 없어요!
        </h2>
        <p className={styles.description}>다른 키워드로 다시 검색해보세요.</p>
      </div>
    </div>
  )
}
