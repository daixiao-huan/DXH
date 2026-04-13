import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../utils/supabase'

interface Assessment {
  id: string
  course_id: string
  title: string
  description: string
  passing_score: number
  created_at: string
}

interface Question {
  id: string
  question: string
  options: string[]
  correct_answer: string
}

const AssessmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [assessment, setAssessment] = useState<Assessment | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()
  
  // 模拟题目数据
  const questions: Question[] = [
    {
      id: '1',
      question: 'Python中用于定义函数的关键字是？',
      options: ['def', 'function', 'func', 'define'],
      correct_answer: 'def'
    },
    {
      id: '2',
      question: 'Python中列表的英文是？',
      options: ['list', 'array', 'tuple', 'dict'],
      correct_answer: 'list'
    },
    {
      id: '3',
      question: 'Python中用于循环的关键字是？',
      options: ['for', 'loop', 'while', 'do'],
      correct_answer: 'for'
    }
  ]
  
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
    
    // 获取测评详情
    getAssessmentDetail()
    
    return () => subscription.unsubscribe()
  }, [id, navigate])
  
  const getAssessmentDetail = async () => {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) {
      console.error('Error fetching assessment:', error)
    } else {
      setAssessment(data)
    }
  }
  
  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers({ ...answers, [questionId]: answer })
  }
  
  const handleSubmit = async () => {
    // 计算分数
    let totalScore = 0
    questions.forEach(question => {
      if (answers[question.id] === question.correct_answer) {
        totalScore += 100 / questions.length
      }
    })
    totalScore = Math.round(totalScore)
    setScore(totalScore)
    
    // 保存测评结果
    if (user && assessment) {
      const { error } = await supabase
        .from('assessment_submissions')
        .insert({
          user_id: user.id,
          assessment_id: id,
          answers,
          score: totalScore,
          passed: totalScore >= assessment.passing_score
        })
      
      if (error) {
        console.error('Error saving assessment:', error)
      } else {
        setSubmitted(true)
      }
    }
  }
  
  if (!assessment) {
    return <div className="container mx-auto p-4">加载中...</div>
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">测评详情</h1>
      <div className="card mb-6">
        <h2 className="text-2xl font-semibold mb-4">{assessment.title}</h2>
        {!submitted ? (
          <>
            {questions.map((q) => (
              <div key={q.id} className="mb-6">
                <p className="mb-4">{q.id}. {q.question}</p>
                <div className="space-y-2">
                  {q.options.map((option) => (
                    <div key={option}>
                      <input
                        type="radio"
                        id={`${q.id}-${option}`}
                        name={q.id}
                        value={option}
                        checked={answers[q.id] === option}
                        onChange={() => handleAnswerChange(q.id, option)}
                      />
                      <label htmlFor={`${q.id}-${option}`} className="ml-2">{option}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button className="btn-primary" onClick={handleSubmit}>
              提交测评
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold mb-4">测评结果</h3>
            <p className="text-4xl font-bold mb-6">{score}分</p>
            <p className={`mb-6 ${score >= assessment.passing_score ? 'text-green-600' : 'text-red-600'}`}>
              {score >= assessment.passing_score ? '恭喜你通过了测评！' : '很遗憾，未通过测评。'}
            </p>
            <div className="mb-6">
              <p>通过分数: {assessment.passing_score}</p>
              <p>题目数量: {questions.length}</p>
              <p>答对题目: {Object.entries(answers).filter(([_, answer]) => {
                const question = questions.find(q => q.id === _)
                return question?.correct_answer === answer
              }).length}</p>
            </div>
            <button className="btn-primary">查看详细报告</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AssessmentDetail