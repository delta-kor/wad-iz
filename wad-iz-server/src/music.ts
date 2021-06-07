import MusicData from './data/music.json';

const Musics = new Map<string, Music>();

export default class MusicBase {
  public static Musics = Musics;

  public static pick(): Music {
    const musics = Array.from(Musics.values());
    const item = musics[Math.floor(Math.random() * musics.length)];
    return item;
  }

  public static pickMultiple(count: number, except: string): Music[] {
    let musics = Array.from(Musics.values()).filter(music => music.id !== except);
    const items: Music[] = [];
    for (let i = 0; i < count; i++) {
      const item = musics[Math.floor(Math.random() * musics.length)];
      items.push(item);
      musics = musics.filter(music => music.id !== item.id);
    }
    return items;
  }

  public static simplify(music: Music): Partial<Music> {
    return {
      id: music.id,
      title: music.title,
      subtitle: music.subtitle,
      album: music.album,
    };
  }
}

for (const music of MusicData) {
  const lyrics: any = music.lyrics;
  const lyricsResult: any = {};
  if (lyrics) {
    const keys = Object.keys(lyrics);
    for (const key of keys) {
      lyricsResult[key] = [lyrics[key]];
    }
  }
  Musics.set(music.id, {
    id: music.id,
    title: music.title,
    subtitle: music.subtitle,
    album: music.album,
    lyrics: lyricsResult,
    length: music.length,
  });
}
