# 저장한 글 목록의 호스트명 처리 중복

`app/saved/page.tsx`의 `hostOf`가 `features/url-to-markdown/document.ts`의 `displayTitle` 안에 있는 URL→호스트명 폴백과 같은 일을 한다(코드 리뷰 low 지적). 동작 문제는 없지만 한쪽만 바뀌면 목록의 호스트 표기와 제목 폴백이 달라질 수 있다. 호스트명 추출을 `document.ts`의 공개 함수 하나로 모으고 두 곳이 그것을 쓰게 한다.
