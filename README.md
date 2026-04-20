## ✨ 소개 
친구들과 함께 날짜별 테마에 맞춰 사진을 공유하며 추억을 만드는 어드벤트 캘린더 웹 애플리케이션

### 🎯 프로젝트 동기

- 크리스마스 어드벤트 캘린더에서 영감을 받아 크리스마스에 사용하기 위해 개발
- 친구와 특별한 기간 동안 매일 사진을 공유하며 추억 만들기
- 단순한 사진 공유를 넘어 테마에 맞는 사진을 고르며 재미있는 경험 제공

### 📅 기간

- [x]  개발: 2025.11.25 - 2025.12.01
- [x]  배포: 2025.12.01
- [ ]  알파테스트: 2025.12.01 - 2025.01.31
- [ ]  베타테스트: 2025.02.01 - 2026.02.28

### 👤 개발 인원

1인 (개인 프로젝트)

### 🔗 링크

- **배포 URL**: [https://advent-calendar-68497.web.app](https://advent-calendar-68497.web.app/)

---
## ✨ 주요 기능

### 인증 시스템

- Google 소셜 로그인
- Firebase Authentication 기반 안전한 인증
- 사용자 프로필 자동 동기화

### 프로젝트 관리

- **프로젝트 생성**
    - 기간 설정 (시작일/종료일 중 하나만 선택 시 자동 계산)
    - 테마 설정 (기본 테마)
- **프로젝트 목록**
    - 사용자가 멤버인 프로젝트만 보여짐
    - D-Day 카운트, 진행률 표시
    - 카드 형태 UI

### 이미지 관리

- **날짜별 이미지 업로드**
    - 오늘 또는 과거 날짜만 업로드 가능 (미래 날짜 잠금)
    - Firebase Storage 연동
- **이미지 뷰어**
    - 모달 형태로 구현
    - 여러 이미지 슬라이드 (화살표)
    - 업로드 정보 표시 (사용자, 날짜)
- **이미지 삭제**
    - 본인이 올린 이미지만 삭제 가능

### 협업 기능

- **프로젝트 초대**
    - 고유한 초대 링크 생성
    - 링크 복사
    - 초대 받은 사용자 자동 멤버 추가

---
## 🛠️기술 스택

### Frontend

- React 19 (TypeScript)
- React Router DOM v7
- Tailwind CSS v3.4.18
- shadcn/ui

### Backend & Infrastructure

- Firebase Authentication (Google)
- Firestore Database (NoSQL Database)
- Firebase Storage (이미지 저장)

### Development Tools

- Vite (빌드 도구)
- Git & GitHub (형상 관리)
- Firebase Hosting (배포)

### 해당 기술들 선택 이유
>사용을 위해 궁극적으로 짧은 기간에 배포 완료까지 필요한 프로젝트여서 빠르게 개발할 수 있는 기술을 선택

- **React + TypeScript**: 타입 안정성으로 에러 최소화
- **Firebase**: 짧은 기간 내 개발하기 위해 서버리스 개발이 가능한 백엔드 서비스 플랫폼 활용
- **Tailwind CSS**: 유틸리티 기반으로 빠른 스타일링, 반응형 디자인
- **Vite**: 최근 활발히 사용, 빠른 개발 서버, Hot Module Replacement

---
## 아키텍처 & 데이터 구조

### ⚙️ 전체 시스템 아키텍처

```mermaid
graph TD
    A[React + TypeScript Frontend] --> B[Firebase Backend]
    
    B --> C[Authentication<br/>로그인/회원가입]
    B --> D[Firestore<br/>데이터 저장]
    B --> E[Storage<br/>이미지 저장]
    
    style A fill:#61dafb
    style B fill:#ffca28
    style C fill:#fff3cd
    style D fill:#fff3cd
    style E fill:#fff3cd
    

```

### 📊 Firestore 데이터 구조

```tsx
📁 Firestore Database
│
├─ 📂 users/
│  └─ 📄 {uid}/
│     ├─ uid: string
│     ├─ email: string
│     ├─ displayName: string
│     ├─ photoURL: string
│     ├─ createdAt: timestamp
│     └─ updatedAt: timestamp
│
└─ 📂 projects/
   └─ 📄 {projectId}/
      ├─ title: string
      ├─ createdBy: string
      ├─ members: string[]
      ├─ startDate: timestamp
      ├─ endDate: timestamp
      ├─ totalDays: number
      ├─ createdAt: timestamp
      │
      ├─ 📂 days/
      │  └─ 📄 {dayNumber}/
      │     ├─ dayNumber: number
      │     ├─ theme: string
	  │     ├─ themeIndex: number
	  │		├─ isOpened: boolean //결국 사용하지 않는 field
      │     └─ date: timestamp
      │
      └─ 📂 images/
         └─ 📄 {imageId}/
            ├─ projectId: string
            ├─ dayNumber: number
            ├─ userId: string
            ├─ userName: string
            ├─ imageUrl: string
            ├─ storagePath: string
            └─ uploadedAt: timestamp
```

### 🗂️ 폴더 구조

```
src/
├── components/      # 재사용 가능한 UI 컴포넌트
│   ├── auth/       # 인증 관련
│   ├── layout/     # 레이아웃(헤더 등)
│   └── project/    # 프로젝트 관련
├── pages/          # 라우트 페이지
├── firebase/       # Firebase 로직 분리
├── hooks/          # Custom Hooks
├── constants/      # 변하지 않는 값(기본 테마)
└── types/          # TypeScript 타입 정의
```

---

## 트러블슈팅
- [Firebase Authentication 팝업 로그인 시 Cross-Origin-Opener-Policy(COOP) 오류](https://velog.io/@melcoding/%ED%8A%B8%EB%9F%AC%EB%B8%94%EC%8A%88%ED%8C%85-COOP)
- [Firebase Authentication 리다이렉트 로그인 시 로그인되지 않고 초기 화면으로 돌아가는 문제](https://velog.io/@melcoding/sign-in-redirect-problem)
- [개발 모드, 배포 모드 분기처리](https://velog.io/@melcoding/import.meta.env.MODE)
- [카카오톡 인앱 브라우저에서 구글 OAuth 로그인 차단 문제 해결](https://velog.io/@melcoding/kakaotalk-in-app-google-OAuth)
- [Firestore 프로젝트 삭제 시 관련 데이터 정리 누락 해결](https://velog.io/@melcoding/firestore-delete-project)
- [카카오톡 브라우저 감지 로직 위치로 인한 접근 차단 문제](https://velog.io/@melcoding/troubleshooting-kakao-browser-detect-location)
- [이미지 모달 높이 고정으로 긴 이미지 사용성 개선](https://velog.io/@melcoding/troubleshooting-image-modal-size)
---

## 추가 개발 예정 기능 사항
- [x] 주제 직접 입력 기능
- [x] 프로젝트 삭제 기능
- [x] 이미지 하단에 이미지 올린 사용자명 추가
- [ ] 이미지 올리기 선택한 위치에 표시
- [ ] 전체 진행 일자 사용자 설정 기능
- [ ] 프로젝트 멤버 관리 기능
- [ ] 내 정보 수정 기능
---

## 성과

- **사용자 피드백 기반의 점진적 개선:** 실제 사용자(친구)의 VOC를 수집하고 이를 분석하여, 1주일 단위의 빠른 배포 사이클을 통해 기능을 고도화하는 **애자일 운영 프로세스** 경험
- **체계적인 형상 관리 및 버전 전략:** 1인 프로젝트임에도 **Git Conventional Commits** 규격과 기능 단위 브랜치 전략을 엄격히 준수하여, 추후 협업이나 확장이 용이한 **투명한 히스토리 관리** 체계 구축
- **서버리스 기반 인프라 효율화:** Firebase를 활용한 서버리스 아키텍처를 설계하여, 인프라 관리 비용을 최소화하고 **프론트엔드 비즈니스 로직 최적화에 집중**할 수 있는 개발 환경 조성
- **타입 안정성 확보를 통한 품질 관리:** TypeScript를 전면 도입하여 컴포넌트 간 데이터 흐름을 규격화하고, **런타임 에러를 사전에 차단하는 안정적인 코드 베이스** 확보
---

## 배운 점

**1. 기술적 성장: 구조적 설계의 중요성**

- **데이터 모델링의 프로세스화:** NoSQL(Firestore) 환경에서 데이터 간의 관계를 구조화하며 **DB 설계 프로세스** 습득
- **컴포넌트 아키텍처 설계:** React 19와 TypeScript를 결합하여 재사용 가능하고 독립적인 컴포넌트 단위를 설계하며 **모듈화된 개발 프로세스** 이해

**2. 개발 프로세스: 선(先) 설계, 후(後) 구현의 중요성**

- **타입 중심의 개발 워크플로우:** 무작정 코드를 짜기보다 **타입을 먼저 정의**하고 인터페이스를 맞추는 과정이 전체 개발 속도와 정확도를 비약적으로 높인다는 것을 체감
- **문제 해결의 체계화:** 인앱 브라우저 인증 이슈 등 기술적 난제 발생 시, 임시방편이 아닌 근본 원인을 분석하고 이를 **기술 블로그에 문서화**하여 지식을 자산화하는 습관 형성

**3. UX 역량: 제약을 통한 사용자 가치 창출**

- **목적 중심의 기능 제한:** "오늘/과거 날짜만 업로드 가능"과 같은 의도적인 기능 제한 프로세스를 통해, 서비스 본연의 가치(어드벤트 캘린더의 설렘)를 유지하는 **UX를 고민하는** 역량 강화
