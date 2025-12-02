import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { uploadImage } from '@/firebase/image';
import { getUser } from '@/firebase/user';
import { UploadCloud } from 'lucide-react';

interface ImageUploadModalProps {
  projectId: string;
  dayNumber: number;
  dayTheme: string;
  totalDays: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const ImageUploadModal = ({
  projectId,
  dayNumber,
  dayTheme,
  totalDays,
  onClose,
  onSuccess,
}: ImageUploadModalProps) => {
  const { user } = useAuth();
  const [userName, setUserName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const loadUserName = async () => {
      if(!user) return;

      const userInfo = await getUser(user.uid)
      setUserName(userInfo?.displayName || user.email || '익명')
    }

    loadUserName();
  }, [user])

  // 파일 선택
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // 이미지 파일만 허용
    if (!selectedFile.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 제한 (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      alert('파일 크기는 10MB 이하여야 합니다.');
      return;
    }

    setFile(selectedFile);

    // 미리보기 생성
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  // 업로드
  const handleUpload = async () => {
    if (!file || !user) return;

    try {
      setUploading(true);
      setUploadProgress(0);

      // 진행률 시뮬레이션 (실제로는 Storage의 progress 이벤트 사용)
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await uploadImage(
        projectId,
        dayNumber,
        file,
        user.uid,
        userName
      );

      clearInterval(interval);
      setUploadProgress(100);

      console.log('✅ 업로드 완료!');
      
      // 성공 후 처리
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 500);
    } catch (error) {
      console.error('업로드 실패:', error);
      alert('업로드에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {/* 헤더 */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-slate-900">이미지 업로드</h2>
          <p className="text-sm text-slate-600 mt-1">
            D-{totalDays - dayNumber}: {dayTheme}
          </p>
        </div>

        {/* 파일 선택 */}
        {!preview ? (
          <div className="mb-4">
            <label className="block w-full">
              <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
                <UploadCloud className="w-12 h-12 mx-auto text-slate-400 mb-2"/>
                <p className="text-slate-600">클릭하여 이미지 선택</p>
                <p className="text-xs text-slate-400 mt-1">
                  JPG, PNG, GIF (최대 10MB)
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="mb-4">
            {/* 미리보기 */}
            <div className="relative">
              <img
                src={preview}
                alt="Preview"
                className="w-full rounded-lg"
              />
              <button
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              >
                <UploadCloud className="w-4 h-4"/>
              </button>
            </div>

            {/* 업로드 진행률 */}
            {uploading && (
              <div className="mt-4">
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-slate-600 mt-2 text-center">
                  업로드 중... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        )}

        {/* 버튼 */}
        <div className="flex gap-2">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1"
            disabled={uploading}
          >
            취소
          </Button>
          <Button
            onClick={handleUpload}
            className="flex-1"
            disabled={!file || uploading}
          >
            {uploading ? '업로드 중...' : '업로드'}
          </Button>
        </div>
      </div>
    </div>
  );
};