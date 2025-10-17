import { getPosts, getSinglePost, getPostContent } from '@/lib/notion';
import Link from 'next/link';

// 빌드 시점에 모든 포스트의 id를 미리 생성하도록 Next.js에 알려줍니다.
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map(post => ({
    id: post.id,
  }));
}

// Notion 블록을 렌더링하는 컴포넌트
const RenderBlock = ({ block }) => {
  const { type, id } = block;
  const value = block[type];

  switch (type) {
    case 'paragraph':
      return (
        <p className="my-4 text-slate-700 leading-relaxed">
          {value.rich_text.map((text, i) => <span key={i}>{text.plain_text}</span>)}
        </p>
      );
    case 'heading_2':
      return (
        <h2 className="text-2xl font-bold my-6 text-slate-800">
          {value.rich_text.map((text, i) => <span key={i}>{text.plain_text}</span>)}
        </h2>
      );
    case 'heading_3':
      return (
        <h3 className="text-xl font-bold my-5 text-slate-800">
          {value.rich_text.map((text, i) => <span key={i}>{text.plain_text}</span>)}
        </h3>
      );
    case 'bulleted_list_item':
    case 'numbered_list_item':
      return (
        <li className="my-1 ml-6 text-slate-700">
          {value.rich_text.map((text, i) => <span key={i}>{text.plain_text}</span>)}
        </li>
      );
    default:
      return <p>지원하지 않는 블록 유형입니다: {type}</p>;
  }
};

// 게시물 상세 페이지
export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getSinglePost(params.id);
  const content = await getPostContent(params.id);

  if (!post) {
    return <div>게시물을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8 bg-white">
      <Link href="/" className="text-blue-600 font-semibold hover:underline mb-8 inline-block transition-all duration-300">
        &larr; 목록으로 돌아가기
      </Link>
      <article>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">{post.title}</h1>
        <p className="text-slate-500 text-sm mb-8">{post.date}</p>
        <section>
          {content.map(block => (
            <RenderBlock key={block.id} block={block} />
          ))}
        </section>
      </article>
    </div>
  );
}
