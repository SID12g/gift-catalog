"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Catalog } from "@/types";
import ClientCatalogPage from "./client-page";
import { useParams } from "next/navigation";

export default function CatalogPage() {
  const params = useParams();
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const catalogId = params.id as string;

        const { data, error } = await supabase
          .from("catalogs")
          .select("*")
          .eq("id", catalogId)
          .single();

        if (error) {
          throw error;
        }

        if (!data) {
          setError("카탈로그를 찾을 수 없습니다.");
          return;
        }

        // 카탈로그 데이터 형식 변환
        const catalogData = data as {
          id: string;
          title: string;
          description?: string;
          password: string;
          gifts: Catalog["gifts"];
          created_at?: string;
        };

        const formattedCatalog: Catalog = {
          id: catalogData.id,
          title: catalogData.title,
          description: catalogData.description,
          password: catalogData.password,
          gifts: catalogData.gifts,
          createdAt: catalogData.created_at || new Date().toISOString(),
        };

        setCatalog(formattedCatalog);
      } catch (error) {
        console.error("Error fetching catalog:", error);
        setError("카탈로그를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [params.id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-1/3 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded mb-6 w-1/4 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error || !catalog) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-6">오류가 발생했습니다</h1>
        <p className="mb-6">{error || "카탈로그를 찾을 수 없습니다."}</p>
        <Link
          href="/"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return <ClientCatalogPage catalog={catalog} />;
}
