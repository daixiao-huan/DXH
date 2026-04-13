import React from 'react'

const Courses: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">课程列表</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold mb-2">Python基础</h2>
          <p className="mb-4">Python编程语言的基础语法和数据结构</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">基础</span>
            <button className="btn-primary">查看详情</button>
          </div>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-2">数据分析基础</h2>
          <p className="mb-4">数据清洗、处理和可视化的基本方法</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">基础</span>
            <button className="btn-primary">查看详情</button>
          </div>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-2">商务数据分析</h2>
          <p className="mb-4">面向商务场景的数据分析方法和工具</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">进阶</span>
            <button className="btn-primary">查看详情</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Courses