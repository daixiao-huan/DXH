import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'
import { Link } from 'react-router-dom'

interface Assessment {
  id: string
  course_id: string
  title: string
  description: string
  passing_score: number
  created_at: string
}

const Assessments: React.FC = () => {
  const [assessments, setAssessments] = useState<Assessment[]>([])
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
    
    // 获取测评数据
    getAssessments()
    
    return () => subscription.unsubscribe()
  }, [])
  
  const getAssessments = async () => {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
    
    if (error) {
      console.error('Error fetching assessments:', error)
    } else {
      setAssessments(data)
    }
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">测评列表</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {assessments.map(assessment => (
          <div key={assessment.id} className="card">
            <h2 className="text-xl font-semibold mb-2">{assessment.title}</h2>
            <p className="mb-4">{assessment.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">通过分数: {assessment.passing_score}</span>
              <Link to={`/assessments/${assessment.id}`} className="btn-primary">
                开始测评
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Assessments