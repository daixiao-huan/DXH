import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null)
  const navigate = useNavigate()
  
  useEffect(() => {
    // 模拟用户登录状态
    setUser({ user_metadata: { name: '用户名' } })
  }, [])
  
  const handleLogout = () => {
    // 模拟登出
    setUser(null)
    navigate('/login')
  }
  
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold">数据分析教育平台</Link>
          <div className="flex space-x-6">
            <Link to="/" className="hover:text-blue-200">首页</Link>
            <Link to="/courses" className="hover:text-blue-200">课程</Link>
            <Link to="/exercises" className="hover:text-blue-200">练习</Link>
            <Link to="/assessments" className="hover:text-blue-200">测评</Link>
            <Link to="/achievements" className="hover:text-blue-200">成就</Link>
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="hover:text-blue-200">个人中心</Link>
                <button onClick={handleLogout} className="hover:text-blue-200">退出</button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="hover:text-blue-200">登录</Link>
                <Link to="/register" className="hover:text-blue-200">注册</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar