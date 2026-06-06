import { useRef, useState } from 'react'
import { Label } from '@/components/ui/label';
import { DEFAULT_THEMES } from '@/constants/themes';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useCreateProject } from '@/hooks/mutations/useCreateProject';
import { useNavigate } from 'react-router';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';


export const CreateProjectForm = () => {
  const { user } = useAuth();

  const titleRef = useRef<HTMLInputElement>(null)
  const dateRef = useRef<HTMLInputElement>(null)
  const themeRefs = useRef<(HTMLInputElement | null)[]>([])  // 배열로 여러 input 관리

  const [title, setTitle] = useState('');
  const [dateType, setDateType] = useState<'start' | 'end'>('start');
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 24);
    return date.toISOString().split("T")[0];
  });
  const [dateError, setDateError] = useState(false)
  const [themeType, setThemeType] = useState('default')
  const [themes, setThemes] = useState<string[]>([...DEFAULT_THEMES])
  const [totalDays, setTotalDays] = useState<number>(25)

  const navigate = useNavigate()

  const { mutate: createProject, isPending: isCreateProjectPending } = useCreateProject({
    onSuccess: (projectId) => {
      toast('프로젝트 생성이 완료되었습니다.')
      navigate(`/projects/${projectId}`);
    },
    onError: () => {
      toast.error("프로젝트 생성에 실패했습니다", {
        position: "top-center",
      });
    },
  });

  const calculateDate = (date: string, type: 'start' | 'end', days = totalDays) => {
    const selectedDate = new Date(date);
    if (type === 'start') {
      const calculatedEnd = new Date(selectedDate);
      calculatedEnd.setDate(selectedDate.getDate() + (days - 1));
      setEndDate(calculatedEnd.toISOString().split("T")[0]);
    } else {
      const calculatedStart = new Date(selectedDate);
      calculatedStart.setDate(selectedDate.getDate() - (days - 1));
      setStartDate(calculatedStart.toISOString().split("T")[0]);
      setDateError(false);
    }
  };

  const handleTotalDaysChange = (value: string) => {
    const days = Number(value)
    setTotalDays(days);

    if (dateType === 'start' && startDate) calculateDate(startDate, 'start', days);
    else if (dateType === 'end' && endDate) calculateDate(endDate, 'end', days)

    if (days === 25){
      setThemeType('default')
      setThemes([...DEFAULT_THEMES]);
    } else {
      setThemeType('custom')
      setThemes(Array(days).fill(''))
    }
  }

  const handleDateTypeChange = (type: 'start' | 'end') => {
    setDateType(type);
    if (type === 'start' && startDate) {
      calculateDate(startDate, 'start');
    } else if (type === 'end') {
      if (endDate) {
        calculateDate(endDate, 'end');
      } else if (startDate) {
        calculateDate(startDate, 'start')
      }
    } 
  }


  const todayToString = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = (today.getMonth()+1).toString().padStart(2, '0')
    const date = today.getDate().toString().padStart(2,'0');
    return `${year}-${month}-${date}`
  }

  const handleTheme = (value:string) =>{
    setThemeType(value)
    if(value === 'default'){
      setThemes([...DEFAULT_THEMES])
      return;
    }
    if(value === 'custom'){
      setThemes(Array(totalDays).fill(''))
      return;
    }
  } 

  // Input 변경 핸들러
  const handleThemeInput = (index: number, value: string) => {
    setThemes(prev => {
      const newThemes = [...prev]
      newThemes[index] = value
      return newThemes
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(!user) return;

    if(!title.trim()){
      toast.error("프로젝트 제목을 입력해 주세요.")
      titleRef.current?.focus();
      titleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if(!startDate || !endDate){
      toast.error("날짜를 확인해 주세요.")
      dateRef.current?.focus();
      dateRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if(themeType === 'custom'){
      const emptyThemeIndex = themes.findIndex(theme => !theme.trim());
      if(emptyThemeIndex !== -1) {
        toast.error(`D-${emptyThemeIndex === totalDays - 1 ? 'Day' : emptyThemeIndex + 1} 주제를 입력해 주세요.`)
        themeRefs.current[emptyThemeIndex]?.focus();
        themeRefs.current[emptyThemeIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
        }
    }

    createProject({
      title,
      userId: user.uid,
      startDate: new Date(startDate), 
      endDate:new Date(endDate), 
      totalDays, 
      customThemes: themeType === 'custom' ? themes : undefined
    });
  }

  return (
    <div className=''>
      <div className='max-w-3xl mx-auto px-4 py-12'>
        {/* 헤더 */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-slate-900 mb-4'>
            새 프로젝트 만들기
          </h1>
          <p className='text-lg text-slate-600'>
            어드벤트 캘린더 프로젝트를 생성하세요. ({totalDays}일간)
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className='space-y-8'>
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <Label htmlFor='title' className='text-lg font-semibold'>
              프로젝트 제목
            </Label>
            <Input
              ref={titleRef}
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='예: 우리 가족 크리스마스 2025'
              className='mt-3 text-lg'
            />
          </div>
          <div className="bg-white rounded-lg p-8 shadow-sm">
            <Label htmlFor='title' className='text-lg font-semibold'>
              프로젝트 기간(총 일수)
            </Label>
            <Select
              value={totalDays.toString()}
              onValueChange={handleTotalDaysChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="프로젝트 기간(총 일수)을 선택해주세요." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>프로젝트 기간 선택</SelectLabel>
                  {new Array(31).fill(0).map((_, idx) => <SelectItem key={idx} value={(idx+1).toString()}>{idx+1}일</SelectItem>)}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="bg-white rounded-lg p-8 shadow-sm space-y-6" >
            <h2 className='text-lg font-semibold'>
              날짜 설정
            </h2>

            <div className='flex gap-4'>
              <Button
                type="button"
                variant={dateType === 'start' ? 'default' : "outline" }
                onClick={() => handleDateTypeChange('start')}
                className='flex-1 h-12'
              >
                시작일 설정 (D-{totalDays-1})
              </Button>
              <Button
                type="button"
                variant={dateType === 'end' ? 'default' : 'outline'}
                onClick={() => handleDateTypeChange('end')}
                className='flex-1 h-12'
              >
                종료일 설정 (D-Day)
              </Button>
            </div>

            {dateType === 'start' ? (
              <div className='space-y-3'>
                <Label>시작일 (D-{totalDays-1})</Label>
                <Input
                  ref={dateRef}
                  id='startDate'
                  type='date'
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    calculateDate(e.target.value, 'start');
                  }}
                  min={todayToString()}
                  required
                />
                {endDate && (
                  <p className="text-sm text-slate-600">
                    종료일: {endDate} (D-Day, 자동 계산됨)
                  </p>
                )}
              </div>    
            ) : (
              <div className='space-y-3'>
                <Label>종료일 (D-Day)</Label>
                <Input
                  ref={dateRef}
                  id='endDate'
                  type='date'
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    calculateDate(e.target.value, 'end');
                  }}
                  min={todayToString()}
                  className={dateError ? 'border-red-500' : ''}
                  required
                />
                {dateError && (
                  <p className="text-sm text-red-600"> 
                    날짜를 다시 선택해주세요
                  </p>
                )}
                {startDate && !dateError && (
                  <p className="text-sm text-slate-600">
                    시작일: {startDate} (D-{totalDays-1}, 자동 계산됨)
                  </p>
                )}
              </div>    
            )}
          </div>
          <div className="bg-white rounded-lg p-8 shadow-sm space-y-6" >
            <h2 className='text-lg font-semibold'>
              주제 설정
            </h2>
            <Select
              value={themeType}
              onValueChange={(value)=>{handleTheme(value)}}
            >
              <SelectTrigger>
                <SelectValue placeholder="주제를 선택해 주세요." />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>주제 선택</SelectLabel>
                  {totalDays === 25 ? 
                  <SelectItem value="default">기본주제</SelectItem>
                  : <></>
                  }
                  <SelectItem value="custom">직접 입력하기</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {/* 주제 보기 */}
            {(
              <div className="bg-blue-50 rounded-lg p-8 border-2 border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-4">
                  주제 미리보기
                </h3>
                {themeType ==='default' && <div className="grid grid-cols-2 gap-3 text-sm text-blue-800">
                  {themes.map((__, index) =>{
                    if(index === themes.length-1){
                      return(
                        <div key={index} className="p-2 bg-white rounded">D-Day <br/>
                        {themes[index]}</div>
                      )
                    } 
                    return <div key={index} className="p-2 bg-white rounded">D-{themes.length-index-1} <br/>
                    {themes[index]}</div>}
                  )}
                </div>}
                {themeType === 'custom' && (
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    {Array.from({ length: totalDays }, (_, index) => {
                      if(index === totalDays - 1){
                        return(
                          <div key={index} className="p-2 bg-white rounded">
                            D-Day
                            <br />
                            <Input
                              ref={(el) => {themeRefs.current[index] = el}}
                              value={themes[index] || ''}
                              placeholder="주제를 입력하세요" 
                              onChange={(e) => handleThemeInput(index, e.target.value)}
                            />
                          </div>
                        )
                      }
                      return <div key={index} className="p-2 bg-white rounded">
                        D-{totalDays - index -1}
                        <br />
                        <Input
                          ref={(el) => {themeRefs.current[index] = el}}
                          placeholder="주제를 입력하세요"
                          value={themes[index] || ''}
                          onChange={(e) => handleThemeInput(index, e.target.value)}
                        />
                      </div>
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 버튼 영역 */}
          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isCreateProjectPending || dateError}
              className="flex-1 h-14 text-lg"
            >
              {isCreateProjectPending ? (<><Spinner/> 생성 중... </>) : '프로젝트 만들기'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
