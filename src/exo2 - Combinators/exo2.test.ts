import { either, option } from 'fp-ts';
import {
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
} from './exo2';

describe('exo2', () => {
  describe('checkAttackerAndSmash', () => {
    it('should return a NoAttacker error if no attacker is selected', () => {
      const result = checkAttackerAndSmash(option.none);
      const expected = either.left(
        noAttackerFailure('No attacker currently selected'),
      );

      expect(result).toStrictEqual(expected);
    });

    it('should return an InvalidAttacker error if the wrong attacker is selected', () => {
      const archer = new Archer();
      const resultArcher = checkAttackerAndSmash(option.some(archer));
      const expectedArcher = either.left(
        invalidAttackerFailure('Archer cannot perform smash'),
      );

      const wizard = new Wizard();
      const resultWizard = checkAttackerAndSmash(option.some(wizard));
      const expectedWizard = either.left(
        invalidAttackerFailure('Wizard cannot perform smash'),
      );

      expect(resultArcher).toStrictEqual(expectedArcher);

      expect(resultWizard).toStrictEqual(expectedWizard);
    });

    it('should return the proper type of damage', () => {
      const warrior = new Warrior();
      const result = checkAttackerAndSmash(option.some(warrior));
      const expected = either.right(Damage.Physical);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('checkAttackerAndBurn', () => {
    it('should return a NoAttacker error if no attacker is selected', () => {
      const result = checkAttackerAndBurn(option.none);
      const expected = either.left(
        noAttackerFailure('No attacker currently selected'),
      );

      expect(result).toStrictEqual(expected);
    });

    it('should return an InvalidAttacker error if the wrong attacker is selected', () => {
      const warrior = new Warrior();
      const resultWarrior = checkAttackerAndBurn(option.some(warrior));
      const expectedWarrior = either.left(
        invalidAttackerFailure('Warrior cannot perform burn'),
      );

      const archer = new Archer();
      const resultArcher = checkAttackerAndBurn(option.some(archer));
      const expectedArcher = either.left(
        invalidAttackerFailure('Archer cannot perform burn'),
      );

      expect(resultWarrior).toStrictEqual(expectedWarrior);

      expect(resultArcher).toStrictEqual(expectedArcher);
    });

    it('should return the proper type of damage', () => {
      const wizard = new Wizard();
      const result = checkAttackerAndBurn(option.some(wizard));
      const expected = either.right(Damage.Magical);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('checkAttackerAndShoot', () => {
    it('should return a NoAttacker error if no attacker is selected', () => {
      const result = checkAttackerAndShoot(option.none);
      const expected = either.left(
        noAttackerFailure('No attacker currently selected'),
      );

      expect(result).toStrictEqual(expected);
    });

    it('should return an InvalidAttacker error if the wrong attacker is selected', () => {
      const warrior = new Warrior();
      const resultWarrior = checkAttackerAndShoot(option.some(warrior));
      const expectedWarrior = either.left(
        invalidAttackerFailure('Warrior cannot perform shoot'),
      );

      const wizard = new Wizard();
      const resultWizard = checkAttackerAndShoot(option.some(wizard));
      const expectedWizard = either.left(
        invalidAttackerFailure('Wizard cannot perform shoot'),
      );

      expect(resultWarrior).toStrictEqual(expectedWarrior);

      expect(resultWizard).toStrictEqual(expectedWizard);
    });

    it('should return the proper type of damage', () => {
      const archer = new Archer();
      const result = checkAttackerAndShoot(option.some(archer));
      const expected = either.right(Damage.Ranged);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('smashOption', () => {
    it('should return option.none if the character is of the wrong type', () => {
      const wizard = new Wizard();
      const archer = new Archer();

      const resultWizard = smashOption(wizard);
      const resultArcher = smashOption(archer);

      const expected = option.none;

      expect(resultWizard).toStrictEqual(expected);
      expect(resultArcher).toStrictEqual(expected);
    });

    it('should return option.some(Damage.Physical) if the character is a warrior', () => {
      const warrior = new Warrior();

      const result = smashOption(warrior);
      const expected = option.some(Damage.Physical);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('burnOption', () => {
    it('should return option.none if the character is of the wrong type', () => {
      const warrior = new Warrior();
      const archer = new Archer();

      const resultWarrior = burnOption(warrior);
      const resultArcher = burnOption(archer);

      const expected = option.none;

      expect(resultWarrior).toStrictEqual(expected);
      expect(resultArcher).toStrictEqual(expected);
    });

    it('should return option.some(Damage.Magical) if the character is a wizard', () => {
      const wizard = new Wizard();

      const result = burnOption(wizard);
      const expected = option.some(Damage.Magical);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('shootOption', () => {
    it('should return option.none if the character is of the wrong type', () => {
      const warrior = new Warrior();
      const wizard = new Wizard();

      const resultWizard = shootOption(wizard);
      const resultWarrior = shootOption(warrior);

      const expected = option.none;

      expect(resultWarrior).toStrictEqual(expected);
      expect(resultWizard).toStrictEqual(expected);
    });

    it('should return option.some(Damage.Ranged) if the character is an archer', () => {
      const archer = new Archer();

      const result = shootOption(archer);
      const expected = option.some(Damage.Ranged);

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
