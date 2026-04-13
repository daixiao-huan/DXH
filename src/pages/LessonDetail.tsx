import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../utils/supabase'

interface Lesson {
  id: string
  course_id: string
  title: string
  content: string
  video_url: string
  order_index: number
  created_at: string
}

const LessonDetail: React.FC = () => {
  const { id, lessonId } = useParams<{ id: string; lessonId: string }>()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [allLessons, setAllLessons] = useState<Lesson[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [user, setUser] = useState<any>(null)
  
  useEffect(() => {
    // 获取用户信息
    const { data: { session } } = supabase.auth.getSession()
    if (session) {
      setUser(session.user)
    }
    
    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })
    
    // 获取章节详情
    getLessonDetail()
    
    // 获取所有章节
    getAllLessons()
    
    return () => subscription.unsubscribe()
  }, [id, lessonId])
  
  const getLessonDetail = async () => {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', lessonId)
      .single()
    
    if (error) {
      console.error('Error fetching lesson:', error)
    } else {
      setLesson(data)
    }
  }
  
  const getAllLessons = async () => {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .eq('course_id', id)
      .order('order_index', { ascending: true })
    
    if (error) {
      console.error('Error fetching lessons:', error)
    } else {
      setAllLessons(data)
      // 找到当前章节的索引
      const index = data.findIndex(l => l.id === lessonId)
      if (index !== -1) {
        setCurrentIndex(index)
      }
    }
  }
  
  const updateProgress = async () => {
    if (!user) return
    
    // 计算课程进度
    const progress = Math.round(((currentIndex + 1) / allLessons.length) * 100)
    
    const { error } = await supabase
      .from('user_courses')
      .update({ progress })
      .eq('user_id', user.id)
      .eq('course_id', id)
    
    if (error) {
      console.error('Error updating progress:', error)
    }
  }
  
  useEffect(() => {
    if (user && allLessons.length > 0) {
      updateProgress()
    }
  }, [currentIndex, user, allLessons, id])
  
  if (!lesson) {
    return <div className="container mx-auto p-4">加载中...</div>
  }
  
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">章节内容</h1>
      <div className="card mb-6">
        <h2 className="text-2xl font-semibold mb-4">{lesson.title}</h2>
        <div className="aspect-w-16 aspect-h-9 mb-6">
          {lesson.video_url ? (
            <iframe 
              src={lesson.video_url} 
              className="w-full h-64 rounded-lg" 
              title={lesson.title}
              frameBorder="0"
              allowFullScreen
            />
          ) : (
            <div className="bg-gray-200 rounded-lg flex items-center justify-center h-64">
              <p>视频播放器</p>
            </div>
          )}
        </div>
        <div className="prose max-w-none">
          {lesson.content ? (
            <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
          ) : (
            <p>暂无内容</p>
          )}
        </div>
      </div>
      <div className="flex justify-between mt-6">
        {prevLesson ? (
          <Link to={`/courses/${id}/lessons/${prevLesson.id}`} className="btn-secondary">
            上一章
          </Link>
        ) : (
          <button className="btn-secondary disabled:opacity-50" disabled>
            上一章
          </button>
        )}
        <div className="flex-1 text-center">
          <span>{currentIndex + 1} / {allLessons.length}</span>
        </div>
        {nextLesson ? (
          <Link to={`/courses/${id}/lessons/${nextLesson.id}`} className="btn-primary">
            下一章
          </Link>
        ) : (
          <Link to={`/courses/${id}`} className="btn-primary">
            完成课程
          </Link>
        )}
      </div>
    </div>
  )
}

export default LessonDetail