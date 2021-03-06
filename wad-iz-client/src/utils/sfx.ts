type Sfx =
  | 'chat_bottom'
  | 'chat_clear'
  | 'chat_send'
  | 'collapse'
  | 'expand'
  | 'fund_big'
  | 'fund_minus'
  | 'fund_small'
  | 'fund_super_big'
  | 'instagram'
  | 'navigator'
  | 'swipe';

const audio = new Audio();

export default function playSfx(type: Sfx): void {
  audio.pause();
  audio.src = `/pu/sfx/${type}.m4a`;
  audio.play();
}
