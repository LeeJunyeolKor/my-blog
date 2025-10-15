import React, { useState } from 'react';

// 블로그 게시물 데이터 (고유 id 추가)
const posts = [
    {
        id: 1,
        date: '2025년 10월 15일',
        title: '나의 첫 블로그 글: 새로운 시작',
        content: '드디어 저만의 블로그를 시작하게 되었습니다. 이 공간을 통해 기술적인 지식뿐만 아니라, 저의 성장 과정과 생각들을 꾸준히 기록해 나가려고 합니다. 앞으로 많은 관심과 응원 부탁드립니다.\n\n상세 페이지에서는 이렇게 여러 단락의 글을 보여줄 수 있습니다. 마크다운을 파싱하여 HTML로 변환하는 라이브러리를 사용하면 더 풍부한 콘텐츠를 표현할 수도 있습니다.'
    },
    {
        id: 2,
        date: '2025년 10월 10일',
        title: 'Tailwind CSS가 생산성을 높여주는 이유',
        content: '최근 많은 프로젝트에서 Tailwind CSS를 사용하고 있습니다. 유틸리티-우선 접근 방식이 어떻게 기존의 CSS 방법론보다 더 빠르고 일관성 있는 UI 개발을 가능하게 하는지에 대한 제 경험을 공유합니다.'
    },
    {
        id: 3,
        date: '2025년 10월 5일',
        title: '2025년, 주목해야 할 JavaScript 프레임워크',
        content: 'JavaScript 생태계는 끊임없이 변화하고 발전합니다. React, Vue, Svelte를 넘어 새롭게 등장하고 있는 차세대 프레임워크들은 어떤 특징을 가지고 있으며, 어떤 문제를 해결하고자 하는지 알아보겠습니다.'
    },
    {
        id: 4,
        date: '2025년 9월 28일',
        title: 'CSS Grid vs Flexbox: 언제 무엇을 써야할까?',
        content: 'CSS 레이아웃을 다룰 때 가장 강력한 두 도구, Grid와 Flexbox. 이 둘의 차이점은 무엇이며, 각각 어떤 상황에 사용하는 것이 가장 효과적인지 예제와 함께 자세히 살펴봅니다.'
    }
];

// 아티클 요약 컴포넌트
const Article = ({ post, onPostSelect }) => (
    <article>
        <p className="text-slate-500 text-sm mb-2">{post.date}</p>
        <h3 className="text-xl sm:text-2xl font-bold mb-3 text-slate-900">
            <a href="#" onClick={(e) => { e.preventDefault(); onPostSelect(post); }} className="hover:text-blue-600">
                {post.title}
            </a>
        </h3>
        <p className="text-slate-700 leading-relaxed max-w-2xl">
            {post.content.substring(0, 150)}{post.content.length > 150 && '...'}
        </p>
    </article>
);

