"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/lib/supabase";
import { Gift } from "@/types";

interface GiftFormData {
  giftName: string;
  giftPrice: string;
  giftQuantity: string;
  giftPurchaseLink: string;
}

export default function CreateCatalog() {
  const router = useRouter();
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(false);
  const [catalogData, setCatalogData] = useState({
    catalogTitle: "",
    catalogDescription: "",
    catalogPassword: "",
  });

  const {
    register: giftRegister,
    handleSubmit: giftHandleSubmit,
    formState: { errors: giftErrors },
    reset: giftReset,
  } = useForm<GiftFormData>();

  const handleCatalogDataChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCatalogData({
      ...catalogData,
      [name]: value,
    });
  };

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

  const createCatalog = async () => {
    if (gifts.length === 0) {
      alert("최소 1개 이상의 선물을 추가해주세요.");
      return;
    }

    // 카탈로그 정보 유효성 검사
    if (!catalogData.catalogTitle) {
      alert("카탈로그 제목을 입력해주세요.");
      return;
    }

    if (
      !catalogData.catalogPassword ||
      catalogData.catalogPassword.length < 4
    ) {
      alert("비밀번호는 최소 4자 이상이어야 합니다.");
      return;
    }

    setLoading(true);

    const catalogId = uuidv4();
    const catalog = {
      id: catalogId,
      title: catalogData.catalogTitle,
      description: catalogData.catalogDescription,
      password: catalogData.catalogPassword,
      gifts,
    };

    try {
      const { error } = await supabase.from("catalogs").insert([catalog]);

      if (error) throw error;

      router.push(`/success?id=${catalogId}`);
    } catch (error) {
      console.error("Error creating catalog:", error);
      alert("카탈로그 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Link
        href="/"
        className="inline-block mb-6 text-blue-600 hover:underline"
      >
        &larr; 홈으로 돌아가기
      </Link>

      <h1 className="text-3xl font-bold mb-6">새 카탈로그 만들기</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">카탈로그 정보</h2>

        <div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="catalogTitle">
              카탈로그 제목 *
            </label>
            <input
              id="catalogTitle"
              name="catalogTitle"
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={catalogData.catalogTitle}
              onChange={handleCatalogDataChange}
            />
            {!catalogData.catalogTitle && (
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
              name="catalogDescription"
              className="w-full p-2 border border-gray-300 rounded"
              value={catalogData.catalogDescription}
              onChange={handleCatalogDataChange}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 mb-2"
              htmlFor="catalogPassword"
            >
              비밀번호 *
            </label>
            <input
              id="catalogPassword"
              name="catalogPassword"
              type="password"
              className="w-full p-2 border border-gray-300 rounded"
              value={catalogData.catalogPassword}
              onChange={handleCatalogDataChange}
            />
            {!catalogData.catalogPassword && (
              <p className="text-red-500 mt-1">비밀번호를 입력해주세요.</p>
            )}
            {catalogData.catalogPassword &&
              catalogData.catalogPassword.length < 4 && (
                <p className="text-red-500 mt-1">
                  비밀번호는 최소 4자 이상이어야 합니다.
                </p>
              )}
            <p className="text-sm text-gray-500 mt-1">
              이 비밀번호는 카탈로그를 수정할 때 필요합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">선물 추가하기</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            giftHandleSubmit(addGift)(e);
          }}
          className="mb-6"
        >
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
                defaultValue="1"
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

        {gifts.length > 0 ? (
          <div>
            <h3 className="text-lg font-semibold mb-3">추가된 선물 목록</h3>
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
          </div>
        ) : (
          <p className="text-gray-500 italic">아직 추가된 선물이 없습니다.</p>
        )}
      </div>

      <div className="text-center">
        <button
          onClick={createCatalog}
          disabled={loading || gifts.length === 0}
          className={`
            bg-blue-600 text-white font-bold py-3 px-8 rounded-lg
            ${
              loading || gifts.length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-blue-700"
            }
          `}
        >
          {loading ? "생성 중..." : "카탈로그 생성하기"}
        </button>
      </div>
    </div>
  );
}
