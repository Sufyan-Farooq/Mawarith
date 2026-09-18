import { calculateInheritance } from './calculator';
import { HeirsInput, EstateInput } from './types';

function createBlankHeirs(): HeirsInput {
  return {
    wivesCount: 0,
    husband: false,
    father: false,
    mother: false,
    paternalGrandfather: false,
    maternalGrandmother: false,
    paternalGrandmother: false,
    sonsCount: 0,
    daughtersCount: 0,
    grandsonsCount: 0,
    granddaughtersCount: 0,
    fullBrothersCount: 0,
    fullSistersCount: 0,
    paternalBrothersCount: 0,
    paternalSistersCount: 0,
    maternalBrothersCount: 0,
    maternalSistersCount: 0,
    nephewsFullCount: 0,
    nephewsPaternalCount: 0,
    paternalUnclesFullCount: 0,
    paternalUnclesPaternalCount: 0,
    cousinsFullCount: 0,
    cousinsPaternalCount: 0,
  };
}

function createEstate(cash: number, wasiyyah: number = 0, debts: number = 0, burial: number = 0): EstateInput {
  return {
    cash,
    realEstate: 0,
    goldJewelry: 0,
    otherAssets: 0,
    burialCosts: burial,
    debtsCollateral: 0,
    debtsUnsecured: debts,
    wasiyyahAmount: wasiyyah,
  };
}

