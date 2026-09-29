import { Sparkle, TreePine, Gift, Snowflake } from 'lucide-react';

export const AdventHero = () => {
  return (
    <div className="flex flex-col gap-6">
      {/* 킥커 */}
      <div className="flex items-center justify-center gap-2">
        <Sparkle className="h-3.5 w-3.5 text-advent-mist" />
        <span className="font-gowun text-xs font-bold tracking-[4px] text-advent-mist">
          ADVENT CALENDAR
        </span>
        <Sparkle className="h-3.5 w-3.5 text-advent-mist" />
      </div>

      {/* 헤드라인 */}
      <div className="text-center">
        <p className="font-blackhan text-[34px] leading-tight text-advent-cream">함께 만드는</p>
        <p className="font-blackhan text-[34px] leading-tight text-advent-brick">특별한 추억</p>
        <p className="font-gowun mx-auto mt-3 max-w-[300px] text-sm leading-relaxed text-advent-cream/70">
          어드벤트 캘린더로 소중한 하루하루를 기록하세요
        </p>
      </div>

      {/* 장식용 데이 타일 그리드 */}
      <div className="grid h-[178px] grid-cols-3 grid-rows-2 gap-2.5">
        <div className="col-start-1 row-span-2 flex flex-col justify-between rounded-[18px] bg-advent-sage p-3.5">
          <TreePine className="h-6 w-6 text-advent-green" />
          <span className="font-blackhan text-xl text-advent-green">01</span>
        </div>

        <div className="flex flex-col justify-between rounded-[18px] bg-advent-charcoal p-3">
          <Gift className="h-5 w-5 text-advent-cream" />
          <span className="font-blackhan text-lg text-advent-cream">02</span>
        </div>

        <div className="flex items-center justify-center rounded-[18px] bg-advent-cream">
          <span className="font-blackhan text-2xl text-advent-charcoal">03</span>
        </div>

        <div className="flex flex-col justify-between rounded-[18px] bg-advent-brick p-3">
          <Snowflake className="h-5 w-5 text-advent-cream" />
          <span className="font-blackhan text-lg text-advent-cream">04</span>
        </div>

        <div className="flex items-center justify-center rounded-[18px] bg-advent-charcoal">
          <span className="font-blackhan text-xl text-advent-cream">05</span>
        </div>
      </div>
    </div>
  );
};
