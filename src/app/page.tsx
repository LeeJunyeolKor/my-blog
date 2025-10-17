import React from 'react';
import { getPosts } from '@/lib/notion';

// 각 컴포넌트는 별도의 파일로 분리하는 것이 좋습니다.
const Header = () => {
    const navItems = ['home', 'blog', 'about'];
    const navDisplay = {'home': '홈', 'blog': '블로그', 'about': '소개'};

    return (
        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-6 gap-4 sm:gap-0">
            <h1 className="text-2xl font-bold text-slate-900 cursor-pointer">Lee Junyeol</h1>
            <nav>
                <ul className="flex items-center space-x-6 sm:space-x-8">
                    {navItems.map(item => (
                        <li key={item}>
                            <a 
                                href="#" 
                                className={`hover:text-slate-900 transition-colors duration-300 text-slate-600`}
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

import Link from 'next/link';

// ... (Header, Footer 컴포넌트는 동일)

const Article = ({ post }) => (
    <article>
        <p className="text-slate-500 text-sm mb-2">{post.date}</p>
        <h3 className="text-xl sm:text-2xl font-bold mb-3 text-slate-900">
            <Link href={`/posts/${post.id}`} className="hover:text-blue-600">
                {post.title}
            </Link>
        </h3>
        {/* 상세 콘텐츠 로딩은 추후 구현 필요 */}
    </article>
);

const Footer = () => (
    <footer className="text-center mt-20 py-8 border-t border-slate-200 text-slate-500">
        <p>&copy; 2025 Lee Junyeol. All Rights Reserved.</p>
    </footer>
);

// 메인 페이지 컴포넌트
export default async function HomePage() {
    const posts = await getPosts();

    return (
        <div className="bg-white text-slate-800" style={{ fontFamily: "'Inter', 'Noto Sans KR', sans-serif" }}>
            <div className="container mx-auto max-w-3xl px-4 py-8">
                <Header />
                <hr className="border-slate-200 mb-12" />
                <main>
                    <section id="home">
                        <h2 className="text-xl sm:text-2xl font-bold mb-8 text-slate-900">최근 아티클</h2>
                        <div className="space-y-10">
                            {posts.slice(0, 3).map(post => <Article key={post.id} post={post} />)}
                        </div>
                        <div className="mt-12 text-center">
                            <a href="#" className="text-blue-600 font-semibold hover:underline">
                                모든 아티클 보기 &rarr;
                            </a>
                        </div>
                    </section>
                </main>
                <Footer />
            </div>
        </div>
    );
}