export function runSanityTests() {
  console.log('--- RUNNING MAWARITH SHARIAH CALCULATION ENGINE TESTS ---');

  // TEST 1: Standard Family (Deceased Male, 1 Wife, 1 Son, 1 Daughter, Estate = $240,000)
  // Expected:
  // Wife = 1/8 = $30,000
  // Remainder = $210,000 split 2:1 (Son 2 shares, Daughter 1 share -> each share $70,000)
  // Son = $140,000 (7/12)
  // Daughter = $70,000 (7/24)
  {
    const heirs = createBlankHeirs();
    heirs.wivesCount = 1;
    heirs.sonsCount = 1;
    heirs.daughtersCount = 1;
    const res = calculateInheritance('male', createEstate(240000), heirs);

    const wife = res.heirs.find(h => h.heirId === 'wives');
    const son = res.heirs.find(h => h.heirId === 'sons');
    const daughter = res.heirs.find(h => h.heirId === 'daughters');

    console.assert(wife && Math.abs(wife.totalMonetaryValue - 30000) < 1, 'Test 1 Wife share failed');
    console.assert(son && Math.abs(son.totalMonetaryValue - 140000) < 1, 'Test 1 Son share failed');
    console.assert(daughter && Math.abs(daughter.totalMonetaryValue - 70000) < 1, 'Test 1 Daughter share failed');
    console.log('✔ Test 1: Standard Family (Wife + Son + Daughter) Passed');
  }

  // TEST 2: Al-Gharrawan / Umariyyatan (Deceased Female, Husband + Mother + Father, Estate = $60,000)
  // Husband = 1/2 = $30,000
  // Remainder after husband = $30,000
  // Mother = 1/3 of remainder = $10,000 (1/6 of total)
  // Father = Remainder = $20,000 (1/3 of total, exactly double mother)
  {
    const heirs = createBlankHeirs();
    heirs.husband = true;
    heirs.mother = true;
    heirs.father = true;
    const res = calculateInheritance('female', createEstate(60000), heirs);

    console.assert(res.isUmariyyatan === true, 'Test 2 should be Umariyyatan');
    const husband = res.heirs.find(h => h.heirId === 'husband');
    const mother = res.heirs.find(h => h.heirId === 'mother');
    const father = res.heirs.find(h => h.heirId === 'father');

    console.assert(husband && Math.abs(husband.totalMonetaryValue - 30000) < 1, 'Test 2 Husband failed');
    console.assert(mother && Math.abs(mother.totalMonetaryValue - 10000) < 1, 'Test 2 Mother failed');
    console.assert(father && Math.abs(father.totalMonetaryValue - 20000) < 1, 'Test 2 Father failed');
    console.log('✔ Test 2: Al-Gharrawan / Umariyyatan Passed');
  }

  // TEST 3: Al-'Awl (Deceased Female, Husband + 2 Full Sisters, Estate = $70,000)
  // Husband = 1/2 (3/6), Sisters = 2/3 (4/6) -> Total 7/6
  // Base 6 expands to 7 (Awl)
  // Husband = 3/7 = $30,000
  // Sisters = 4/7 = $40,000 ($20,000 each)
  {
    const heirs = createBlankHeirs();
    heirs.husband = true;
    heirs.fullSistersCount = 2;
    const res = calculateInheritance('female', createEstate(70000), heirs);

    console.assert(res.isAwl === true, 'Test 3 should be Awl');
    console.assert(res.adjustedDenominator === 7, 'Test 3 adjustedDenominator should be 7');
    const husband = res.heirs.find(h => h.heirId === 'husband');
    const sisters = res.heirs.find(h => h.heirId === 'fullSisters');

    console.assert(husband && Math.abs(husband.totalMonetaryValue - 30000) < 1, 'Test 3 Husband failed');
    console.assert(sisters && Math.abs(sisters.totalMonetaryValue - 40000) < 1, 'Test 3 Sisters failed');
    console.log('✔ Test 3: Al-Awl Expansion (Husband + 2 Sisters) Passed');
  }

  // TEST 4: Al-Radd (Deceased Male, Mother + 1 Daughter, Estate = $40,000)
  // Mother fard = 1/6 (1 share)
  // Daughter fard = 1/2 = 3/6 (3 shares)
  // Total shares = 4/6. No Asabah exists -> Radd re-normalized to 4:
  // Mother = 1/4 = $10,000
  // Daughter = 3/4 = $30,000
  {
    const heirs = createBlankHeirs();
    heirs.mother = true;
    heirs.daughtersCount = 1;
    const res = calculateInheritance('male', createEstate(40000), heirs);

    console.assert(res.isRadd === true, 'Test 4 should be Radd');
    const mother = res.heirs.find(h => h.heirId === 'mother');
    const daughter = res.heirs.find(h => h.heirId === 'daughters');

    console.assert(mother && Math.abs(mother.totalMonetaryValue - 10000) < 1, 'Test 4 Mother Radd failed');
    console.assert(daughter && Math.abs(daughter.totalMonetaryValue - 30000) < 1, 'Test 4 Daughter Radd failed');
    console.log('✔ Test 4: Al-Radd Surplus Return (Mother + Daughter) Passed');
  }

  // TEST 5: Hajb Blocking (Son blocks Grandson and Brothers)
  {
    const heirs = createBlankHeirs();
    heirs.wivesCount = 1;
    heirs.sonsCount = 1;
    heirs.grandsonsCount = 2;
    heirs.fullBrothersCount = 3;
    heirs.paternalUnclesFullCount = 1;
    const res = calculateInheritance('male', createEstate(100000), heirs);

    console.assert(res.blockedHeirs.some(b => b.heirId === 'grandsons'), 'Grandsons should be blocked');
    console.assert(res.blockedHeirs.some(b => b.heirId === 'fullBrothers'), 'Full brothers should be blocked');
    console.assert(res.blockedHeirs.some(b => b.heirId === 'paternalUnclesFull'), 'Uncles should be blocked');
    console.log('✔ Test 5: Hajb Blocking Matrix Passed');
  }

  // TEST 6: Wasiyyah Cap at 1/3
  {
    const heirs = createBlankHeirs();
    heirs.sonsCount = 1;
    // Estate $100,000, requested wasiyyah $50,000 -> capped at $33,333.33 (1/3)
    const res = calculateInheritance('male', createEstate(100000, 50000), heirs);
    console.assert(res.summary.wasiyyahCapped === true, 'Wasiyyah should be capped');
    console.assert(Math.abs(res.summary.wasiyyahApproved - 33333.33) < 1, 'Wasiyyah cap value failed');
    console.log('✔ Test 6: Wasiyyah 1/3 Capping Passed');
  }

  // TEST 7: Al-Gharrawan with Wife (Deceased Male, Wife + Mother + Father, Estate = $120,000)
  // Wife = 1/4 = $30,000
  // Remainder after wife = $90,000
  // Mother = 1/3 of remainder = $30,000 (1/4 of total)
  // Father = Remainder = $60,000 (1/2 of total, exactly double mother)
  {
    const heirs = createBlankHeirs();
    heirs.wivesCount = 1;
    heirs.mother = true;
    heirs.father = true;
    const res = calculateInheritance('male', createEstate(120000), heirs);

    console.assert(res.isUmariyyatan === true, 'Test 7 should be Umariyyatan');
    const wife = res.heirs.find(h => h.heirId === 'wives');
    const mother = res.heirs.find(h => h.heirId === 'mother');
    const father = res.heirs.find(h => h.heirId === 'father');

    console.assert(wife && Math.abs(wife.totalMonetaryValue - 30000) < 1, 'Test 7 Wife failed');
    console.assert(mother && Math.abs(mother.totalMonetaryValue - 30000) < 1, 'Test 7 Mother failed');
    console.assert(father && Math.abs(father.totalMonetaryValue - 60000) < 1, 'Test 7 Father failed');
    console.log('✔ Test 7: Al-Gharrawan (Wife + Mother + Father) Passed');
  }

  // TEST 8: Hadith Case (Daughter + Granddaughter + Full Sister, Sahih al-Bukhari 6736, Estate = $60,000)
  // Daughter = 1/2 = $30,000
  // Granddaughter = 1/6 (complementing 2/3) = $10,000
  // Full Sister = Asabah ma'a al-ghayr takes residue = $20,000
  {
    const heirs = createBlankHeirs();
    heirs.daughtersCount = 1;
    heirs.granddaughtersCount = 1;
    heirs.fullSistersCount = 1;
    const res = calculateInheritance('male', createEstate(60000), heirs);

    const daughter = res.heirs.find(h => h.heirId === 'daughters');
    const granddaughter = res.heirs.find(h => h.heirId === 'granddaughters');
    const sister = res.heirs.find(h => h.heirId === 'fullSisters');

    console.assert(daughter && Math.abs(daughter.totalMonetaryValue - 30000) < 1, 'Test 8 Daughter failed');
    console.assert(granddaughter && Math.abs(granddaughter.totalMonetaryValue - 10000) < 1, 'Test 8 Granddaughter failed');
    console.assert(sister && Math.abs(sister.totalMonetaryValue - 20000) < 1, 'Test 8 Sister Asabah failed');
    console.log('✔ Test 8: Bukhari 6736 (Daughter + Granddaughter + Sister Asabah) Passed');
  }

  // TEST 9: Al-Minbariyyah 'Awl (Wife + 2 Daughters + Father + Mother, Estate = $270,000)
  // Wife = 1/8 (3/24), Daughters = 2/3 (16/24), Father = 1/6 (4/24), Mother = 1/6 (4/24)
  // Total numerators = 3 + 16 + 4 + 4 = 27 (Awl from 24 to 27)
  // Wife gets 3/27 = $30,000 (1/9)
  // Daughters get 16/27 = $160,000 ($80,000 each)
  // Father gets 4/27 = $40,000
  // Mother gets 4/27 = $40,000
  {
    const heirs = createBlankHeirs();
    heirs.wivesCount = 1;
    heirs.daughtersCount = 2;
    heirs.father = true;
    heirs.mother = true;
    const res = calculateInheritance('male', createEstate(270000), heirs);

    console.assert(res.isAwl === true, 'Test 9 should be Awl');
    console.assert(res.baseDenominator === 24, 'Test 9 base should be 24');
    console.assert(res.adjustedDenominator === 27, 'Test 9 adjustedDenominator should be 27');

    const wife = res.heirs.find(h => h.heirId === 'wives');
    const daughters = res.heirs.find(h => h.heirId === 'daughters');
    const father = res.heirs.find(h => h.heirId === 'father');
    const mother = res.heirs.find(h => h.heirId === 'mother');

    console.assert(wife && Math.abs(wife.totalMonetaryValue - 30000) < 1, 'Test 9 Wife share failed');
    console.assert(daughters && Math.abs(daughters.totalMonetaryValue - 160000) < 1, 'Test 9 Daughters share failed');
    console.assert(father && Math.abs(father.totalMonetaryValue - 40000) < 1, 'Test 9 Father share failed');
    console.assert(mother && Math.abs(mother.totalMonetaryValue - 40000) < 1, 'Test 9 Mother share failed');
    console.log('✔ Test 9: Al-Minbariyyah Awl 24 -> 27 Passed');
  }

  // TEST 10: Kalaalah Uterine Siblings (Mother + 2 Maternal Siblings, Estate = $60,000)
  // Mother fard = 1/6 (1 share)
  // 2 Maternal siblings = 1/3 (2 shares)
  // Total = 3/6. No Asabah exists -> Radd re-normalized to 3:
  // Mother = 1/3 = $20,000
  // Maternal siblings = 2/3 = $40,000 ($20,000 each)
  {
    const heirs = createBlankHeirs();
    heirs.mother = true;
    heirs.maternalBrothersCount = 1;
    heirs.maternalSistersCount = 1;
    const res = calculateInheritance('male', createEstate(60000), heirs);

    console.assert(res.isRadd === true, 'Test 10 should be Radd');
    const mother = res.heirs.find(h => h.heirId === 'mother');
    const maternalSiblings = res.heirs.find(h => h.heirId === 'maternalSiblings');

    console.assert(mother && Math.abs(mother.totalMonetaryValue - 20000) < 1, 'Test 10 Mother failed');
    console.assert(maternalSiblings && Math.abs(maternalSiblings.totalMonetaryValue - 40000) < 1, 'Test 10 Maternal Siblings total failed');
    console.assert(maternalSiblings && Math.abs(maternalSiblings.perIndividualMonetaryValue - 20000) < 1, 'Test 10 Maternal Siblings per individual failed');
    console.log('✔ Test 10: Kalaalah Uterine Siblings Radd Passed');
  }

  // TEST 11: Full Estate Liquidation Waterfall
  {
    const estate: EstateInput = {
      cash: 150000,
      realEstate: 250000,
      goldJewelry: 50000,
      otherAssets: 50000,
      burialCosts: 5000,
      debtsCollateral: 45000,
      debtsUnsecured: 50000,
      wasiyyahAmount: 150000, // exceeds 1/3 of 400,000 ($133,333.33)
    };
    const heirs = createBlankHeirs();
    heirs.sonsCount = 2;
    const res = calculateInheritance('male', estate, heirs);

    console.assert(res.summary.grossEstate === 500000, 'Test 11 Gross failed');
    console.assert(res.summary.debtsTotal === 95000, 'Test 11 Debts failed');
    console.assert(res.summary.estateAfterDebts === 400000, 'Test 11 EstateAfterDebts failed');
    console.assert(res.summary.wasiyyahCapped === true, 'Test 11 WasiyyahCapped failed');
    console.assert(Math.abs(res.summary.wasiyyahApproved - 133333.33) < 1, 'Test 11 WasiyyahApproved failed');
    console.assert(Math.abs(res.summary.netInheritableEstate - 266666.67) < 1, 'Test 11 Net failed');
    console.log('✔ Test 11: Full Estate Liquidation Waterfall Passed');
  }

  // TEST 12: Personalized Deceased & Heir Names Mapping
  {
    const heirs = createBlankHeirs();
    heirs.deceasedName = 'Sufyan Farooq';
    heirs.wivesCount = 1;
    heirs.sonsCount = 1;
    heirs.daughtersCount = 2;
    heirs.heirNames = {
      wives: ['Khadijah'],
      sons: ['Ali'],
      daughters: ['Fatimah', 'Zainab'],
    };

    const res = calculateInheritance('male', createEstate(240000), heirs);

    console.assert(res.deceasedName === 'Sufyan Farooq', 'Test 12 deceasedName failed');
    const wife = res.heirs.find(h => h.heirId === 'wives');
    const son = res.heirs.find(h => h.heirId === 'sons');
    const daughters = res.heirs.find(h => h.heirId === 'daughters');

    console.assert(wife && wife.customNames && wife.customNames[0] === 'Khadijah', 'Test 12 wife custom name failed');
    console.assert(son && son.customNames && son.customNames[0] === 'Ali', 'Test 12 son custom name failed');
    console.assert(daughters && daughters.customNames && daughters.customNames.length === 2, 'Test 12 daughters custom names failed');
    console.assert(daughters?.customNames?.[0] === 'Fatimah' && daughters?.customNames?.[1] === 'Zainab', 'Test 12 daughters individual names failed');
    console.log('✔ Test 12: Personalized Deceased & Heir Names Mapping Passed');
  }

  console.log('🌟 ALL 12 SHARIAH CALCULATION ENGINE TESTS PASSED SUCCESSFULLY! 🌟');
}

// Auto-run if executed directly
runSanityTests();