// 아티클 상세 페이지 컴포넌트
const PostDetail = ({ post, onBack }) => (
    <section className="animate-fadeIn">
        <button onClick={onBack} className="text-blue-600 font-semibold hover:underline mb-8 transition-all duration-300">
            &larr; 목록으로 돌아가기
        </button>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">{post.title}</h1>
        <p className="text-slate-500 text-sm mb-8">{post.date}</p>
        <div className="prose max-w-none text-slate-700 leading-relaxed space-y-4">
            {post.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
        </div>
    </section>
);


// 헤더 컴포넌트
const Header = ({ activePage, setActivePage, onResetView }) => {
    const navItems = ['home', 'blog', 'about'];
    const navDisplay = {'home': '홈', 'blog': '블로그', 'about': '소개'};

    const handleNavClick = (item) => {
        onResetView(); // 상세 페이지에서 다른 탭으로 이동 시 목록으로 리셋
        setActivePage(item);
    };

    return (
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-6 gap-4 sm:gap-0">
            <h1 className="text-2xl font-bold text-slate-900 cursor-pointer" onClick={() => handleNavClick('home')}>Lee Junyeol</h1>
            <nav>
                <ul className="flex items-center space-x-6 sm:space-x-8">
                    {navItems.map(item => (
                        <li key={item}>
                            <a 
                                href="#" 
                                onClick={(e) => { e.preventDefault(); handleNavClick(item); }}
                                className={`hover:text-slate-900 transition-colors duration-300 ${activePage === item ? 'text-slate-900 font-semibold' : 'text-slate-600'}`}
                            >
                                {navDisplay[item]}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
};

// 홈 컴포넌트 (최근 아티클)
const Home = ({ setActivePage, onPostSelect }) => (
    <section id="home" className="animate-fadeIn">
        <h2 className="text-xl sm:text-2xl font-bold mb-8 text-slate-900">최근 아티클</h2>
        <div className="space-y-10">
            {posts.slice(0, 3).map(post => <Article key={post.id} post={post} onPostSelect={onPostSelect} />)}
        </div>
        <div className="mt-12 text-center">
            <a href="#" onClick={(e) => {e.preventDefault(); setActivePage('blog')}} className="text-blue-600 font-semibold hover:underline">
                모든 아티클 보기 &rarr;
            </a>
        </div>
    </section>
);

// 블로그 컴포넌트 (모든 아티클)
const Blog = ({ onPostSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section id="blog" className="animate-fadeIn">
            <div className="mb-12">
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="아티클 검색..." 
                        className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        value={searchTerm}
                    />
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                </div>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold mb-8 text-slate-900">모든 아티클</h2>
            <div className="space-y-10">
                {filteredPosts.length > 0 ? (
                    filteredPosts.map(post => (
                        <article key={post.id} className="border-b border-slate-200 pb-10 last:border-b-0 last:pb-0">
                            <Article post={post} onPostSelect={onPostSelect} />
                        </article>
                    ))
                ) : (
                    <p className="text-slate-600">검색 결과가 없습니다.</p>
                )}
            </div>
        </section>
    );
};

// 소개 컴포넌트
const About = () => (
    <section id="about" className="animate-fadeIn">
        <div className="space-y-12">
            <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900 border-b pb-2">소개</h2>
                <p className="text-slate-700 leading-relaxed">
                    안녕하세요, 저는 이준열입니다. 열정적인 웹 개발자이자 기술 애호가로서, 현대적이고 사용자 친화적인 애플리케이션을 만들고 지식을 커뮤니티와 공유하는 것을 좋아합니다.
                </p>
                <p className="text-slate-700 leading-relaxed mt-4">
                    이 블로그는 웹 개발, 프로그래밍, 그리고 최신 기술 트렌드에 대해 작성하는 공간입니다. 개발자들이 기술을 향상시키고 끊임없이 진화하는 기술 환경에 대해 최신 정보를 유지할 수 있도록 돕는 콘텐츠를 만드는 것이 제 목표입니다.
                </p>
            </div>
            <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900 border-b pb-2">주요 주제</h2>
                <ul className="list-disc list-inside space-y-2 text-slate-700">
                    <li>웹 개발 (React, TypeScript, Tailwind CSS)</li>
                    <li>소프트웨어 아키텍처 & 모범 사례</li>
                    <li>개발자 도구 & 생산성</li>
                    <li>오픈 소스 프로젝트</li>
                </ul>
            </div>
            <div>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-slate-900 border-b pb-2">연락하기</h2>
                <p className="text-slate-700 leading-relaxed">
                    질문이 있거나, 협업하고 싶거나, 그냥 인사하고 싶으시다면 언제든지 연락 주세요!
                </p>
                <ul className="mt-4 space-y-2 text-slate-700">
                    <li>이메일: <a href="mailto:hello@example.com" className="text-blue-600 hover:underline">hello@example.com</a></li>
                    <li>GitHub: <a href="#" className="text-blue-600 hover:underline">@leejunyeol</a></li>
                    <li>Twitter: <a href="#" className="text-blue-600 hover:underline">@leejunyeol</a></li>
                </ul>
            </div>
        </div>
    </section>
);

// 푸터 컴포넌트
const Footer = () => (
    <footer className="text-center mt-20 py-8 border-t border-slate-200 text-slate-500">
        <p>&copy; 2025 Lee Junyeol. All Rights Reserved.</p>
    </footer>
);


// 메인 앱 컴포넌트
export default function App() {
    const [activePage, setActivePage] = useState('home');
    const [selectedPost, setSelectedPost] = useState(null);

    const handlePostSelect = (post) => {
        setSelectedPost(post);
    };
    
    const handleBackToList = () => {
        setSelectedPost(null);
    };

    const renderContent = () => {
        if (selectedPost) {
            return <PostDetail post={selectedPost} onBack={handleBackToList} />;
        }

        switch (activePage) {
            case 'home':
                return <Home setActivePage={setActivePage} onPostSelect={handlePostSelect} />;
            case 'blog':
                return <Blog onPostSelect={handlePostSelect} />;
            case 'about':
                return <About />;
            default:
                return <Home setActivePage={setActivePage} onPostSelect={handlePostSelect} />;
        }
    };

    return (
        <div className="bg-white text-slate-800" style={{ fontFamily: "'Inter', 'Noto Sans KR', sans-serif" }}>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-out;
                }
            `}</style>
            <div className="container mx-auto max-w-3xl px-4 py-8">
                <Header 
                    activePage={activePage} 
                    setActivePage={setActivePage}
                    onResetView={handleBackToList}
                />
                <hr className="border-slate-200 mb-12" />
                <main>
                    {renderContent()}
                </main>
                <Footer />
            </div>
        </div>
    );
}

