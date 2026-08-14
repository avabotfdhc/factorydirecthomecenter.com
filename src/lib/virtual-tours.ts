// Matterport virtual tours from Champion's Topeka tour sheet (Nov 2025),
// keyed by the site's floor-plan slug. The CMS has no virtualTour values for
// these homes, so this repo-side overlay fills them in — a CMS-provided tour
// always wins (the overlay only applies when the CMS field is empty).
//
// Matching rule: a tour is only mapped when its Champion model number exactly
// matches the listing (verified against the model number embedded in the slug,
// shown on the live detail page, or in the listing's banner-image filename).
// Tours for models we don't carry (or that differ in length/plan number from
// the toured unit) are intentionally left out. Where Champion published
// several tours of the same model, the newest show-home scan was chosen.
export const virtualTours: Record<string, string> = {
  // 16' single wides (model number in slug)
  "dutch-aspire-1466h32082": "https://my.matterport.com/show/?m=NASgpGLKV8q",
  "dutch-aspire-1666h32085": "https://my.matterport.com/show/?m=uWXCjapKkkW",
  "dutch-aspire-1666h32212": "https://my.matterport.com/show/?m=4PxFEtum7Sr",
  "dutch-aspire1666h32219": "https://my.matterport.com/show/?m=iC9BXV2KULL",
  "dutch-aspire1676h32089": "https://my.matterport.com/show/?m=VuwvcQaBZ6A",
  "dutch-aspire1676h32090": "https://my.matterport.com/show/?m=JkJGwJcLA1u",
  "dutch-aspire1676h32091": "https://my.matterport.com/show/?m=pTvNN2nwKia",
  "dutch-aspire1676h32221": "https://my.matterport.com/show/?m=AkmP7A8HE4x",
  "dutch-aspire1676h32259": "https://my.matterport.com/show/?m=AWkbFGPfWuD",

  // Double wides (model number in slug)
  "dutch-aspire-monroe-2840h32024": "https://my.matterport.com/show/?m=gpczG6C2Ydh",
  "dutch-aspire-lincoln-2848h32171": "https://my.matterport.com/show/?m=5gsHRjVG3Cj",
  "dutch-aspire-lincoln-2852h32171": "https://my.matterport.com/show/?m=poCEg35Lncf",
  "dutch-aspire-easton-2856h32301": "https://my.matterport.com/show/?m=1WbTQxhZkoF",
  "dutch-aspire-bayport-2856h32168": "https://my.matterport.com/show/?m=1LqfFmsAGDk",
  "dutch-aspire-summit-2864h42a1c": "https://my.matterport.com/show/?m=5pvBSkYRt54",
  "silverton-3-bed-2-bath-manufactured-home-1493-sq-ft-28x56-champion-aspire":
    "https://my.matterport.com/show/?m=zUuN931WExB",

  // 32' wide doubles (model number in slug)
  "3268h32052-dutch-aspire-madison": "https://my.matterport.com/show/?m=GxNBSqLYMdz",
  "dutch-aspire-shelby-3260h32181": "https://my.matterport.com/show/?m=vrK6FVLfsYe",
  "dutch-aspire-timberlake-3260h32207": "https://my.matterport.com/show/?m=ESDwRWfZeqs",
  "dutch-aspire-winston-3272h32186": "https://my.matterport.com/show/?m=DTqXpJJSKtZ",
  "dutch-aspire-verona-3276h42179": "https://my.matterport.com/show/?m=obnYEkhdHBe",

  // Plain-name listings (model number verified on the live page / banner file)
  "pontiac": "https://my.matterport.com/show/?m=DDazBkFhtRV", // 2852H32103
  "georgetown": "https://my.matterport.com/show/?m=YPtpvLpSgsf", // 2864H32101
  "fillmore": "https://my.matterport.com/show/?m=4ZXgyJf4TrZ", // 2864H32060
  "belvidere": "https://my.matterport.com/show/?m=vb9wTWyz2uv", // 2856H32392
};
