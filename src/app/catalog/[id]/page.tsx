import React from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Catalog, Gift } from "@/types";
import ClientCatalogPage from "./client-page";

// 서버 컴포넌트
export default async function CatalogPage({
  params,
}: {
  params: { id: string };
}) {
  // 서버 컴포넌트에서 데이터 가져오기
  const catalogId = params.id;

  try {
    const { data, error } = await supabase
      .from("catalogs")
      .select("*")
      .eq("id", catalogId)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      return (
        <div className="max-w-4xl mx-auto p-6 text-center">
          <h1 className="text-3xl font-bold mb-6">오류가 발생했습니다</h1>
          <p className="mb-6">카탈로그를 찾을 수 없습니다.</p>
          <Link
            href="/"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            홈으로 돌아가기
          </Link>
        </div>
      );
    }

    // 카탈로그 데이터 형식 변환
    const catalogData = data as any;
    const formattedCatalog: Catalog = {
      id: catalogData.id,
      title: catalogData.title,
      description: catalogData.description,
      password: catalogData.password,
      gifts: catalogData.gifts,
      createdAt: catalogData.created_at || new Date().toISOString(),
    };

    // 클라이언트 컴포넌트로 데이터 전달
    return <ClientCatalogPage catalog={formattedCatalog} />;
  } catch (error) {
    console.error("Error fetching catalog:", error);

    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-6">오류가 발생했습니다</h1>
        <p className="mb-6">카탈로그를 불러오는 중 오류가 발생했습니다.</p>
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }
}
