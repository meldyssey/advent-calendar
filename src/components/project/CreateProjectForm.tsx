import { useEffect, useState } from 'react'
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '@/components/ui/label';
import { DEFAULT_THEMES } from '@/constants/themes';
import { useAuth } from '@/hooks/useAuth';
import { Spinner } from '../ui/spinner';
import { createProject } from '@/firebase/projects';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';

interface CreateProjectFormProps {
  onSuccess?: (projectId: string) => void;
  onCancel?: () => void
}

export const CreateProjectForm = ({ onSuccess, onCancel }: CreateProjectFormProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false)

  const [title, setTitle] = useState('');
  const [dateType, setDateType] = useState<'start' | 'end'>('end');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateError, setDateError] = useState(false)
  const [themeType, setThemeType] = useState('default')
  const [themes, setThemes] = useState<string[]>([...DEFAULT_THEMES])

  const totalDays = 25
  // const themes = DEFAULT_THEMES

  useEffect(() => {
    setStartDate('');  // 초기화
    setEndDate('');    // 종료일도 초기화
    setDateError(false)
    console.log("동작")
  }, [dateType])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!user) return;

    setLoading(true);

    try {
      const projectId = await createProject({
        title,
        userId: user.uid,
        startDate: new Date(startDate), 
        endDate:new Date(endDate), 
        totalDays, 
        customThemes: themes
      });

      console.log('projectId: ', projectId)
      alert('프로젝트 생성 성공')
      onSuccess?.(projectId);
    } catch(error){
      console.error('프로젝트 생성 실패: ', error);
      alert('프로젝트 생성 실패')
    } finally {
      setLoading(false)
    }
  }

  const calculateDate = (date: string, type: 'start' | 'end') => {
    const selectedDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    todayToString()
    if(type === 'start') {
      const calculatedEnd = new Date(selectedDate)
      calculatedEnd.setDate(selectedDate.getDate() + (totalDays - 1))
      // console.log(calculatedEnd.toISOString().split("T")[0])
      setEndDate(calculatedEnd.toISOString().split("T")[0])
    } else {
      const calculatedStart = new Date(selectedDate)
      calculatedStart.setDate(selectedDate.getDate() - (totalDays - 1))
      // if(calculatedStart < today){
      //   setDateError(true);
      //   alert('시작일이 오늘보다 이전일 수 없습니다. 날짜를 다시 선택해주세요.');
      //   setStartDate('');  // 초기화
      //   setEndDate('');    // 종료일도 초기화
      //   return;
      // } 
    setStartDate(calculatedStart.toISOString().split("T")[0])
    setDateError(false)
    }
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
              id='title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='예: 우리 가족 크리스마스 2025'
              className='mt-3 text-lg'
              required
            />
          </div>
          <div className="bg-white rounded-lg p-8 shadow-sm space-y-6" >
            <h2 className='text-lg font-semibold'>
              날짜 설정
            </h2>

            <div className='flex gap-4'>
              <Button
                type="button"
                variant={dateType === 'start' ? 'default' : "outline" }
                onClick={() => setDateType('start')}
                className='flex-1 h-12'
              >
                시작일 설정 (D-{totalDays-1})
              </Button>
              <Button
                type="button"
                variant={dateType === 'end' ? 'default' : 'outline'}
                onClick={() => setDateType('end')}
                className='flex-1 h-12'
              >
                종료일 설정 (D-Day)
              </Button>
            </div>

            {dateType === 'start' ? (
              <div className='space-y-3'>
                <Label>시작일 (D-{totalDays-1})</Label>
                <Input
                  id='startDate'
                  type='date'
                  value={startDate || todayToString()}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    calculateDate(e.target.value, 'start');
                  }}
                  min={todayToString()}
                  required
                />
                {endDate && (
                  <p>
                    종료일: {endDate} (D-Day, 자동 계산됨)
                  </p>
                )}
              </div>    
            ) : (
              <div className='space-y-3'>
                <Label>종료일 (D-Day)</Label>
                <Input
                  id='endDate'
                  type='date'
                  value={endDate || todayToString()}
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
              날짜 설정
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
                  <SelectLabel>Fruits</SelectLabel>
                  <SelectItem value="default">기본주제</SelectItem>
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
                            <Input placeholder="주제를 입력하세요" />
                          </div>
                        )
                      }
                      return <div key={index} className="p-2 bg-white rounded">
                        D-{index + 1}
                        <br />
                        <Input 
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
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
                className="flex-1 h-14 text-lg"
              >
                취소
              </Button>
            )}
            <Button
              type="submit"
              disabled={!title || !startDate || !endDate || loading || dateError}
              className="flex-1 h-14 text-lg"
            >
              {loading ? (<><Spinner/> 생성 중... </>) : '프로젝트 만들기'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
