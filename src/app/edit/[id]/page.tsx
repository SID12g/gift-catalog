"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";
import { Catalog, Gift } from "@/types";

interface GiftFormData {
  giftName: string;
  giftPrice: string;
  giftQuantity: string;
  giftPurchaseLink: string;
}

interface CatalogFormData {
  catalogTitle: string;
  catalogDescription?: string;
}

export default function EditCatalog() {
  const params = useParams();
  const catalogId = params.id as string;
  const router = useRouter();
  const searchParams = useSearchParams();
  const password = searchParams.get("password");

  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const {
    register: catalogRegister,
    handleSubmit: catalogHandleSubmit,
    formState: { errors: catalogErrors },
    setValue: catalogSetValue,
  } = useForm<CatalogFormData>();

  const {
    register: giftRegister,
    handleSubmit: giftHandleSubmit,
    formState: { errors: giftErrors },
    reset: giftReset,
  } = useForm<GiftFormData>({
    defaultValues: {
      giftQuantity: "1",
    },
  });

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const { data, error } = await supabase
          .from("catalogs")
          .select("*")
          .eq("id", catalogId)
          .single();

        if (error) throw error;

        if (!data) {
          setError("카탈로그를 찾을 수 없습니다.");
          return;
        }

        const catalogData = data as Catalog;

        if (!password || catalogData.password !== password) {
          router.push(`/catalog/${catalogId}`);
          return;
        }

        setCatalog(catalogData);
        setGifts(catalogData.gifts);

        // 폼 초기값 설정
        catalogSetValue("catalogTitle", catalogData.title);
        catalogSetValue("catalogDescription", catalogData.description || "");
      } catch (error) {
        console.error("Error fetching catalog:", error);
        setError("카탈로그를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [catalogId, password, router, catalogSetValue]);

  const addGift: SubmitHandler<GiftFormData> = (data) => {
    const newGift: Gift = {
      id: uuidv4(),
      name: data.giftName,
      price: Number(data.giftPrice),
      quantity: Number(data.giftQuantity),
      purchaseLink: data.giftPurchaseLink,
      purchased: false,
    };

    setGifts([...gifts, newGift]);
    giftReset({
      giftName: "",
      giftPrice: "",
      giftQuantity: "1",
      giftPurchaseLink: "",
    });
  };

  const removeGift = (id: string) => {
    setGifts(gifts.filter((gift) => gift.id !== id));
  };

  const updateCatalog: SubmitHandler<CatalogFormData> = async (data) => {
    if (!catalog) return;

    if (gifts.length === 0) {
      alert("최소 1개 이상의 선물을 추가해주세요.");
      return;
    }

    setSaving(true);

    try {
      const updatedCatalog = {
        ...catalog,
        title: data.catalogTitle,
        description: data.catalogDescription,
        gifts,
      };

      const { error } = await supabase
        .from("catalogs")
        .update(updatedCatalog)
        .eq("id", catalog.id);

      if (error) throw error;

      router.push(`/catalog/${catalog.id}`);
    } catch (error) {
      console.error("Error updating catalog:", error);
      alert("카탈로그 수정 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4 w-1/3 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded mb-6 w-1/4 mx-auto"></div>

          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <div className="h-6 bg-gray-200 rounded mb-4 w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
            <div className="h-10 bg-gray-200 rounded mb-4"></div>
          </div>
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        href={`/catalog/${catalog.id}`}
        className="inline-block mb-6 text-blue-600 hover:underline"
      >
        &larr; 카탈로그로 돌아가기
      </Link>

      <h1 className="text-3xl font-bold mb-6">카탈로그 수정하기</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">카탈로그 정보</h2>

        <form onSubmit={catalogHandleSubmit(updateCatalog)}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="catalogTitle">
              카탈로그 제목 *
            </label>
            <input
              id="catalogTitle"
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              {...catalogRegister("catalogTitle", { required: true })}
            />
            {catalogErrors.catalogTitle && (
              <p className="text-red-500 mt-1">제목을 입력해주세요.</p>
            )}
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 mb-2"
              htmlFor="catalogDescription"
            >
              카탈로그 설명 (선택사항)
            </label>
            <textarea
              id="catalogDescription"
              className="w-full p-2 border border-gray-300 rounded"
              {...catalogRegister("catalogDescription")}
            />
          </div>
        </form>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">선물 관리</h2>

        <form onSubmit={giftHandleSubmit(addGift)} className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 mb-2" htmlFor="giftName">
                선물 이름 *
              </label>
              <input
                id="giftName"
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                {...giftRegister("giftName", {
                  required: "선물 이름을 입력해주세요",
                })}
              />
              {giftErrors.giftName && (
                <p className="text-red-500 mt-1">
                  {giftErrors.giftName.message?.toString()}
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2" htmlFor="giftPrice">
                가격 *
              </label>
              <input
                id="giftPrice"
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                {...giftRegister("giftPrice", {
                  required: "가격을 입력해주세요",
                  min: { value: 0, message: "0 이상의 값을 입력해주세요" },
                })}
              />
              {giftErrors.giftPrice && (
                <p className="text-red-500 mt-1">
                  {giftErrors.giftPrice.message?.toString()}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 mb-2"
                htmlFor="giftQuantity"
              >
                수량 *
              </label>
              <input
                id="giftQuantity"
                type="number"
                className="w-full p-2 border border-gray-300 rounded"
                {...giftRegister("giftQuantity", {
                  required: "수량을 입력해주세요",
                  min: { value: 1, message: "1 이상의 값을 입력해주세요" },
                })}
              />
              {giftErrors.giftQuantity && (
                <p className="text-red-500 mt-1">
                  {giftErrors.giftQuantity.message?.toString()}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 mb-2"
                htmlFor="giftPurchaseLink"
              >
                구매 링크 *
              </label>
              <input
                id="giftPurchaseLink"
                type="text"
                className="w-full p-2 border border-gray-300 rounded"
                {...giftRegister("giftPurchaseLink", {
                  required: "구매 링크를 입력해주세요",
                  pattern: {
                    value:
                      /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/,
                    message: "올바른 URL을 입력해주세요",
                  },
                })}
              />
              {giftErrors.giftPurchaseLink && (
                <p className="text-red-500 mt-1">
                  {giftErrors.giftPurchaseLink.message?.toString()}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            선물 추가
          </button>
        </form>

        <div>
          <h3 className="text-lg font-semibold mb-3">선물 목록</h3>

          {gifts.length > 0 ? (
            <div className="bg-gray-100 rounded-lg p-4">
              {gifts.map((gift) => (
                <div
                  key={gift.id}
                  className="flex items-center justify-between border-b border-gray-300 py-2 last:border-b-0"
                >
                  <div>
                    <p className="font-medium">{gift.name}</p>
                    <p className="text-sm text-gray-600">
                      {gift.price.toLocaleString()}원 • {gift.quantity}개
                    </p>
                    {gift.purchased && (
                      <p className="text-green-600 text-sm">
                        <span className="font-medium">{gift.purchasedBy}</span>
                        님이 구매 완료
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeGift(gift.id)}
                    className="text-red-600 hover:text-red-800"
                    aria-label="삭제"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">아직 추가된 선물이 없습니다.</p>
          )}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={catalogHandleSubmit(updateCatalog)}
          disabled={saving || gifts.length === 0}
          className={`
            bg-blue-600 text-white font-bold py-3 px-8 rounded-lg
            ${
              saving || gifts.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }
          `}
        >
          {saving ? "저장 중..." : "변경사항 저장하기"}
        </button>
      </div>
    </div>
  );
}
