import { RationalFraction } from './types';

export class Fraction {
  numerator: number;
  denominator: number;

  constructor(numerator: number, denominator: number = 1) {
    if (denominator === 0) {
      throw new Error('Denominator cannot be zero.');
    }
    const gcdVal = Fraction.gcd(Math.abs(numerator), Math.abs(denominator));
    const sign = (numerator * denominator < 0) ? -1 : 1;
    this.numerator = sign * (Math.abs(numerator) / gcdVal);
    this.denominator = Math.abs(denominator) / gcdVal;
  }

  static gcd(a: number, b: number): number {
    a = Math.round(a);
    b = Math.round(b);
    while (b !== 0) {
      const temp = b;
      b = a % b;
      a = temp;
    }
    return a === 0 ? 1 : a;
  }

  static lcm(a: number, b: number): number {
    if (a === 0 || b === 0) return 0;
    return Math.abs(Math.round(a * b)) / Fraction.gcd(a, b);
  }

  add(other: Fraction): Fraction {
    const commonDenominator = Fraction.lcm(this.denominator, other.denominator);
    const num1 = this.numerator * (commonDenominator / this.denominator);
    const num2 = other.numerator * (commonDenominator / other.denominator);
    return new Fraction(num1 + num2, commonDenominator);
  }

  subtract(other: Fraction): Fraction {
    const commonDenominator = Fraction.lcm(this.denominator, other.denominator);
    const num1 = this.numerator * (commonDenominator / this.denominator);
    const num2 = other.numerator * (commonDenominator / other.denominator);
    return new Fraction(num1 - num2, commonDenominator);
  }

  multiply(other: Fraction | number): Fraction {
    if (typeof other === 'number') {
      return new Fraction(this.numerator * other, this.denominator);
    }
    return new Fraction(this.numerator * other.numerator, this.denominator * other.denominator);
  }

  divide(divisor: number): Fraction {
    if (divisor === 0) throw new Error('Cannot divide fraction by 0');
    return new Fraction(this.numerator, this.denominator * divisor);
  }

  toDecimal(): number {
    return this.numerator / this.denominator;
  }

  toString(): string {
    if (this.denominator === 1) return `${this.numerator}`;
    return `${this.numerator}/${this.denominator}`;
  }

  toRational(): RationalFraction {
    return {
      numerator: this.numerator,
      denominator: this.denominator,
    };
  }
}
