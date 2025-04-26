import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl font-bold mb-6">선물 카탈로그</h1>
        <p className="text-lg mb-12">
          나만의 선물 카탈로그를 만들고 공유하세요
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/create"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            카탈로그 만들기
          </Link>
          <Link
            href="/view"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
          >
            카탈로그 조회하기
          </Link>
        </div>
      </div>
    </div>
  );
}
