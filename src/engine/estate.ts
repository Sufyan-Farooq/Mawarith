import { EstateInput, EstateCalculationSummary } from './types';

export function calculateEstateSummary(input: EstateInput): {
  summary: EstateCalculationSummary;
  warnings: string[];
} {
  const warnings: string[] = [];

  const grossEstate = Math.max(0, 
    (input.cash || 0) + 
    (input.realEstate || 0) + 
    (input.goldJewelry || 0) + 
    (input.otherAssets || 0)
  );

  const burialCosts = Math.max(0, input.burialCosts || 0);
  const debtsTotal = Math.max(0, (input.debtsCollateral || 0) + (input.debtsUnsecured || 0));

  // Priority 1: Burial expenses
  const afterBurial = Math.max(0, grossEstate - burialCosts);

  // Priority 2 & 3: Debts (precede bequests by consensus of Sahabah and Hadith of Ali RA)
  const estateAfterDebts = Math.max(0, afterBurial - debtsTotal);

  if (grossEstate < burialCosts + debtsTotal) {
    warnings.push(
      'Debts and burial costs exceed or equal the gross estate. Under Shariah, estate is exhausted for obligations and no inheritance or wasiyyah remains.'
    );
  }

  // Priority 4: Wasiyyah (Will / Bequest)
  // Limited to 1/3 of the estate after debts, and forbidden for legal heirs (Abu Dawud 2870).
  const maxWasiyyahAllowed = estateAfterDebts / 3;
  let wasiyyahApproved = Math.max(0, input.wasiyyahAmount || 0);
  let wasiyyahCapped = false;

  if (wasiyyahApproved > maxWasiyyahAllowed) {
    wasiyyahApproved = maxWasiyyahAllowed;
    wasiyyahCapped = true;
    warnings.push(
      `Wasiyyah was capped at 1/3 of the net estate (${maxWasiyyahAllowed.toLocaleString()}) according to the Sunnah: "The third, and the third is much" (Sahih Bukhari 2742).`
    );
  }

  if (input.wasiyyahRecipientIsHeir) {
    warnings.push(
      'Warning: A bequest (Wasiyyah) cannot be made to an heir under Islamic Law: "Allah has given each their right, so there is no bequest for an heir" (Abu Dawud 2870, Tirmidhi 2120), unless all other adult heirs unanimously agree.'
    );
  }

  // Priority 5: Net Inheritable Estate
  const netInheritableEstate = Math.max(0, estateAfterDebts - wasiyyahApproved);

  return {
    summary: {
      grossEstate,
      burialCosts,
      debtsTotal,
      estateAfterDebts,
      wasiyyahRequested: input.wasiyyahAmount || 0,
      wasiyyahApproved,
      wasiyyahCapped,
      netInheritableEstate,
    },
    warnings,
  };
}
