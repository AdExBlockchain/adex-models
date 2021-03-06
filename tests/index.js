const { Joi } = require('celebrate')
const tape = require('tape')
const { evaluateMultiple } = require('adex-adview-manager/lib/rules')
const { getPricingBounds } = require('adex-adview-manager/lib/helpers')
const schemas = require('../src/schemas')
const testData = require('./testData')
const errors = require('../src/errors')
const helpersTestData = require('./helpersTestData')
const helpers = require('../src/helpers')



const DEFAULT_CAMPAIGN_SPEC = {
	pricingBounds: {
		IMPRESSION: {
			min: '10000000000000',
			max: '15000000000000000'
		}
	}
}

const [minPrice, maxPrice] = getPricingBounds({ spec: { ...DEFAULT_CAMPAIGN_SPEC } })

const defaultRulesOutput = {
	show: true,
	'price.IMPRESSION': minPrice,
}

tape('Testing schema for POSTing ad slots', (t) => {
	t.equals(Joi.validate(testData.workingSlot.marketAdd, schemas.adSlotPost).error, null, 'No error for normal slot')
	t.equals(Joi.validate(testData.slotWithNoOptionalKeys.marketAdd, schemas.adSlotPost).error, null, 'No error for slot with no optional keys')
	t.equals(Joi.validate(testData.slotWithMatchType.marketAdd, schemas.adSlotPost).error, null, 'No error for slot with type that matches regex')
	t.equals(Joi.validate(testData.slotWithOwner.marketAdd, schemas.adSlotPost).error, null, 'No error for slot with owner field, model doesn\'t pass it')
	t.equals(Joi.validate(testData.slotWithIpfs.marketAdd, schemas.adSlotPost).error, null, 'No error for slot with IPFS, model doesn\'t pass it')
	t.equals(Joi.validate(testData.slotWithEmptyDescription.marketAdd, schemas.adSlotPost).error, null, 'No error for slot with empty description field')

	t.equals(Joi.validate(testData.slotWithInvalidType.marketAdd, schemas.adSlotPost).error.message, errors.TYPE_ERR_SLOT, 'Error for slot with invalid type')
	t.equals(Joi.validate(testData.slotWithBrokenDescription.marketAdd, schemas.adSlotPost).error.message, errors.DESC_ERR_SLOT, 'Error for slot with invalid description field')
	t.equals(Joi.validate(testData.slotWithBrokenCreated.marketAdd, schemas.adSlotPost).error.message, errors.CREATED_DATE_ERR_SLOT, 'Error for slot with invalid created timestamp')
	t.equals(Joi.validate(testData.slotWithBrokenFallbackUnit.marketAdd, schemas.adSlotPost).error.toString().slice(0, 15), 'ValidationError', 'Error for slot with invalid fallbackUnit field') // Failing to match regex results in ValidationError
	t.equals(Joi.validate(testData.slotWithBrokenTags.marketAdd, schemas.adSlotPost).error.toString().slice(0, 15), 'ValidationError', 'Error for slot with broken tags field')
	t.equals(Joi.validate(testData.slotWithBrokenTitle.marketAdd, schemas.adSlotPost).error.message, errors.TITLE_ERR_SLOT, 'Error for slot with broken title field')

	t.equals(Joi.validate(testData.slotWithInvalidWebsite.marketAdd, schemas.adSlotPost).error.message, errors.SLOT_WEBSITE_ERR, 'Error for slot with invalid website field')
	t.equals(Joi.validate(testData.slotWithInvalidWebsiteSchema.marketAdd, schemas.adSlotPost).error.message, errors.SLOT_WEBSITE_ERR, 'Error for slot with invalid website field (scheme)')
	t.equals(Joi.validate(testData.slotWithInvalidWebsiteSchemaHttp.marketAdd, schemas.adSlotPost).error.message, errors.SLOT_WEBSITE_ERR, 'Error for slot with invalid website field (http)')
	t.end()
})

