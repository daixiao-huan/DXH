import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'

interface Exercise {
  id: string
  course_id: string
  title: string
  description: string
  difficulty: string
  solution: string
  created_at: string
}

const ExerciseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [exercise, setExercise] = useState<Exercise | null>(null)
  const [code, setCode] = useState('')
  const [result, setResult] = useState('')
  const [user, setUser] = useState<any>(null)
  const [submitted, setSubmitted] = useState(false)
  const navigate = useNavigate()
  
  useEffect(() => {
    // 获取用户信息
    const { data: { session } } = supabase.auth.getSession()
    if (session) {
      setUser(session.user)
    } else {
      navigate('/login')
    }
    
    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (!session) {
        navigate('/login')
      }
    })
    
    // 获取练习详情
    getExerciseDetail()
    
    return () => subscription.unsubscribe()
  }, [id, navigate])
  
  const getExerciseDetail = async () => {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching exercise:', error)
    } else {
      setExercise(data)
    }
  }
  
  const handleSubmit = async () => {
    // 模拟代码执行
    setResult('代码执行成功！\n输出: Hello, World!')
    
    // 保存提交记录
    if (user) {
      const { error } = await supabase
        .from('exercise_submissions')
        .insert({
          user_id: user.id,
          exercise_id: id,
          code,
          result,
          score: 100
        })
      
      if (error) {
        console.error('Error saving submission:', error)
      } else {
        setSubmitted(true)
      }
    }
  }
  
  if (!exercise) {
    return <div className="container mx-auto p-4">加载中...</div>
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">练习详情</h1>
      <div className="card mb-6">
        <h2 className="text-2xl font-semibold mb-4">{exercise.title}</h2>
        <p className="mb-4">{exercise.description}</p>
        <div className="mb-6">
          <label className="block mb-2">代码编辑器</label>
          <textarea 
            className="w-full border border-gray-300 rounded-md p-4 h-64 font-mono" 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="输入Python代码..."
          />
        </div>
        <button className="btn-primary mb-6" onClick={handleSubmit}>
          运行代码
        </button>
        {result && (
          <div className="mt-6">
            <label className="block mb-2">执行结果</label>
            <div className="bg-gray-100 rounded-md p-4 font-mono">
              {result}
            </div>
          </div>
        )}
        {submitted && (
          <div className="mt-6 bg-green-100 p-4 rounded-md">
            <p className="text-green-700">练习提交成功！</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExerciseDetail