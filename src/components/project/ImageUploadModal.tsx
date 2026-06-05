import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { getUser } from '@/firebase/user';
import { UploadCloud } from 'lucide-react';
import { useUploadImage } from '@/hooks/mutations/useUploadImage';
import { toast } from 'sonner';

interface ImageUploadModalProps {
  projectId: string;
  dayNumber: number;
  dayTheme: string;
  totalDays: number;
  onClose: () => void;
}

export const ImageUploadModal = ({
  projectId,
  dayNumber,
  dayTheme,
  totalDays,
  onClose,
}: ImageUploadModalProps) => {
  const { user } = useAuth();
  const [userName, setUserName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const { mutate: uploadImage, isPending: isUploadImagePending } = useUploadImage(
    { projectId, dayNumber },
    {
      onSuccess: () => {
        clearInterval(intervalRef.current);
        setUploadProgress(100);
        setTimeout(() => { onClose(); }, 500);
      },
      onError: () => {
        clearInterval(intervalRef.current);
        toast('업로드에 실패했습니다.');
      },
    }
  );
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
      toast('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 제한 (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast('파일 크기는 10MB 이하여야 합니다.');
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
  const handleUpload = () => {
    if (!file || !user) return;
    setUploadProgress(0);
    intervalRef.current = setInterval(() => {
      setUploadProgress(prev => prev >= 90 ? (clearInterval(intervalRef.current), 90) : prev + 10);
    }, 200);
    uploadImage({ file, userId: user.uid, userName });
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
            <div className="relative h-[60vh] bg-slate-100 rounded-lg flex items-center justify-center">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full max-h-full object-contain rounded-lg"
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
            {isUploadImagePending && (
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
            disabled={isUploadImagePending}
          >
            취소
          </Button>
          <Button
            onClick={handleUpload}
            className="flex-1"
            disabled={!file || isUploadImagePending}
          >
            {isUploadImagePending ? '업로드 중...' : '업로드'}
          </Button>
        </div>
      </div>
    </div>
  );
};