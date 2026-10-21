# 1-4 알림장

학급 알림장을 작성할 때 쓰는 간단한 할일 스케줄러입니다. 할일을 등록하면 날짜별로 자동 정리되고, 마감일이 있는 할일은 마감일 전날까지 매일 표시됩니다. 정리된 내용은 버튼 한 번으로 복사해 알림장에 바로 붙여넣을 수 있습니다.

## 주요 기능

- 날짜별 할일 자동 정리 (`9/15(화)` 형식)
- 마감일까지 자동 반복 표시 (`시작일 ≤ 표시 날짜 < 마감일`)
- 마감일이 없는 단발성 할일 지원 (시작일에만 표시)
- 할일 수정 / 삭제 (수정·삭제 시 모든 날짜에 즉시 반영)
- 날짜별 복사 / 전체 복사 (번호·줄바꿈 포함, 클립보드 복사)
- Firebase Firestore 실시간 저장 (기기·브라우저 간 데이터 동기화)
- 반응형 UI (모바일 / PC)
- 다크모드 (시스템 설정 자동 감지 + 수동 전환)
- 매일 밤 11시(KST) 푸시 알림 (브라우저 알림 허용 시, 안드로이드/PC는 앱을 꺼둬도 수신. iOS는 "홈 화면에 추가" 설치 필요)

완료 체크 기능, 로그인/회원가입, 복잡한 데이터베이스 UI는 이 앱의 목적(알림장 내용 관리)과 맞지 않아 의도적으로 제외했습니다.

## 기술 스택

- React + TypeScript
- Vite
- Tailwind CSS
- Firebase Firestore

## 실행 방법

```bash
npm install
npm run dev
```

빌드:

```bash
npm run build
```

## Firebase 설정

### 1. Firebase 프로젝트 만들기

