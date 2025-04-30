import { Option, Either } from "effect";
import * as solution from './exo2.effect.solution';

const {
  Warrior,
  Wizard,
  Archer,
  Damage,
  noAttackerFailure,
  invalidAttackerFailure,
  checkAttackerAndSmash,
  checkAttackerAndBurn,
  checkAttackerAndShoot,
  smashOption,
  burnOption,
  shootOption,
  attack,
} = solution;

describe('exo2.effect', () => {
  describe('checkAttackerAndSmash', () => {
    it('should return a NoAttacker error if no attacker is selected', () => {
      const result = checkAttackerAndSmash(Option.none());
      const expected = Either.left(
        noAttackerFailure('No attacker currently selected'),
      );

      expect(result).toStrictEqual(expected);
    });

    it('should return an InvalidAttacker error if the wrong attacker is selected', () => {
      const archer = new Archer();
      const resultArcher = checkAttackerAndSmash(Option.some(archer));
      const expectedArcher = Either.left(
        invalidAttackerFailure('Archer cannot perform smash'),
      );

      const wizard = new Wizard();
      const resultWizard = checkAttackerAndSmash(Option.some(wizard));
      const expectedWizard = Either.left(
        invalidAttackerFailure('Wizard cannot perform smash'),
      );

      expect(resultArcher).toStrictEqual(expectedArcher);
      expect(resultWizard).toStrictEqual(expectedWizard);
    });

    it('should return the proper type of damage', () => {
      const warrior = new Warrior();
      const result = checkAttackerAndSmash(Option.some(warrior));
      const expected = Either.right(Damage.Physical);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('checkAttackerAndBurn', () => {
    it('should return a NoAttacker error if no attacker is selected', () => {
      const result = checkAttackerAndBurn(Option.none());
      const expected = Either.left(
        noAttackerFailure('No attacker currently selected'),
      );

      expect(result).toStrictEqual(expected);
    });

    it('should return an InvalidAttacker error if the wrong attacker is selected', () => {
      const warrior = new Warrior();
      const resultWarrior = checkAttackerAndBurn(Option.some(warrior));
      const expectedWarrior = Either.left(
        invalidAttackerFailure('Warrior cannot perform burn'),
      );

      const archer = new Archer();
      const resultArcher = checkAttackerAndBurn(Option.some(archer));
      const expectedArcher = Either.left(
        invalidAttackerFailure('Archer cannot perform burn'),
      );

      expect(resultWarrior).toStrictEqual(expectedWarrior);
      expect(resultArcher).toStrictEqual(expectedArcher);
    });

    it('should return the proper type of damage', () => {
      const wizard = new Wizard();
      const result = checkAttackerAndBurn(Option.some(wizard));
      const expected = Either.right(Damage.Magical);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('checkAttackerAndShoot', () => {
    it('should return a NoAttacker error if no attacker is selected', () => {
      const result = checkAttackerAndShoot(Option.none());
      const expected = Either.left(
        noAttackerFailure('No attacker currently selected'),
      );

      expect(result).toStrictEqual(expected);
    });

    it('should return an InvalidAttacker error if the wrong attacker is selected', () => {
      const warrior = new Warrior();
      const resultWarrior = checkAttackerAndShoot(Option.some(warrior));
      const expectedWarrior = Either.left(
        invalidAttackerFailure('Warrior cannot perform shoot'),
      );

      const wizard = new Wizard();
      const resultWizard = checkAttackerAndShoot(Option.some(wizard));
      const expectedWizard = Either.left(
        invalidAttackerFailure('Wizard cannot perform shoot'),
      );

      expect(resultWarrior).toStrictEqual(expectedWarrior);
      expect(resultWizard).toStrictEqual(expectedWizard);
    });

    it('should return the proper type of damage', () => {
      const archer = new Archer();
      const result = checkAttackerAndShoot(Option.some(archer));
      const expected = Either.right(Damage.Ranged);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('smashOption', () => {
    it('should return Option.none() if the character is of the wrong type', () => {
      const wizard = new Wizard();
      const archer = new Archer();

      const resultWizard = smashOption(wizard);
      const resultArcher = smashOption(archer);

      const expected = Option.none();

      expect(resultWizard).toStrictEqual(expected);
      expect(resultArcher).toStrictEqual(expected);
    });

    it('should return Option.some(Damage.Physical) if the character is a warrior', () => {
      const warrior = new Warrior();

      const result = smashOption(warrior);
      const expected = Option.some(Damage.Physical);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('burnOption', () => {
    it('should return Option.none() if the character is of the wrong type', () => {
      const warrior = new Warrior();
      const archer = new Archer();

      const resultWarrior = burnOption(warrior);
      const resultArcher = burnOption(archer);

      const expected = Option.none();

      expect(resultWarrior).toStrictEqual(expected);
      expect(resultArcher).toStrictEqual(expected);
    });

    it('should return Option.some(Damage.Magical) if the character is a wizard', () => {
      const wizard = new Wizard();

      const result = burnOption(wizard);
      const expected = Option.some(Damage.Magical);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('shootOption', () => {
    it('should return Option.none() if the character is of the wrong type', () => {
      const warrior = new Warrior();
      const wizard = new Wizard();

      const resultWizard = shootOption(wizard);
      const resultWarrior = shootOption(warrior);

      const expected = Option.none();

      expect(resultWarrior).toStrictEqual(expected);
      expect(resultWizard).toStrictEqual(expected);
    });

    it('should return Option.some(Damage.Ranged) if the character is an archer', () => {
      const archer = new Archer();

      const result = shootOption(archer);
      const expected = Option.some(Damage.Ranged);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('attack', () => {
    it('should return the correct number of each type of attacks', () => {
      const warrior = new Warrior();
      const wizard = new Wizard();
      const archer = new Archer();

      const army = [
        warrior,
        wizard,
        archer,
        wizard,
        wizard,
        archer,
        warrior,
        wizard,
        archer,
      ];

      const result = attack(army);
      const expected = {
        [Damage.Physical]: 2,
        [Damage.Magical]: 4,
        [Damage.Ranged]: 3,
      };

      expect(result).toStrictEqual(expected);
    });
  });
}); 