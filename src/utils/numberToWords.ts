/**
 * Converts a numeric amount into standard Bangladeshi Taka in words.
 * Examples:
 *   200000 -> "Two Lakh Taka Only"
 *   2500000 -> "Twenty-Five Lakh Taka Only"
 *   15000000 -> "One Crore Fifty Lakh Taka Only"
 *   35000 -> "Thirty-Five Thousand Taka Only"
 */
export function numberToTakaWords(num: number): string {
  if (num === 0) return 'Zero Taka Only';
  if (num < 0) return 'Negative ' + numberToTakaWords(Math.abs(num));

  const ones = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];

  const tens = [
    '',
    '',
    'Twenty',
    'Thirty',
    'Forty',
    'Fifty',
    'Sixty',
    'Seventy',
    'Eighty',
    'Ninety',
  ];

  function convertBelowThousand(n: number): string {
    let str = '';
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n > 0) {
      if (n < 20) {
        str += ones[n] + ' ';
      } else {
        const t = Math.floor(n / 10);
        const o = n % 10;
        str += tens[t] + (o > 0 ? '-' + ones[o] : '') + ' ';
      }
    }
    return str.trim();
  }

  let crore = Math.floor(num / 10000000);
  num %= 10000000;
  let lakh = Math.floor(num / 100000);
  num %= 100000;
  let thousand = Math.floor(num / 1000);
  let remainder = num % 1000;

  let parts: string[] = [];

  if (crore > 0) {
    parts.push(convertBelowThousand(crore) + ' Crore');
  }
  if (lakh > 0) {
    parts.push(convertBelowThousand(lakh) + ' Lakh');
  }
  if (thousand > 0) {
    parts.push(convertBelowThousand(thousand) + ' Thousand');
  }
  if (remainder > 0) {
    parts.push(convertBelowThousand(remainder));
  }

  const result = parts.join(' ').trim();
  return (result ? result : 'Zero') + ' Taka Only';
}

export function formatBDT(amount: number): string {
  return new Intl.NumberFormat('en-IN').format(amount);
}