1. [Firebase Console](https://console.firebase.google.com/)에 접속해 로그인합니다.
2. **프로젝트 추가**를 눌러 새 프로젝트를 생성합니다.
3. 프로젝트가 생성되면 프로젝트 개요 화면에서 **</> (웹)** 아이콘을 눌러 웹 앱을 추가합니다.
4. 앱 닉네임을 입력하고 앱을 등록하면, `firebaseConfig` 값(apiKey, authDomain, projectId 등)이 표시됩니다. 이 값을 복사해둡니다.

### 2. 환경변수 설정

프로젝트 루트에 `.env.example`을 복사해 `.env` 파일을 만들고, 위에서 확인한 값을 채워 넣습니다.

```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=여기에_입력
VITE_FIREBASE_AUTH_DOMAIN=여기에_입력
VITE_FIREBASE_PROJECT_ID=여기에_입력
VITE_FIREBASE_STORAGE_BUCKET=여기에_입력
VITE_FIREBASE_MESSAGING_SENDER_ID=여기에_입력
VITE_FIREBASE_APP_ID=여기에_입력
```

`.env` 파일은 `.gitignore`에 포함되어 있어 GitHub에 올라가지 않습니다.

### 3. Firestore Database 활성화

1. Firebase 콘솔 왼쪽 메뉴에서 **빌드 → Firestore Database**로 이동합니다.
2. **데이터베이스 만들기**를 클릭합니다.
3. 위치(리전)를 선택하고, 보안 규칙은 우선 **테스트 모드**로 시작해도 되지만, 실제 사용 전에는 아래 4단계의 규칙을 반드시 적용하세요.

### 4. Firestore 보안 규칙 적용

이 프로젝트는 로그인 기능이 없으므로, 최소한 아래 규칙으로 무제한 쓰기를 막고 데이터 형태를 검증합니다. 루트의 [`firestore.rules`](firestore.rules) 파일 내용을 Firebase 콘솔의 **Firestore Database → 규칙** 탭에 붙여넣고 **게시**합니다.

> 로그인 기능이 없는 특성상 완전한 접근 제어는 어렵습니다. 실제 반 친구들 외에는 URL을 공유하지 않는 것을 권장합니다.

## 매일 밤 11시 알림(푸시 알림) 설정

이 기능은 선택사항입니다. 설정하지 않아도 나머지 기능은 모두 정상 동작합니다.

### 동작 방식

- 사용자가 화면 상단 **"🔔 알림 켜기"** 버튼을 누르고 알림을 허용하면, 그 기기가 등록됩니다.
- 매일 밤 11시(KST)에 **GitHub Actions**가 자동으로 실행되어, 등록된 모든 기기에 알림을 보냅니다. (Firebase 요금제 변경이나 별도 서버 없이, 저장소에 이미 있는 GitHub Actions만으로 동작합니다.)
- 안드로이드/PC는 "허용" 한 번이면 끝이고, 앱을 꺼둬도 알림이 옵니다. **아이폰(iOS)은 사파리에서 "공유 → 홈 화면에 추가"로 설치해야** 백그라운드에서 알림을 받을 수 있습니다 (Apple의 제약이라 우회할 수 없습니다).

### 1. VAPID 키 발급 (웹 푸시용)

1. Firebase 콘솔 → 프로젝트 설정(⚙️) → **클라우드 메시징** 탭으로 이동합니다.
2. "웹 구성" 섹션의 **키 쌍 생성**을 누릅니다.
3. 생성된 키 문자열을 복사해 `.env`의 `VITE_FIREBASE_VAPID_KEY`에 넣습니다.

### 2. 서비스 계정 키 발급 (서버에서 알림을 보내기 위한 키)

1. Firebase 콘솔 → 프로젝트 설정(⚙️) → **서비스 계정** 탭으로 이동합니다.
2. **새 비공개 키 생성**을 눌러 JSON 파일을 다운로드합니다.
3. GitHub 저장소의 **Settings → Secrets and variables → Actions**에서 `FIREBASE_SERVICE_ACCOUNT_KEY`라는 이름의 Repository secret을 만들고, 다운로드한 JSON 파일의 **전체 내용**을 그대로 붙여넣습니다.

> 이 JSON 파일은 Firestore 데이터에 전체 접근 권한을 가진 민감한 키입니다. GitHub Secret 외의 곳에는 저장하거나 공유하지 마세요.

### 3. 배포용 Secret 추가

**Settings → Secrets and variables → Actions**에 아래 1개를 추가로 등록합니다 (기존 6개 Firebase 값에 더해서).

- `VITE_FIREBASE_VAPID_KEY`

설정이 끝나면 `main` 브랜치에 다시 푸시하거나 Actions 탭에서 **Send daily alarm** 워크플로를 수동 실행(`workflow_dispatch`)해서 테스트해볼 수 있습니다.

## GitHub 업로드

```bash
git init
git add .
git commit -m "Initial commit"
```

이후 GitHub에서 새 저장소를 만든 뒤 아래 명령으로 연결합니다.

```bash
git remote add origin https://github.com/<사용자명>/<저장소명>.git
git branch -M main
git push -u origin main
```

## GitHub Pages 배포

이 저장소에는 `main` 브랜치에 푸시하면 자동으로 GitHub Pages에 배포하는 GitHub Actions 워크플로(`.github/workflows/deploy.yml`)가 포함되어 있습니다.

1. GitHub 저장소의 **Settings → Pages**에서 Source를 **GitHub Actions**로 설정합니다.
2. **Settings → Secrets and variables → Actions**에서 `.env`에 넣었던 값들을 동일한 이름(`VITE_FIREBASE_API_KEY` 등, 알림 기능을 쓴다면 `VITE_FIREBASE_VAPID_KEY`까지)의 **Repository secret**으로 등록합니다. (빌드 시점에 주입되어야 하므로 필수입니다.)
3. `main` 브랜치에 푸시하면 자동으로 빌드 및 배포되며, Pages URL은 **Settings → Pages**에서 확인할 수 있습니다.

수동으로 배포하고 싶다면 `npm run build`로 생성된 `dist` 폴더를 원하는 정적 호스팅에 올려도 됩니다. Firestore는 클라이언트에서 직접 호출하므로 별도의 백엔드 서버 없이도 동작합니다.

## 프로젝트 구조

```
src/
  components/   UI 컴포넌트 (Header, DayListView, CalendarView, DateBlock, TodoFormModal, ConfirmDialog, Toast)
  hooks/        useTodos(Firestore CRUD), useDarkMode, usePushNotifications
  utils/        날짜 계산, 날짜별/과목별 그룹화, 클립보드 복사
  firebase.ts   Firebase 초기화
  types.ts      Todo 타입 정의
scripts/
  generate-sw.mjs        빌드 시 public/firebase-messaging-sw.js 생성
  send-daily-alarm.mjs   매일 밤 11시 알림 발송 (GitHub Actions에서 실행)
.github/workflows/
  deploy.yml        GitHub Pages 배포
  daily-alarm.yml   매일 밤 11시(KST) 알림 발송 예약 실행
firestore.rules  Firestore 보안 규칙
```
