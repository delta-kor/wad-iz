export class Transform {
  public static round(number: number, to: number): string {
    return parseFloat(number.toString()).toFixed(to);
  }

  public static reverse(string: string): string {
    return string.split('').reverse().join('');
  }

  public static addComma(number: number): string {
    return number.toLocaleString('en-US');
  }

  public static toLocaleNumber(number: number): string {
    const string = number.toString();
    const reversed = Transform.reverse(string);
    const chips = [];
    let chip = '';
    for (const char of reversed) {
      chip = char + chip;
      if (chip.length === 4) {
        chips.push(chip);
        chip = '';
      }
    }
    if (chip) chips.push(chip);
    let result = '';
    let index = 0;
    const chars = ['', '만 ', '억 ', '조 ', '경 ', '해 '];
    for (const sector of chips) {
      const number = parseInt(sector);
      if (!number) {
        index++;
        continue;
      }
      result = number + chars[index] + result;
      index++;
    }
    return result;
  }

  public static toCurrency(number: number): string {
    return Transform.addComma(number) + ' ₩';
  }

  public static toCurrencyDelta(delta: number): string {
    return `${delta < 0 ? '-' : '+'} ${Transform.toCurrency(Math.abs(delta))}`;
  }

  public static toCurrencyLocaleNumber(number: number): string {
    return Transform.toLocaleNumber(number) + ' 원';
  }

  public static toSupporterText(number: number): string {
    return `${Transform.addComma(number)} 명 참여`;
  }

  public static toDayText(number: number): string {
    if (number > 6) {
      number = number % 7;
    }
    if (number < 0) {
      number = 7 - (8 - (number & 7));
    }
    return ['일', '월', '화', '수', '목', '금', '토'][number];
  }

  public static toTimeHistoryText(second: number): string {
    second = Math.round(second);
    if (second < 10) return '방금';
    if (second < 60) return second + '초 전';
    if (second < 3600) return Math.round(second / 60) + '분 전';
    return Math.round(second / 3600) + '시간 전';
  }
}
