# next-themes 스크립트 콘솔 오류

개발 서버에서 모든 화면을 열 때 브라우저 콘솔에 "Encountered a script tag while rendering React component" 오류가 남는다(`/_next/mcp` `get_errors`, 스택은 `app/layout.tsx`의 `ThemeProvider`). `next-themes` 0.4.6이 테마 깜빡임 방지용 `<script>`를 React 19.3 컴포넌트 안에서 렌더링하기 때문으로 보인다. 저장한 글 작업 이전부터 있던 레이아웃 구성에서 나오며 화면 동작에는 영향이 없다. `next-themes` 업데이트나 React 19 대응 방식(예: 스크립트를 `<head>`에 직접 두기)을 확인해 오류가 사라지는지 검증한다.
