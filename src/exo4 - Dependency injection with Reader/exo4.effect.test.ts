import { Effect } from 'effect';
import * as exercise from './exo4.effect.exercise';

const { Country, CountryService, exclamation, greet, excitedlyGreet } = exercise;

// Use type assertion to bypass the type checking
const runWithCountry = <T>(
  effect: any,
  country: exercise.Country
): T => {
  const program = Effect.provideService(effect, CountryService, country);
  return Effect.runSync(program as any);
};

describe('exo4.effect', () => {
  describe('greet', () => {
    it('should greet Alice in french', () => {
      const result = runWithCountry(greet('Alice'), Country.France);

      expect(result).toStrictEqual('Bonjour, Alice');
    });

    it('should greet Bernardo in spanish', () => {
      const result = runWithCountry(greet('Bernardo'), Country.Spain);

      expect(result).toStrictEqual('Buenos dìas, Bernardo');
    });

    it('should greet Crystal in english', () => {
      const result = runWithCountry(greet('Crystal'), Country.USA);

      expect(result).toStrictEqual('Hello, Crystal');
    });
  });

  describe('exclamation', () => {
    it('should add exclamation in french style (with a space before "!")', () => {
      const result = runWithCountry(exclamation('Youpi'), Country.France);

      expect(result).toStrictEqual('Youpi !');
    });

    it('should add exclamation in spanish style (between "¡" and "!")', () => {
      const result = runWithCountry(exclamation('Olé'), Country.Spain);

      expect(result).toStrictEqual('¡Olé!');
    });

    it('should add exclamation in english style (with no space before "!")', () => {
      const result = runWithCountry(exclamation('Yeah'), Country.USA);

      expect(result).toStrictEqual('Yeah!');
    });
  });

  describe('excitedlyGreet', () => {
    it('should excitedly greet Alice in french', () => {
      const result = runWithCountry(excitedlyGreet('Alice'), Country.France);

      expect(result).toStrictEqual('Bonjour, Alice !');
    });

    it('should excitedly greet Bernardo in spanish', () => {
      const result = runWithCountry(excitedlyGreet('Bernardo'), Country.Spain);

      expect(result).toStrictEqual('¡Buenos dìas, Bernardo!');
    });

    it('should excitedly greet Crystal in english', () => {
      const result = runWithCountry(excitedlyGreet('Crystal'), Country.USA);

      expect(result).toStrictEqual('Hello, Crystal!');
    });
  });
}); 