# 선물 카탈로그 프로젝트

이 프로젝트는 [Next.js](https://nextjs.org)를 기반으로 한 선물 카탈로그 웹 애플리케이션입니다.

## 주요 기능

- 로그인 없이 카탈로그 생성 가능
- 카탈로그별 고유 ID와 비밀번호로 관리
- 선물 아이템 추가/수정/삭제
- 구매 완료 상태 업데이트 가능
- 카탈로그 공유 링크 생성

## 기술 스택

- [Next.js](https://nextjs.org) - React 프레임워크
- [Tailwind CSS](https://tailwindcss.com) - UI 스타일링
- [Supabase](https://supabase.com) - 데이터베이스 및 백엔드
- [React Hook Form](https://react-hook-form.com) - 폼 핸들링
- [TypeScript](https://www.typescriptlang.org) - 타입 안정성

## 시작하기

1. 환경 변수 설정하기

   - `.env.local.example` 파일을 `.env.local`로 복사하고 Supabase 프로젝트 정보를 입력하세요.

2. 개발 서버 실행하기:

```bash
pnpm dev
```

3. 브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 결과를 확인하세요.

## Supabase 설정

1. [Supabase](https://supabase.com)에 가입하고 새 프로젝트를 생성하세요.
2. 다음과 같은 테이블을 생성하세요:

```sql
create table catalogs (
  id uuid primary key,
  title text not null,
  description text,
  password text not null,
  gifts jsonb not null,
  createdAt timestamp with time zone not null default now()
);
```

3. 프로젝트 URL과 anon key를 `.env.local` 파일에 입력하세요.

## 배포하기

[Vercel](https://vercel.com)을 사용하여 쉽게 배포할 수 있습니다:

1. GitHub에 프로젝트를 푸시하세요.
2. Vercel에서 새 프로젝트를 생성하고 GitHub 저장소를 연결하세요.
3. 환경 변수를 Vercel 프로젝트 설정에 추가하세요.
4. 배포하세요!
