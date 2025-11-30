import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface InviteModalProps {
  projectId: string;
  onClose: () => void;
}

export const InviteModal = ({ projectId, onClose }: InviteModalProps) => {
  const [copied, setCopied] = useState(false);
  
  // 초대 링크 생성
  const inviteUrl = `${window.location.origin}/join/${projectId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
      alert('링크 복사에 실패했습니다.');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg max-w-md w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            친구 초대하기
          </h2>
          <p className="text-slate-600">
            아래 링크를 공유하여 친구를 초대하세요!
          </p>
        </div>

        {/* 초대 링크 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-700 mb-2">
            초대 링크
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inviteUrl}
              readOnly
              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-700 text-sm"
              onClick={(e) => e.currentTarget.select()}
            />
            <Button
              onClick={handleCopy}
              className={copied ? 'bg-green-600 hover:bg-green-700' : ''}
            >
              {copied ? '✓ 복사됨' : '복사'}
            </Button>
          </div>
        </div>

        {/* 공유 방법 안내 */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">
            💡 공유 방법
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• 카카오톡, 메신저 등으로 링크 전송</li>
            <li>• SNS에 공유</li>
          </ul>
        </div>

        {/* 닫기 버튼 */}
        <Button
          onClick={onClose}
          variant="outline"
          className="w-full"
        >
          닫기
        </Button>
      </div>
    </div>
  );
};