import { either, option } from 'fp-ts';
import {
  Warrior,
  Wizard,
  Archer,
  Damage,
  noTargetFailure,
  invalidTargetFailure,
  checkTargetAndSmash,
  checkTargetAndBurn,
  checkTargetAndShoot,
  smashOption,
  burnOption,
  shootOption,
  attack,
  rank,
  fight,
  maybeFight,
  Army,
} from './exo2';

describe('exo2', () => {
  describe('checkTargetAndSmash', () => {
    it('should return a NoTarget error if no unit is selected', () => {
      const result = checkTargetAndSmash(option.none);
      const expected = either.left(
        noTargetFailure('No unit currently selected'),
      );

      expect(result).toStrictEqual(expected);
    });

    it('should return an InvalidTarget error if the wrong unit is selected', () => {
      const archer = new Archer();
      const resultArcher = checkTargetAndSmash(option.some(archer));
      const expectedArcher = either.left(
        invalidTargetFailure('Archer cannot perform smash'),
      );

      const wizard = new Wizard();
      const resultWizard = checkTargetAndSmash(option.some(wizard));
      const expectedWizard = either.left(
        invalidTargetFailure('Wizard cannot perform smash'),
      );

      expect(resultArcher).toStrictEqual(expectedArcher);

      expect(resultWizard).toStrictEqual(expectedWizard);
    });

    it('should return the proper type of damage', () => {
      const warrior = new Warrior();
      const result = checkTargetAndSmash(option.some(warrior));
      const expected = either.right(Damage.Physical);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('checkTargetAndBurn', () => {
    it('should return a NoTarget error if no unit is selected', () => {
      const result = checkTargetAndBurn(option.none);
      const expected = either.left(
        noTargetFailure('No unit currently selected'),
      );

      expect(result).toStrictEqual(expected);
    });

    it('should return an InvalidTarget error if the wrong unit is selected', () => {
      const warrior = new Warrior();
      const resultWarrior = checkTargetAndBurn(option.some(warrior));
      const expectedWarrior = either.left(
        invalidTargetFailure('Warrior cannot perform burn'),
      );

      const archer = new Archer();
      const resultArcher = checkTargetAndBurn(option.some(archer));
      const expectedArcher = either.left(
        invalidTargetFailure('Archer cannot perform burn'),
      );

      expect(resultWarrior).toStrictEqual(expectedWarrior);

      expect(resultArcher).toStrictEqual(expectedArcher);
    });

    it('should return the proper type of damage', () => {
      const wizard = new Wizard();
      const result = checkTargetAndBurn(option.some(wizard));
      const expected = either.right(Damage.Magical);

      expect(result).toStrictEqual(expected);
    });
  });

  describe('checkTargetAndShoot', () => {
    it('should return a NoTarget error if no unit is selected', () => {
      const result = checkTargetAndShoot(option.none);
      const expected = either.left(
        noTargetFailure('No unit currently selected'),
      );

      expect(result).toStrictEqual(expected);
    });

    it('should return an InvalidTarget error if the wrong unit is selected', () => {
      const warrior = new Warrior();
      const resultWarrior = checkTargetAndShoot(option.some(warrior));
      const expectedWarrior = either.left(
        invalidTargetFailure('Warrior cannot perform shoot'),
      );

      const wizard = new Wizard();
      const resultWizard = checkTargetAndShoot(option.some(wizard));
      const expectedWizard = either.left(
        invalidTargetFailure('Wizard cannot perform shoot'),
      );

      expect(resultWarrior).toStrictEqual(expectedWarrior);

      expect(resultWizard).toStrictEqual(expectedWizard);
    });

    it('should return the proper type of damage', () => {
      const archer = new Archer();
      const result = checkTargetAndShoot(option.some(archer));
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

  describe('bonus', () => {
    const warrior = new Warrior();
    const wizard = new Wizard();
    const archer = new Archer();
    const army1 = [
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
    const army2 = [warrior, archer, wizard, archer, wizard, archer];
    const emptyArmy: Army = [];

    describe('rank', () => {
      it('should return 0 for an empty army', () => {
        const result = rank(emptyArmy);
        const expected = 0;

        expect(result).toBe(expected);
      });

      it('should return the rank of the army', () => {
        const result = rank(army1);
        const expected = 19;

        expect(result).toBe(expected);
      });
    });

    describe('fight', () => {
      it('should return the id of the stronger army', () => {
        const result = fight(army1)(army2);
        const expected = 1;

        expect(result).toBe(expected);
      });
      it('should return 0 if both armies have the same power', () => {
        const result = fight([archer])([warrior, wizard]);
        const expected = 0;

        expect(result).toBe(expected);
      });
    });

    describe('maybeFight', () => {
      it('should return none if one army is not present', () => {
        const result = maybeFight(option.some(army1), option.none);
        const expected = option.none;

        expect(result).toBe(expected);
      });
      it('should return none if no army is present', () => {
        const result = maybeFight(option.none, option.none);
        const expected = option.none;

        expect(result).toBe(expected);
      });
      it('should return the id of the stronger army', () => {
        const result = maybeFight(option.some(army1), option.some(army2));
        const expected = option.some(1);

        expect(result).toEqual(expected);
      });
      it('should return 0 if both armies have the same power', () => {
        const result = maybeFight(
          option.some([archer]),
          option.some([warrior, wizard]),
        );
        const expected = option.some(0);

        expect(result).toEqual(expected);
      });
    });
  });
});
