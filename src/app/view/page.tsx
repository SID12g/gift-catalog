"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ViewCatalog() {
  const router = useRouter();
  const [catalogId, setCatalogId] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!catalogId) {
      setError("카탈로그 ID를 입력해주세요.");
      return;
    }

    router.push(`/catalog/${catalogId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        href="/"
        className="inline-block mb-6 text-blue-600 hover:underline"
      >
        &larr; 홈으로 돌아가기
      </Link>

      <h1 className="text-3xl font-bold mb-6">카탈로그 조회하기</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="catalogId">
              카탈로그 ID
            </label>
            <input
              id="catalogId"
              type="text"
              value={catalogId}
              onChange={(e) => setCatalogId(e.target.value)}
              placeholder="카탈로그 ID를 입력하세요"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
            {error && <p className="text-red-500 mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            카탈로그 보기
          </button>
        </form>
      </div>

      <div className="bg-gray-100 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">도움말</h2>
        <p className="mb-4">
          카탈로그 ID는 카탈로그를 만든 사람으로부터 받은 링크에서 확인할 수
          있습니다.
        </p>
        <p>
          링크 형식:{" "}
          <code className="bg-gray-200 px-2 py-1 rounded">
            https://yoursite.com/catalog/[카탈로그ID]
          </code>
        </p>
      </div>
    </div>
  );
}
