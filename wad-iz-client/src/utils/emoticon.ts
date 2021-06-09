export function getEmoticonUrlByKey(emoticon: EmoticonSet[], key: string): string | null {
  for (const set of emoticon) {
    for (const con of set.cons) {
      if (con.key === key) return con.url;
    }
  }
  return null;
}

export function getEmoticonsFromSet(emotion: EmoticonSet[], set: string): Emoticon[] {
  for (const item of emotion) {
    if (item.title === set) return item.cons;
  }
  return [];
}
