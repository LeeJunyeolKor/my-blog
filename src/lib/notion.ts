// fetch를 사용하여 Notion API 직접 호출
export const getPosts = async () => {
  const databaseId = process.env.NOTION_DATABASE_ID;
  const notionKey = process.env.NOTION_KEY;

  if (!databaseId || !notionKey) {
    console.error('Notion API 키 또는 데이터베이스 ID가 설정되지 않았습니다.');
    return [];
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filter: {
          property: '발행',
          checkbox: {
            equals: true,
          },
        },
        sorts: [
          {
            property: '날짜',
            direction: 'descending',
          },
        ],
      }),
      // Next.js 15.5.6의 fetch 캐싱 기능을 비활성화하여 항상 최신 데이터를 가져옴
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Notion API 응답 오류:', errorData);
      return [];
    }

    const data = await response.json();

    const posts = data.results.map(page => {
      if (!('properties' in page)) {
        return null;
      }

      const titleProperty = page.properties.페이지;
      const dateProperty = page.properties.날짜;

      const title = titleProperty.type === 'title' ? titleProperty.title[0]?.plain_text : '';
      const date = dateProperty.type === 'date' ? dateProperty.date?.start : '';
      
      return {
        id: page.id,
        date: date,
        title: title,
        content: ''
      };
    }).filter(post => post !== null);

    return posts;

  } catch (error) {
    console.error('Notion API에서 데이터를 가져오는 중 오류 발생:', error);
    return [];
  }
};