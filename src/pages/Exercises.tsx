import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { Link } from 'react-router-dom'

interface Exercise {
  id: string
  course_id: string
  title: string
  description: string
  difficulty: string
  created_at: string
}

const Exercises: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([])
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
    
    // 获取练习数据
    getExercises()
    
    return () => subscription.unsubscribe()
  }, [])
  
  const getExercises = async () => {
    const { data, error } = await supabase
      .from('exercises')
      .select('*')
    
    if (error) {
      console.error('Error fetching exercises:', error)
    } else {
      setExercises(data)
    }
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">练习列表</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exercises.map(exercise => (
          <div key={exercise.id} className="card">
            <h2 className="text-xl font-semibold mb-2">{exercise.title}</h2>
            <p className="mb-4">{exercise.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">难度: {exercise.difficulty}</span>
              <Link to={`/exercises/${exercise.id}`} className="btn-primary">
                开始练习
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Exercises