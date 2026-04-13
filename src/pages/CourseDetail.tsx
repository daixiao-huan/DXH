import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'

interface Course {
  id: string
  title: string
  description: string
  level: string
  duration: number
  created_at: string
}

interface Lesson {
  id: string
  course_id: string
  title: string
  content: string
  video_url: string
  order_index: number
  created_at: string
}

const CourseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [course, setCourse] = useState<Course | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [user, setUser] = useState<any>(null)
  const [progress, setProgress] = useState<number>(0)
  const [enrolled, setEnrolled] = useState<boolean>(false)
  const navigate = useNavigate()
  
  useEffect(() => {
    // 获取用户信息
    const { data: { session } } = supabase.auth.getSession()
    if (session) {
      setUser(session.user)
      checkEnrollment(session.user.id)
    }
    
    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session) {
        checkEnrollment(session.user.id)
      }
    })
    
    // 获取课程详情
    getCourseDetail()
    
    // 获取章节列表
    getLessons()
    
    return () => subscription.unsubscribe()
  }, [id])
  
  const getCourseDetail = async () => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching course:', error)
    } else {
      setCourse(data)
    }
  }
  
  const getLessons = async () => {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', id)
      .order('order_index', { ascending: true })
    
    if (error) {
      console.error('Error fetching lessons:', error)
    } else {
      setLessons(data)
    }
  }
  
  const checkEnrollment = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_courses')
      .select('progress, completed')
      .eq('user_id', userId)
      .eq('course_id', id)
      .single()
    
    if (error) {
      if (error.code === 'PGRST116') {
        // 用户未注册该课程
        setEnrolled(false)
      } else {
        console.error('Error checking enrollment:', error)
      }
    } else {
      setEnrolled(true)
      setProgress(data.progress)
    }
  }
  
  const handleEnroll = async () => {
    if (!user) {
      navigate('/login')
      return
    }
    
    const { error } = await supabase
      .from('user_courses')
      .insert({
        user_id: user.id,
        course_id: id,
        progress: 0,
        completed: false
      })
    
    if (error) {
      console.error('Error enrolling:', error)
    } else {
      setEnrolled(true)
      setProgress(0)
    }
  }
  
  if (!course) {
    return <div className="container mx-auto p-4">加载中...</div>
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">课程详情</h1>
      <div className="card mb-6">
        <h2 className="text-2xl font-semibold mb-4">{course.title}</h2>
        <p className="mb-4">{course.description}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <span className="text-gray-600">难度:</span>
            <span className="ml-2">{course.level === 'basic' ? '基础' : course.level === 'intermediate' ? '进阶' : '高级'}</span>
          </div>
          <div>
            <span className="text-gray-600">时长:</span>
            <span className="ml-2">{course.duration}小时</span>
          </div>
          <div>
            <span className="text-gray-600">进度:</span>
            <span className="ml-2">{progress}%</span>
          </div>
        </div>
        {enrolled ? (
          <Link to={`/courses/${id}/lessons/${lessons[0]?.id}`} className="btn-primary inline-block">
            继续学习
          </Link>
        ) : (
          <button onClick={handleEnroll} className="btn-primary">
            {user ? '开始学习' : '登录并开始学习'}
          </button>
        )}
      </div>
      <h3 className="text-xl font-semibold mb-4">课程章节</h3>
      <div className="space-y-4">
        {lessons.map((lesson, index) => (
          <div key={lesson.id} className="card">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">{index + 1}. {lesson.title}</h4>
              {enrolled ? (
                <Link to={`/courses/${id}/lessons/${lesson.id}`} className="text-blue-600">
                  查看
                </Link>
              ) : (
                <span className="text-gray-400">需要注册</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CourseDetail