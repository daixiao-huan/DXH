// 导航栏滚动效果
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.backgroundColor = 'var(--bg-white)';
        navbar.style.boxShadow = 'var(--box-shadow)';
    }
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// 课程卡片点击效果
const courseCards = document.querySelectorAll('.course-card');
courseCards.forEach(card => {
    card.addEventListener('click', function() {
        // 这里可以添加跳转到课程详情页的逻辑
        console.log('课程卡片被点击');
    });
});

// 学习路径卡片点击效果
const pathCards = document.querySelectorAll('.path-card');
pathCards.forEach(card => {
    card.addEventListener('click', function() {
        // 这里可以添加跳转到学习路径详情页的逻辑
        console.log('学习路径卡片被点击');
    });
});

// 登录和注册按钮点击效果
const loginBtn = document.querySelector('.btn-primary');
const registerBtn = document.querySelector('.btn-secondary');

if (loginBtn) {
    loginBtn.addEventListener('click', function() {
        console.log('登录按钮被点击');
    });
}

if (registerBtn) {
    registerBtn.addEventListener('click', function() {
        console.log('注册按钮被点击');
    });
}

// 行动召唤按钮点击效果
const ctaBtn = document.querySelector('.cta .btn-primary');
if (ctaBtn) {
    ctaBtn.addEventListener('click', function() {
        console.log('立即注册按钮被点击');
    });
}

// 页面加载动画
window.addEventListener('load', function() {
    const elements = document.querySelectorAll('.feature-item, .course-card, .path-card, .testimonial-card');
    elements.forEach(element => {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    });
});

// 响应式导航栏
const navLinks = document.querySelector('.nav-links');
const navActions = document.querySelector('.nav-actions');

function checkScreenSize() {
    if (window.innerWidth <= 768) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.alignItems = 'center';
        navActions.style.justifyContent = 'center';
    } else {
        navLinks.style.flexDirection = 'row';
        navLinks.style.alignItems = 'center';
        navActions.style.justifyContent = 'flex-end';
    }
}

// 初始检查
checkScreenSize();

// 窗口大小变化时检查
window.addEventListener('resize', checkScreenSize);