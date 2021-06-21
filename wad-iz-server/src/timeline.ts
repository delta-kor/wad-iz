import TimelineData from './data/timeline.json';
import crypto from 'crypto';

function hash(content: string): string {
  const hasher = crypto.createHash('md5');
  hasher.update(content);
  const hash = hasher.digest();
  return hash.toString('hex').substr(0, 8);
}

export default class Timeline {
  static getList(): TimelineItem[] {
    const result: TimelineItem[] = [];
    for (const data of TimelineData) {
      if (data.action === 'url')
        result.push({
          type: data.type,
          date: data.date,
          title: data.title,
          description: data.description,
          action: data.action,
          url: data.url!,
        });
      if (data.action === 'article')
        result.push({
          type: data.type,
          date: data.date,
          title: data.title,
          description: data.description,
          action: data.action,
          content_id: hash(data.content!),
        });
    }
    return result;
  }

  static getContent(id: string): string | null {
    for (const data of TimelineData) {
      if (!data.content) continue;
      if (hash(data.content) === id) return data.content;
    }
    return null;
  }
}
