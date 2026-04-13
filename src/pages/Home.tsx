import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { Link } from 'react-router-dom'

interface Course {
  id: string
  title: string
  description: string
  level: string
  duration: number
  created_at: string
}

const Home: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [user, setUser] = useState<any>(null)
  const [progress, setProgress] = useState<number>(0)
  
  useEffect(() => {
    // 获取用户信息
    const { data: { session } } = supabase.auth.getSession()
    if (session) {
      setUser(session.user)
      // 获取学习进度
      getProgress(session.user.id)
    }
    
    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session) {
        getProgress(session.user.id)
      }
    })
    
    // 获取课程数据
    getCourses()
    
    return () => subscription.unsubscribe()
  }, [])
  
  const getCourses = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
    
    if (error) {
      console.error('Error fetching courses:', error)
    } else {
      setCourses(data)
    }
  }
  
  const getProgress = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_courses')
      .select('progress')
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error fetching progress:', error)
    } else if (data.length > 0) {
      const avgProgress = data.reduce((sum, item) => sum + item.progress, 0) / data.length
      setProgress(Math.round(avgProgress))
    }
  }
  
  // 按难度级别分组课程
  const basicCourses = courses?.filter(course => course.level === 'basic') || []
  const intermediateCourses = courses?.filter(course => course.level === 'intermediate') || []
  const advancedCourses = courses?.filter(course => course.level === 'advanced') || []
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">数据分析在线教育平台</h1>
      
      {/* 学习进度 */}
      <div className="card mb-8">
        <h2 className="text-xl font-semibold mb-4">学习进度</h2>
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="w-32 h-32 mb-4 md:mb-0">
            <div className="relative w-full h-full">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 40 * progress / 100} ${2 * Math.PI * 40}`}
                  transform="rotate(-90 50 50)"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{progress}%</span>
              </div>
            </div>
          </div>
          <div className="flex-1 md:ml-8">
            <p className="mb-2">{user ? `欢迎回来，${user.user_metadata?.name || '同学'}` : '登录后查看学习进度'}</p>
            <p className="text-gray-600">{user ? '继续你的学习之旅' : '开始你的数据分析学习之旅'}</p>
            {!user && (
              <Link to="/login" className="btn-primary mt-4 inline-block">登录</Link>
            )}
          </div>
        </div>
      </div>
      
      {/* 课程体系概览 */}
      <h2 className="text-2xl font-bold mb-4">课程体系概览</h2>
      
      {/* 基础课程 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-blue-600">基础课程</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {basicCourses.map(course => (
            <Link to={`/courses/${course.id}`} key={course.id} className="card hover:shadow-lg transition-shadow">
              <h4 className="font-semibold mb-2">{course.title}</h4>
              <p className="text-gray-600 text-sm mb-4">{course.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">基础</span>
                <span className="text-xs text-gray-500">{course.duration}小时</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* 进阶课程 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-green-600">进阶课程</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {intermediateCourses.map(course => (
            <Link to={`/courses/${course.id}`} key={course.id} className="card hover:shadow-lg transition-shadow">
              <h4 className="font-semibold mb-2">{course.title}</h4>
              <p className="text-gray-600 text-sm mb-4">{course.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">进阶</span>
                <span className="text-xs text-gray-500">{course.duration}小时</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* 高级课程 */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4 text-purple-600">高级课程</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {advancedCourses.map(course => (
            <Link to={`/courses/${course.id}`} key={course.id} className="card hover:shadow-lg transition-shadow">
              <h4 className="font-semibold mb-2">{course.title}</h4>
              <p className="text-gray-600 text-sm mb-4">{course.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">高级</span>
                <span className="text-xs text-gray-500">{course.duration}小时</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* 推荐课程 */}
      <h2 className="text-2xl font-bold mb-4">推荐课程</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(courses || []).slice(0, 3).map(course => (
          <Link to={`/courses/${course.id}`} key={course.id} className="card hover:shadow-lg transition-shadow">
            <h4 className="font-semibold mb-2">{course.title}</h4>
            <p className="text-gray-600 text-sm mb-4">{course.description}</p>
            <div className="flex justify-between items-center">
              <span className={`text-xs px-2 py-1 rounded ${course.level === 'basic' ? 'bg-blue-100 text-blue-800' : course.level === 'intermediate' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                {course.level === 'basic' ? '基础' : course.level === 'intermediate' ? '进阶' : '高级'}
              </span>
              <span className="text-xs text-gray-500">{course.duration}小时</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home