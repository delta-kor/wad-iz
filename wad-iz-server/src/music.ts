import Lyrics from './lyrics';
const Musics = new Map<string, Music>();

export default class MusicBase {
  public static Musics = Musics;

  public static pick(): Music {
    const musics = Array.from(Musics.values());
    const item = musics[Math.floor(Math.random() * musics.length)];
    return item;
  }

  public static pickMultiple(count: number, except: string): Music[] {
    const musics = Array.from(Musics.values()).filter(music => music.id !== except);
    const items: Music[] = [];
    for (let i = 0; i < count; i++) {
      const item = musics[Math.floor(Math.random() * musics.length)];
      items.push(item);
    }
    return items;
  }
}

const ALBUM_COLOR_IZ: Album = {
  title: 'COLOR*IZ',
  imageUrl: 'http://lt2.kr/image/album/coloriz.png',
};

const ALBUM_HEART_IZ: Album = {
  title: 'HEART*IZ',
  imageUrl: 'http://lt2.kr/image/album/heartiz.png',
};

const ALBUM_BLOOM_IZ: Album = {
  title: 'BLOOM*IZ',
  imageUrl: 'http://lt2.kr/image/album/bloomiz.png',
};

Musics.set('colors', {
  id: 'e6bs8v5vLko',
  title: '아름다운 색',
  album: ALBUM_COLOR_IZ,
  lyrics: Lyrics.get('colors')!,
  length: 218,
});

Musics.set('o_my', {
  id: 'M0E-mgj7Mvg',
  title: "O' My!",
  album: ALBUM_COLOR_IZ,
  lyrics: Lyrics.get('o_my')!,
  length: 203,
});

Musics.set('la_vie_en_rose', {
  id: 'S3Q966mgeSc',
  title: '라비앙로즈',
  album: ALBUM_COLOR_IZ,
  lyrics: Lyrics.get('la_vie_en_rose')!,
  length: 219,
});

Musics.set('memory', {
  id: 'YkJifnrEVnI',
  title: '비밀의 시간',
  album: ALBUM_COLOR_IZ,
  lyrics: Lyrics.get('memory')!,
  length: 203,
});

Musics.set('we_together', {
  id: '2liouJt4lRY',
  title: '앞으로 잘 부탁해',
  album: ALBUM_COLOR_IZ,
  lyrics: Lyrics.get('we_together')!,
  length: 226,
});

Musics.set('crush_on_you', {
  id: 'ducSFjki1a4',
  title: '好きになっちゃうだろう？',
  subtitle: '반해버리잖아?',
  album: ALBUM_COLOR_IZ,
  lyrics: Lyrics.get('crush_on_you')!,
  length: 249,
});

Musics.set('in_our_dreams', {
  id: '6shHDae9We4',
  title: '꿈을 꾸는 동안',
  album: ALBUM_COLOR_IZ,
  lyrics: Lyrics.get('in_our_dreams')!,
  length: 209,
});

Musics.set('pick_me', {
  id: 'UrdA9YHrmQs',
  title: '내꺼야',
  album: ALBUM_COLOR_IZ,
  lyrics: Lyrics.get('pick_me')!,
  length: 279,
});
