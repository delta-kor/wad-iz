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

  public static toCurrencyLocaleNumber(number: number): string {
    return Transform.toLocaleNumber(number) + ' 원';
  }
}
