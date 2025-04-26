"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Success() {
  const searchParams = useSearchParams();
  const catalogId = searchParams.get("id");
  const [catalogLink, setCatalogLink] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (catalogId) {
      const baseUrl = window.location.origin;
      setCatalogLink(`${baseUrl}/catalog/${catalogId}`);
    }
  }, [catalogId]);

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(catalogLink)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  if (!catalogId) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-6">오류가 발생했습니다</h1>
        <p className="mb-6">카탈로그 ID를 찾을 수 없습니다.</p>
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-center">
      <div className="mb-8">
        <div className="inline-block bg-green-100 text-green-800 font-bold px-4 py-2 rounded-full mb-4">
          성공!
        </div>
        <h1 className="text-3xl font-bold mb-4">카탈로그가 생성되었습니다</h1>
        <p className="text-gray-600 mb-8">
          아래 링크를 통해 카탈로그를 공유할 수 있습니다.
        </p>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-8 flex items-center justify-between">
        <input
          type="text"
          value={catalogLink}
          readOnly
          className="bg-transparent flex-grow mr-2"
        />
        <button
          onClick={copyToClipboard}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          {copied ? "복사됨!" : "복사"}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href={`/catalog/${catalogId}`}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          카탈로그 보기
        </Link>
        <Link
          href="/"
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
