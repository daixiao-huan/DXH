import React, { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  requirement: string
  created_at: string
}

interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  earned_at: string
  achievement: Achievement
}

const Achievements: React.FC = () => {
  const [user, setUser] = useState<any>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [stats, setStats] = useState({
    totalCourses: 0,
    completedCourses: 0,
    totalExercises: 0,
    completedExercises: 0,
    totalAssessments: 0,
    passedAssessments: 0
  })
  
  useEffect(() => {
    // 获取用户信息
    const { data: { session } } = supabase.auth.getSession()
    if (session) {
      setUser(session.user)
      getUserAchievements(session.user.id)
      getStats(session.user.id)
    }
    
    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      if (session) {
        getUserAchievements(session.user.id)
        getStats(session.user.id)
      }
    })
    
    // 获取所有成就
    getAllAchievements()
    
    return () => subscription.unsubscribe()
  }, [])
  
  const getAllAchievements = async () => {
    const { data, error } = await supabase
      .from('achievements')
      .select('*')
    
    if (error) {
      console.error('Error fetching achievements:', error)
    } else {
      setAchievements(data)
    }
  }
  
  const getUserAchievements = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_achievements')
      .select('*, achievement(*)')
      .eq('user_id', userId)
    
    if (error) {
      console.error('Error fetching user achievements:', error)
    } else {
      setUserAchievements(data as UserAchievement[])
    }
  }
  
  const getStats = async (userId: string) => {
    // 获取课程统计
    const { data: courseData, error: courseError } = await supabase
      .from('user_courses')
      .select('completed')
      .eq('user_id', userId)
    
    // 获取练习统计
    const { data: exerciseData, error: exerciseError } = await supabase
      .from('exercise_submissions')
      .select('id')
      .eq('user_id', userId)
    
    // 获取测评统计
    const { data: assessmentData, error: assessmentError } = await supabase
      .from('assessment_submissions')
      .select('passed')
      .eq('user_id', userId)
    
    if (!courseError && !exerciseError && !assessmentError) {
      setStats({
        totalCourses: courseData.length,
        completedCourses: courseData.filter(c => c.completed).length,
        totalExercises: exerciseData.length,
        completedExercises: exerciseData.length,
        totalAssessments: assessmentData.length,
        passedAssessments: assessmentData.filter(a => a.passed).length
      })
    }
  }
  
  // 检查用户是否拥有某个成就
  const hasAchievement = (achievementId: string) => {
    return userAchievements.some(ua => ua.achievement_id === achievementId)
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">成就系统</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">我的徽章</h2>
          <div className="grid grid-cols-3 gap-4">
            {achievements.map(achievement => (
              <div 
                key={achievement.id} 
                className={`rounded-lg p-4 text-center ${hasAchievement(achievement.id) ? 'bg-blue-100' : 'bg-gray-100'}`}
              >
                <div className="text-4xl mb-2">{achievement.icon}</div>
                <p className="text-sm">{achievement.name}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-4">学习统计</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>完成课程</span>
                <span>{stats.completedCourses}/{stats.totalCourses}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ 
                    width: stats.totalCourses > 0 ? `${(stats.completedCourses / stats.totalCourses) * 100}%` : '0%' 
                  }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>完成练习</span>
                <span>{stats.completedExercises}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full" 
                  style={{ width: `${Math.min((stats.completedExercises / 10) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span>通过测评</span>
                <span>{stats.passedAssessments}/{stats.totalAssessments}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-600 h-2 rounded-full" 
                  style={{ 
                    width: stats.totalAssessments > 0 ? `${(stats.passedAssessments / stats.totalAssessments) * 100}%` : '0%' 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="card mt-6">
        <h2 className="text-xl font-semibold mb-4">排行榜</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">排名</th>
                <th className="px-4 py-2 text-left">用户</th>
                <th className="px-4 py-2 text-left">完成课程</th>
                <th className="px-4 py-2 text-left">完成练习</th>
                <th className="px-4 py-2 text-left">通过测评</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2">1</td>
                <td className="px-4 py-2">用户1</td>
                <td className="px-4 py-2">5</td>
                <td className="px-4 py-2">20</td>
                <td className="px-4 py-2">8</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">2</td>
                <td className="px-4 py-2">用户2</td>
                <td className="px-4 py-2">4</td>
                <td className="px-4 py-2">15</td>
                <td className="px-4 py-2">6</td>
              </tr>
              <tr>
                <td className="px-4 py-2">3</td>
                <td className="px-4 py-2">用户3</td>
                <td className="px-4 py-2">3</td>
                <td className="px-4 py-2">10</td>
                <td className="px-4 py-2">4</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Achievements