tape('Testing schema for POSTing ad units', (t) => {
	t.equals(Joi.validate(testData.workingUnit.marketAdd, schemas.adUnitPost).error, null, 'No error for working unit')
	t.equals(Joi.validate(testData.unitNoOptional.marketAdd, schemas.adUnitPost).error, null, 'No error for unit with no optional fields')

	t.equals(Joi.validate(testData.unitBrokenArchived.marketAdd, schemas.adUnitPost).error.message, errors.ARCHIVED_ERR, 'Error for unit with invalid archived field')
	t.equals(Joi.validate(testData.unitBrokenCreated.marketAdd, schemas.adUnitPost).error.message, errors.CREATED_DATE_ERR_UNIT, 'Error for unit with invalid created field')
	t.equals(Joi.validate(testData.unitBrokenDesc.marketAdd, schemas.adUnitPost).error.message, errors.DESC_ERR_UNIT, 'Error for unit with invalid description field')
	t.equals(Joi.validate(testData.unitBrokenMediaUrl.marketAdd, schemas.adUnitPost).error.message, errors.IPFS_URL_ERR, 'Error for unit with invalid media URL')
	t.equals(Joi.validate(testData.unitBrokenMime.marketAdd, schemas.adUnitPost).error.message, errors.MEDIA_MIME_ERR, 'Error for unit for invalid mime type')
	t.equals(Joi.validate(testData.unitBrokenPassback.marketAdd, schemas.adUnitPost).error.message, errors.PASSBACK_ERR, 'Error for unit with invalid passback')
	t.equals(Joi.validate(testData.unitBrokenTags.marketAdd, schemas.adUnitPost).error.toString().slice(0, 15), 'ValidationError', 'Error for unit with invalid tags array')
	t.equals(Joi.validate(testData.unitBrokenTargetUrl.marketAdd, schemas.adUnitPost).error.message, errors.TARGET_URL_ERR, 'Error for unit with invalid targetUrl')
	t.equals(Joi.validate(testData.unitBrokenTargeting.marketAdd, schemas.adUnitPost).error.toString().slice(0, 15), 'ValidationError', 'Error for unit with invalid targeting field')
	t.equals(Joi.validate(testData.unitBrokenTitle.marketAdd, schemas.adUnitPost).error.message, errors.TITLE_ERR_UNIT, 'Error for unit with invalid title')
	t.equals(Joi.validate(testData.unitBrokenType.marketAdd, schemas.adUnitPost).error.message, errors.TYPE_ERR_UNIT, 'Error for unit with invalid type')
	t.end()
})

tape('Testing schema for PUTing ad slots', (t) => {
	t.equals(Joi.validate(testData.putSlotExtraFields.marketUpdate, schemas.adSlotPut).error, null, 'No error for putting slot with extra fields, they shouldn\'t be passed')
	t.equals(Joi.validate(testData.putSlotWorking.marketUpdate, schemas.adSlotPut).error, null, 'No error for working slot update')
	t.equals(Joi.validate(testData.putSlotNoOptional.marketUpdate, schemas.adSlotPut).error, null, 'No error when optional fields are skipped')
	t.end()
})

tape('Testing schema for PUTing ad units', (t) => {
	t.equals(Joi.validate(testData.putUnitExtraFields.marketUpdate, schemas.adUnitPut).error, null, 'No error for updating unit with extra fields as they shouldn\'t be passed')
	t.equals(Joi.validate(testData.putUnitNoOptional.marketUpdate, schemas.adUnitPut).error, null, 'No error for updating unit with no optional fields')
	t.equals(Joi.validate(testData.putUnitWorking.marketUpdate, schemas.adUnitPut).error, null, 'No error for updating working unit')
	t.end()
})

tape('Testing schema for Accounts', (t) => {
	t.equals(Joi.validate(testData.userValid, schemas.user).error, null, 'No error for adding valid user')
	t.equals(Joi.validate(testData.userNoOptional, schemas.user).error, null, 'No error for adding user with no optional fields')

	t.equals(Joi.validate(testData.userInvalidAuthToken, schemas.user).error.message, errors.AUTH_TOKEN_ERR, 'User with invalid auth token causes error')
	t.equals(Joi.validate(testData.userInvalidHash, schemas.user).error.message, errors.HASH_ERR, 'User with invalid hash causes error')
	t.equals(Joi.validate(testData.userInvalidIdentity, schemas.user).error.message, errors.IDENTITY_ERR, 'User with invalid identity address causes error')
	t.equals(Joi.validate(testData.userInvalidMode, schemas.user).error.message, errors.MODE_ERR, 'User with invalid auth mode causes error')
	t.equals(Joi.validate(testData.userInvalidPrefix, schemas.user).error.message, errors.PREFIXED_ERR, 'User with invalid prefix causes error')
	t.equals(Joi.validate(testData.userInvalidRole, schemas.user).error.message, errors.ROLE_ERR, 'User with invalid role causes error')
	t.equals(Joi.validate(testData.userInvalidSignature, schemas.user).error.message, errors.SIGNATURE_ERR, 'User with invalid signature causes error')
	t.equals(Joi.validate(testData.userInvalidsignerAddress, schemas.user).error.message, errors.SIGNER_ADDR_ERR, 'User with invalid signer address causes error')
	t.equals(Joi.validate(testData.userInvalidTypedData, schemas.user).error.message, errors.TD_VALUE_ERR, 'User with invalid typed data causes error')
	t.end()
})

tape('Testing schema for editing campaigns', (t) => {
	t.equals(Joi.validate(testData.putCampaignWorking, schemas.campaignPut).error, null, 'No error for editing a campaign')
	t.equals(Joi.validate(testData.putCampaignBrokenTitle, schemas.campaignPut).error.message, errors.TITLE_ERR_CAMPAIGN, 'Campaign with broken title returns error')
	t.ok(Joi.validate(testData.putCampaignExtraProperties, schemas.campaignPut).error.toString().slice(0, 15), 'ValidationError', 'Editing campaign won\'t work with more than the title property')
	t.end()
})

tape('Testing schema for account', (t) => {
	t.equals(Joi.validate(testData.validAccount.email, schemas.account.email).error, null, 'No error for account')
	t.equals(Joi.validate(testData.accountInvalidEmail.email, schemas.account.email).error.message, errors.ACCOUNT_EMAIL_ERR, 'Campaign with invalid email')
	t.equals(Joi.validate(testData.accountInvalidEmailTLD.email, schemas.account.email).error.message, errors.ACCOUNT_EMAIL_ERR, 'Campaign with invalid email top level domain')
	t.equals(Joi.validate(testData.accountInvalidEmailUnicode.email, schemas.account.email).error.message, errors.ACCOUNT_EMAIL_ERR, 'Campaign with invalid email - unicode characters')
	t.end()
})


const { minByCategory, countryTiersCoefficients, audienceInput1, audienceInput2, audienceInput3, audienceInput4, audienceInput5, audienceInput6, audienceInput7, audienceInput8, audienceInput9, decimals, pricingBounds1, pricingBounds2, pricingBounds3, pricingBounds4, pricingBounds6 } = helpersTestData
tape('Testing getSuggestedPricingBounds', (t) => {
	t.equals(JSON.stringify(helpers.getSuggestedPricingBounds({ minByCategory, countryTiersCoefficients, audienceInput: audienceInput1 })), JSON.stringify({ IMPRESSION: { min: '0.30', max: '0.30' } }), '1 loc tier "in", 1 cat "in"  works')
	t.equals(JSON.stringify(helpers.getSuggestedPricingBounds({ minByCategory, countryTiersCoefficients, audienceInput: audienceInput2 })), JSON.stringify({ IMPRESSION: { min: '2.40', max: '2.40' } }), '1 loc country "in", 1 cat "in"  works')
	t.equals(JSON.stringify(helpers.getSuggestedPricingBounds({ minByCategory, countryTiersCoefficients, audienceInput: audienceInput3 })), JSON.stringify({ IMPRESSION: { min: '0.40', max: '1.60' } }), ' loc tiers "in", 1 cat "in" 2 cat "nin"  works')
	t.equals(JSON.stringify(helpers.getSuggestedPricingBounds({ minByCategory, countryTiersCoefficients, audienceInput: audienceInput4 })), JSON.stringify({ IMPRESSION: { min: '0.30', max: '7.50' } }), '2 loc tiers "in", 0 cat "in" , 1 cat "nin" works')
	t.equals(JSON.stringify(helpers.getSuggestedPricingBounds({ minByCategory, countryTiersCoefficients, audienceInput: audienceInput5 })), JSON.stringify({ IMPRESSION: { min: '0.30', max: '7.50' } }), '2 loc "in", 1 cat "ALL" "in", 1 cat "nin"  works')
	t.equals(JSON.stringify(helpers.getSuggestedPricingBounds({ minByCategory, countryTiersCoefficients, audienceInput: audienceInput6 })), JSON.stringify({ IMPRESSION: { min: '0.60', max: '1.50' } }), '1 loc tier "nin", 1 cat "in"  works')

	t.end()
})

tape('Testing audienceInputToTargetingRules with getPriceRulesV1', (t) => {
	t.equals(helpers.audienceInputToTargetingRules({ minByCategory, countryTiersCoefficients, audienceInput: audienceInput1, decimals, pricingBounds: pricingBounds1 })[5].if[1].set[1].bn, '300000000000000000', 'set exact price when no difference between min and max')
	t.equals(helpers.audienceInputToTargetingRules({ minByCategory, countryTiersCoefficients, audienceInput: audienceInput1, decimals, pricingBounds: pricingBounds2 })[5].if[1].set[1].bn, '2400000000000000000', 'set exact price when no difference between min and max (higher numbers)')
	t.equals(helpers.audienceInputToTargetingRules({ minByCategory, countryTiersCoefficients, audienceInput: audienceInput4, decimals, pricingBounds: pricingBounds4 })[6].if[1].set[1].bn, '7500000000000000000', 'set max price to top tier countries')

	// 0.6 - 1.5 all tiers
	const rules = helpers.audienceInputToTargetingRules({ minByCategory, countryTiersCoefficients, audienceInput: audienceInput7, decimals, pricingBounds: pricingBounds6 })

	// return tier rules ordered by top tier
	// TIER_1 max - 1.5
	t.equals(rules[4].if[1].set[1].bn, '1500000000000000000', 'set max price to top tier countries with 4 tiers selected')
	// TIER_2 0.6(min) * 2.5 = 1.5
	t.equals(rules[5].if[1].set[1].bn, '1500000000000000000', 'set min * coefficient for middle tier 2')
	// TIER_3 0.6(min) * 1.5 = 0.9
	t.equals(rules[6].if[1].set[1].bn, '900000000000000000', 'set min * coefficient for middle tier 3')

	// User agent test
	t.equals(rules[7].onlyShowIf.in[0][0], 'Android', 'should have Android in user agent')
	t.equals(rules[7].onlyShowIf.in[1].get, 'userAgentOS', 'should get userAgentOS')
	t.equals(rules[8], undefined, 'no rule for min tier as this is the default min price')
	t.doesNotThrow(() => evaluateMultiple({}, { ...defaultRulesOutput }, rules), 'rules are evaluated with no errors')

	// 0.6 - 1.5 all tiers
	const rulesWithSingleCountryInAllTiers = helpers.audienceInputToTargetingRules({ minByCategory, countryTiersCoefficients, audienceInput: audienceInput8, decimals, pricingBounds: pricingBounds6 })

	// return tier rules ordered by top tier
	// TIER_1 DE max - 1.5
	t.equals(rulesWithSingleCountryInAllTiers[5].if[1].set[1].bn, '1500000000000000000', 'set max price to top tier country with 4 tiers selected')
	// TIER_2  GD 0.6(min) * 2.5 = 1.5
	t.equals(rulesWithSingleCountryInAllTiers[6].if[1].set[1].bn, '1500000000000000000', 'set min * coefficient for middle tier 2 country')

	// TIER_3 BA 0.6(min) * 1.5 = 0.9
	t.equals(rulesWithSingleCountryInAllTiers[7].if[1].set[1].bn, '900000000000000000', 'set min * coefficient for middle tier 3 country')

	t.equals(rulesWithSingleCountryInAllTiers[9], undefined, 'no rule for min tier country as this is the default min price')

	t.doesNotThrow(() => evaluateMultiple({}, { ...defaultRulesOutput }, rulesWithSingleCountryInAllTiers), 'rulesWithSingleCountryInAllTiers are evaluated with no errors')

	// 0.6  nin t1 1 country t3 min 0.6 * 1, max 0.6 * 2.5 - suggested but used { min: 0.6, max: 1.5 } pricingBounds6
	const rulesWithNinLocation = helpers.audienceInputToTargetingRules({ minByCategory, countryTiersCoefficients, audienceInput: audienceInput9, decimals, pricingBounds: pricingBounds6 })

	// return tier rules ordered by top tier
	// base price
	t.equals(rulesWithNinLocation[0].set[0], 'price.IMPRESSION', 'set min.IMPRESSION as base price')
	t.equals(rulesWithNinLocation[0].set[1].bn, '600000000000000000', 'set min.IMPRESSION to be min price')
	// TIER_2 0.6(min) * 2.5 = 1.5
	t.equals(rulesWithNinLocation[5].if[1].set[1].bn, '1500000000000000000', 'set max for middle tier 2')
	// TIER_3 0.6(min) * 1.5 = 0.9
	t.equals(rulesWithNinLocation[6].if[1].set[1].bn, '900000000000000000', 'set min * coefficient for middle tier 3')
	t.equals(rulesWithNinLocation[5].if[0].in.includes('BG'), false, 'excluded single country is not included in price rule')
	t.equals(rulesWithNinLocation[8], undefined, 'no rule for min tier as this is the default min price')
	t.doesNotThrow(() => evaluateMultiple({}, { ...defaultRulesOutput }, rulesWithNinLocation), 'rulesWithNinLocation are evaluated with no errors')

	t.end()
})

tape('Testing pricing bounds helpers', (t) => {
	const decimals = 18

	// per 100 impressions
	const userInputPB = {
		IMPRESSION: {
			min: '0.1',
			max: '0.69'
		}
	}

	// per 1 impression
	const specPricingBounds = {
		IMPRESSION: {
			min: '100000000000000',
			max: '690000000000000'
		}
	}

	const specFromUserInput = helpers.userInputPricingBoundsPerMileToRulesValue({ pricingBounds: userInputPB, decimals })
	const userInputFormSpecBounds = helpers.pricingBondsToUserInputPerMile({ pricingBounds: specPricingBounds, decimals })

	t.equals(specFromUserInput.IMPRESSION.min, specPricingBounds.IMPRESSION.min, 'userInputPricingBoundsPerMileToRulesValue min OK')
	t.equals(specFromUserInput.IMPRESSION.max, specPricingBounds.IMPRESSION.max, 'userInputPricingBoundsPerMileToRulesValue max OK')
	t.equals(userInputFormSpecBounds.IMPRESSION.min, userInputPB.IMPRESSION.min, 'userInputFormSpecBounds min OK')
	t.equals(userInputFormSpecBounds.IMPRESSION.max, userInputPB.IMPRESSION.max, 'userInputFormSpecBounds max OK')
	t.end()

})


