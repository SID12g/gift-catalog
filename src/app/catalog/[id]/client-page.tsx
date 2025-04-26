"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Catalog, Gift } from "@/types";

interface PurchaseModalProps {
  gift: Gift;
  onClose: () => void;
  onConfirm: (name: string) => void;
}

function PurchaseModal({ gift, onClose, onConfirm }: PurchaseModalProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onConfirm(name);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl animate-slideUp">
        <div className="flex items-center mb-4 text-indigo-600">
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <h3 className="text-xl font-bold">구매 완료 확인</h3>
        </div>

        <p className="mb-6 text-gray-700">
          <span className="font-medium text-gray-900">{gift.name}</span>을(를)
          구매 완료 처리하시겠습니까?
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              className="block text-gray-700 mb-2 font-medium"
              htmlFor="name"
            >
              이름
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
            >
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface PasswordModalProps {
  onSubmit: (password: string) => void;
  onClose: () => void;
  error?: string;
}

function PasswordModal({ onSubmit, onClose, error }: PasswordModalProps) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl animate-slideUp">
        <div className="flex items-center mb-4 text-indigo-600">
          <svg
            className="w-6 h-6 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h3 className="text-xl font-bold">비밀번호 확인</h3>
        </div>

        <p className="mb-6 text-gray-700">
          이 카탈로그를 편집하려면 비밀번호를 입력하세요.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              className="block text-gray-700 mb-2 font-medium"
              htmlFor="password"
            >
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              required
            />
            {error && <p className="text-red-500 mt-2 text-sm">{error}</p>}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium"
            >
              확인
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ClientCatalogPageProps {
  catalog: Catalog;
}

export default function ClientCatalogPage({ catalog }: ClientCatalogPageProps) {
  const router = useRouter();
  const [currentCatalog, setCurrentCatalog] = useState<Catalog>(catalog);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const catalogIdRef = useRef<HTMLDivElement>(null);

  const handlePurchase = (gift: Gift) => {
    setSelectedGift(gift);
    setShowPurchaseModal(true);
  };

  const handleEdit = () => {
    setShowPasswordModal(true);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentCatalog.id);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("클립보드 복사 실패:", err);
    }
  };

  const confirmPurchase = async (name: string) => {
    if (!selectedGift) return;

    try {
      const updatedGifts = currentCatalog.gifts.map((gift) =>
        gift.id === selectedGift.id
          ? { ...gift, purchased: true, purchasedBy: name }
          : gift
      );

      const { error } = await supabase
        .from("catalogs")
        .update({ gifts: updatedGifts })
        .eq("id", currentCatalog.id);

      if (error) throw error;

      setCurrentCatalog({
        ...currentCatalog,
        gifts: updatedGifts,
      });

      setShowPurchaseModal(false);
      setSelectedGift(null);
    } catch (error) {
      console.error("Error updating gift:", error);
      alert("구매 상태 업데이트 중 오류가 발생했습니다.");
    }
  };

  const checkPassword = async (password: string) => {
    if (password === currentCatalog.password) {
      setShowPasswordModal(false);
      setPasswordError("");
      router.push(
        `/edit/${currentCatalog.id}?password=${encodeURIComponent(password)}`
      );
    } else {
      setPasswordError("비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8 shadow-sm">
        <Link
          href="/"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 transition-colors mb-4"
        >
          <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          홈으로 돌아가기
        </Link>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 gap-4">
          <h1 className="text-3xl font-bold text-gray-800">
            {currentCatalog.title}
          </h1>
          <button
            onClick={handleEdit}
            className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-medium py-2 px-4 rounded-full transition-colors shadow-sm flex items-center"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            수정하기
          </button>
        </div>

        {currentCatalog.description && (
          <p className="text-gray-600 mb-4">{currentCatalog.description}</p>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            생성일:{" "}
            {new Date(currentCatalog.createdAt).toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}
          </div>

          <div className="flex items-center">
            <div className="text-sm text-gray-500 mr-2">카탈로그 ID:</div>
            <div
              ref={catalogIdRef}
              className="text-sm font-mono bg-gray-100 py-1 px-2 rounded truncate max-w-[120px] md:max-w-[180px]"
            >
              {currentCatalog.id}
            </div>
            <button
              onClick={copyToClipboard}
              className="ml-2 text-indigo-600 hover:text-indigo-800 transition-colors"
              title="ID 복사"
            >
              {copySuccess ? (
                <svg
                  className="w-5 h-5 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-4">
          <h2 className="text-xl font-semibold text-white">선물 목록</h2>
        </div>

        {currentCatalog.gifts.length === 0 ? (
          <div className="p-6 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 12H4M12 20V4"
              />
            </svg>
            <p className="text-gray-500 italic">아직 추가된 선물이 없습니다.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {currentCatalog.gifts.map((gift) => (
              <div
                key={gift.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="font-medium text-lg text-gray-800">
                      {gift.name}
                    </h3>
                    <p className="text-gray-600">
                      {gift.price.toLocaleString()}원 • 수량: {gift.quantity}개
                    </p>
                    {gift.purchased && (
                      <p className="text-green-600 text-sm mt-1 flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="font-medium">{gift.purchasedBy}</span>
                        님이 구매 완료
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 self-end md:self-auto">
                    <a
                      href={gift.purchaseLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-full transition-colors shadow-sm flex items-center"
                    >
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      구매 링크
                    </a>

                    {!gift.purchased && (
                      <button
                        onClick={() => handlePurchase(gift)}
                        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-full transition-colors shadow-sm flex items-center"
                      >
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        구매 완료
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showPurchaseModal && selectedGift && (
        <PurchaseModal
          gift={selectedGift}
          onClose={() => {
            setShowPurchaseModal(false);
            setSelectedGift(null);
          }}
          onConfirm={confirmPurchase}
        />
      )}

      {showPasswordModal && (
        <PasswordModal
          onSubmit={checkPassword}
          onClose={() => {
            setShowPasswordModal(false);
            setPasswordError("");
          }}
          error={passwordError}
        />
      )}
    </div>
  );
}
