import logo from "@/assets/logo.png";

export default function GlobalLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-muted">
      <div className="animate-pulse items-center">
        <img src={logo} alt="어드벤트 캘린더 서비스의 로고" className="h-20" />
      </div>
    </div>
  );
}
