import { Country, exclamation, greet, excitedlyGreet } from './exo4.problem';

describe('exo4', () => {
  describe('greet', () => {
    it('should greet Alice in french', () => {
      const result = greet('Alice')(Country.France);

      expect(result).toStrictEqual('Bonjour, Alice');
    });

    it('should greet Bernardo in spanish', () => {
      const result = greet('Bernardo')(Country.Spain);

      expect(result).toStrictEqual('Buenos dìas, Bernardo');
    });

    it('should greet Crystal in english', () => {
      const result = greet('Crystal')(Country.USA);

      expect(result).toStrictEqual('Hello, Crystal');
    });
  });

  describe('exclamation', () => {
    it('should add exclamation in french style (with a space before "!")', () => {
      const result = exclamation('Youpi')(Country.France);

      expect(result).toStrictEqual('Youpi !');
    });

    it('should add exclamation in spanish style (between "¡" and "!")', () => {
      const result = exclamation('Olé')(Country.Spain);

      expect(result).toStrictEqual('¡Olé!');
    });

    it('should add exclamation in english style (with no space before "!")', () => {
      const result = exclamation('Yeah')(Country.USA);

      expect(result).toStrictEqual('Yeah!');
    });
  });

  describe('excitedlyGreet', () => {
    it('should excitedly greet Alice in french', () => {
      const result = excitedlyGreet('Alice')(Country.France);

      expect(result).toStrictEqual('Bonjour, Alice !');
    });

    it('should excitedly greet Bernardo in spanish', () => {
      const result = excitedlyGreet('Bernardo')(Country.Spain);

      expect(result).toStrictEqual('¡Buenos dìas, Bernardo!');
    });

    it('should excitedly greet Crystal in english', () => {
      const result = excitedlyGreet('Crystal')(Country.USA);

      expect(result).toStrictEqual('Hello, Crystal!');
    });
  });
});
