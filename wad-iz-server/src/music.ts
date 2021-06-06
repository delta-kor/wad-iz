import Lyrics from 'lyrics';

const Musics = new Map<string, Music>();

const ALBUM_COLOR_IZ: Album = {
  title: 'COLOR*IZ',
  imageUrl: 'http://lt2.kr/image/album/coloriz',
};

const ALBUM_HEART_IZ: Album = {
  title: 'HEART*IZ',
  imageUrl: 'http://lt2.kr/image/album/heartiz',
};

const ALBUM_BLOOM_IZ: Album = {
  title: 'BLOOM*IZ',
  imageUrl: 'http://lt2.kr/image/album/bloomiz',
};

Musics.set('colors', {
  title: '아름다운 색',
  album: ALBUM_COLOR_IZ,
  lyrics: Lyrics.get('colors')!,
});

Musics.set('o_my', {
  title: "O' My!",
  album: ALBUM_COLOR_IZ,
  lyrics: Lyrics.get('o_my')!,
});

Musics.set('la_vie_en_rose', {
  title: '라비앙로즈',
  album: ALBUM_COLOR_IZ,
  lyrics: Lyrics.get('la_vie_en_rose')!,
});

Musics.set('memory', {
  title: '비밀의 시간',
  album: ALBUM_COLOR_IZ,
  lyrics: Lyrics.get('memory')!,
});

Musics.set('we_together', {
  title: '앞으로 잘 부탁해',
  album: ALBUM_COLOR_IZ,
  lyrics: Lyrics.get('we_together')!,
});

Musics.set('crush_on_you', {
  title: '好きになっちゃうだろう？',
  subtitle: '반해버리잖아?',
  album: ALBUM_COLOR_IZ,
  lyrics: Lyrics.get('crush_on_you')!,
});

Musics.set('in_our_dreams', {
  title: '꿈을 꾸는 동안',
  album: ALBUM_COLOR_IZ,
  lyrics: Lyrics.get('in_our_dreams')!,
});

Musics.set('pick_me', {
  title: '내꺼야',
  album: ALBUM_COLOR_IZ,
  lyrics: Lyrics.get('pick_me')!,
});
