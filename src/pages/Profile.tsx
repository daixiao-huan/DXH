import React from 'react'

const Profile: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">个人资料</h1>
      <div className="card mb-6">
        <h2 className="text-2xl font-semibold mb-4">个人信息</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">姓名</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded-md p-2" 
              value="用户名" 
              readOnly 
            />
          </div>
          <div>
            <label className="block mb-2">邮箱</label>
            <input 
              type="email" 
              className="w-full border border-gray-300 rounded-md p-2" 
              value="user@example.com" 
              readOnly 
            />
          </div>
          <div>
            <label className="block mb-2">注册时间</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded-md p-2" 
              value="2024-01-01" 
              readOnly 
            />
          </div>
          <div>
            <label className="block mb-2">角色</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded-md p-2" 
              value="免费用户" 
              readOnly 
            />
          </div>
        </div>
        <button className="btn-primary mt-6">编辑资料</button>
      </div>
      <div className="card">
        <h2 className="text-2xl font-semibold mb-4">学习记录</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Python基础</span>
            <span>已完成</span>
          </div>
          <div className="flex justify-between items-center">
            <span>数据分析基础</span>
            <span>进行中</span>
          </div>
          <div className="flex justify-between items-center">
            <span>商务数据分析</span>
            <span>未开始</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile