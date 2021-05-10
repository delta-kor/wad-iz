type Sfx =
  | 'chat_clear'
  | 'chat_send'
  | 'fund_big'
  | 'fund_minus'
  | 'fund_small'
  | 'fund_zero'
  | 'navigator'
  | 'swipe';

const audio = new Audio();

export default function playSfx(type: Sfx): void {
  audio.pause();
  audio.src = `/pu/sfx/${type}.m4a`;
  audio.play();
}
