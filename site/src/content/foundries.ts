// Foundry survey data (typefoundry.directory, October 2026): every foundry that sells variable fonts or could not be classified.

/** One surveyed foundry. subfamilyVF: Yes = sells a VF covering one complete subfamily of a larger VF; Split only = sub-designs sold as separate full-range VFs. */
export interface FoundryRow {
	name: string
	url: string
	subfamilyVF: string
	vfWithoutFamily: string
	priceVsFamily: string
	source: string
}

/** Number of directory foundries screened as not selling variable fonts. */
export const FOUNDRIES_WITHOUT_VF = 149

/** Surveyed foundries, alphabetical. */
export const FOUNDRIES: FoundryRow[] = [
	{
		"name": "205TF",
		"url": "http://www.205.tf",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.205.tf/augure"
	},
	{
		"name": "A+",
		"url": "https://www.a-plus-type.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.futurefonts.com/api/v1/typefaces/182"
	},
	{
		"name": "Aeiou Tools",
		"url": "https://aeiou.tools",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://aeiou.tools/api/families"
	},
	{
		"name": "Alexandre Créquer",
		"url": "https://alex-creq.com/",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://alex-creq.com/typefaces/asphodel"
	},
	{
		"name": "AllCaps",
		"url": "https://www.allcapstype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.allcapstype.com/typefaces/plastik"
	},
	{
		"name": "Anita Jürgeleit",
		"url": "https://www.anitajuergeleit.de",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://www.typethis.studio/p/captura-now-font-family/"
	},
	{
		"name": "Apex Foundry",
		"url": "https://www.apextypefoundry.com/",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://apextypefoundry.com/about"
	},
	{
		"name": "Approximate Type",
		"url": "https://approxtype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.approxtype.com/purchase"
	},
	{
		"name": "Arcane Type Foundry",
		"url": "https://www.arcanetype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://alanna-munro-type-foundry.fontdue.com/graphql"
	},
	{
		"name": "Arillatype.Studio",
		"url": "https://arillatype.studio",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://arillatype.studio/font/at-aero"
	},
	{
		"name": "Arkitype",
		"url": "https://arkitype.co",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Same",
		"source": "https://fonts.arkitype.co/graphql"
	},
	{
		"name": "Arrow Type",
		"url": "https://arrowtype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://arrow-type.fontdue.com/graphql"
	},
	{
		"name": "Atypical",
		"url": "https://atypical.gr/fonts",
		"subfamilyVF": "Split only",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Cheaper",
		"source": "https://atypical.gr/fonts/Miasma"
	},
	{
		"name": "AUTHENTIC",
		"url": "https://authentic.website",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "More",
		"source": "https://authentic.website/json/products.json"
	},
	{
		"name": "BAL Foundry",
		"url": "https://www.bal-foundry.com",
		"subfamilyVF": "Yes",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Same",
		"source": "https://www.bal-foundry.com/typefaces/thunder-collection"
	},
	{
		"name": "Bastarda Type",
		"url": "http://bastardatype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Same",
		"source": "https://bastardatype.com/font/lamina-bt-2-manu/"
	},
	{
		"name": "BB-Bureau",
		"url": "http://www.bb-bureau.fr/",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Same",
		"source": "https://www.bb-bureau.fr/"
	},
	{
		"name": "Best Typefaces",
		"url": "https://typefaces.best",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Same",
		"source": "https://best.fontdue.com/graphql"
	},
	{
		"name": "Bijou Type",
		"url": "http://bijoutype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Same",
		"source": "https://bijoutype.com/typefaces/buckram"
	},
	{
		"name": "Binnenland",
		"url": "https://www.binnenland.ch",
		"subfamilyVF": "Split only",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Cheaper",
		"source": "https://binnenland.ch/typeface/micronova"
	},
	{
		"name": "Black[Foundry]",
		"url": "https://black-foundry.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://black-foundry.com/fonts/vesterbro/"
	},
	{
		"name": "Blackletra",
		"url": "https://blackletra.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "More",
		"source": "https://blackletra.com/typefaces/elza"
	},
	{
		"name": "Blanco Letters",
		"url": "https://www.blancoletters.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.blancoletters.com/typefaces/harri-variable/"
	},
	{
		"name": "Blast Foundry",
		"url": "https://www.blast-foundry.com",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://blast-foundry.com/typefaces/bay-sans"
	},
	{
		"name": "Bloom Type",
		"url": "https://bloomtype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://bloomtype.com/wp-json/wc/store/v1/products?per_page=100"
	},
	{
		"name": "Bolid System",
		"url": "https://bolidsystem.ch",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Same",
		"source": "https://bolid-system.fontdue.com/graphql"
	},
	{
		"name": "Briefcase Type Foundry",
		"url": "https://www.briefcasetype.com",
		"subfamilyVF": "Split only",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://www.briefcasetype.com/fonts/bc-novatica/buyingoptions"
	},
	{
		"name": "British Standard Type",
		"url": "https://www.britishstandardtype.xyz",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://store.britishstandardtype.xyz/graphql"
	},
	{
		"name": "Cantrell Type",
		"url": "https://cantrelltype.com",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://cantrelltype.com/products.json?limit=250"
	},
	{
		"name": "Cape Arcona",
		"url": "https://www.cape-arcona.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.cape-arcona.com/typefaces/slalom/"
	},
	{
		"name": "Capitalics",
		"url": "https://capitalics.wtf/en",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Same",
		"source": "https://capitalics.wtf/en/font/sztos"
	},
	{
		"name": "CAST",
		"url": "http://www.c-a-s-t.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://store.c-a-s-t.com/graphql"
	},
	{
		"name": "Central Type",
		"url": "https://centraltype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Same",
		"source": "https://store.centraltype.com/graphql"
	},
	{
		"name": "Character Type",
		"url": "https://charactertype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://charactertype.com/typefaces/earlysans/"
	},
	{
		"name": "Charlotte Rohde",
		"url": "https://www.charlotterohde.de/typefaces",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://www.charlotterohde.de/typefaces"
	},
	{
		"name": "CJ Type",
		"url": "http://www.cjtype.com",
		"subfamilyVF": "Yes",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Cheaper",
		"source": "https://sites.fastspring.com/cjtype/product/pennypackerwidefamily"
	},
	{
		"name": "Comma Type",
		"url": "https://www.commatype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://commatype.fontdue.com/graphql"
	},
	{
		"name": "Commercial Type",
		"url": "https://commercialtype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://commercialtype.com/catalog/action_text"
	},
	{
		"name": "Contrast Foundry",
		"url": "http://www.contrastfoundry.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://contrastfoundry.com/typeface/cofo-gothic"
	},
	{
		"name": "CoType",
		"url": "https://cotypefoundry.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://cotypefoundry.com/our-fonts/aeonik"
	},
	{
		"name": "CSTM",
		"url": "https://cstmfonts.com/en",
		"subfamilyVF": "Yes",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://type.today/en/journal/normalidad"
	},
	{
		"name": "Dalton Maag",
		"url": "https://www.daltonmaag.com",
		"subfamilyVF": "Yes",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://www.daltonmaag.com/font-library/aktiv-grotesk.html"
	},
	{
		"name": "Darden Studio",
		"url": "http://www.dardenstudio.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Unknown",
		"source": "https://www.dardenstudio.com/gamay"
	},
	{
		"name": "David Einwaller",
		"url": "https://shop.deinwaller.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://fonts.deinwaller.com/graphql"
	},
	{
		"name": "DDOTT",
		"url": "https://ddott.net",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://ddott.net/font/auto-grotesk/"
	},
	{
		"name": "Delta Bravo Type",
		"url": "https://www.deltabravotype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Same",
		"source": "https://deltabravo.fontdue.com/graphql"
	},
	{
		"name": "Delve Fonts",
		"url": "https://delvefonts.com",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Same",
		"source": "https://delvefonts.com/fonts/tuppence"
	},
	{
		"name": "Dennis Grauel",
		"url": "https://dennisgrauel.com",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://dennisgrauel.com/licensing"
	},
	{
		"name": "Dinamo",
		"url": "http://www.abcdinamo.com",
		"subfamilyVF": "Yes",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Cheaper",
		"source": "https://abcdinamo.com/buy/diatype"
	},
	{
		"name": "Displaay",
		"url": "https://displaay.net",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Cheaper",
		"source": "https://displaay.net/typeface/avantt"
	},
	{
		"name": "DJR",
		"url": "https://djr.com",
		"subfamilyVF": "Yes",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Cheaper",
		"source": "https://djr.com/roslindale"
	},
	{
		"name": "Dreamtype",
		"url": "https://dreamtype.xyz",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://dreamtype.xyz/pricing"
	},
	{
		"name": "ECAL Typefaces",
		"url": "https://ecal-typefaces.ch",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://ecal-typefaces.ch/typeface/parabole/"
	},
	{
		"name": "Ek Type",
		"url": "https://ektype.in",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://ektype.in/anek-latin.html"
	},
	{
		"name": "Elena Schneider",
		"url": "http://elenaschneider.com",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "http://elenaschneider.com/Retail-fonts"
	},
	{
		"name": "Emtype Foundry",
		"url": "http://emtype.net",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://emtype.net/fonts/ciutadella"
	},
	{
		"name": "EPI",
		"url": "https://epitype.xyz",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://epitype.xyz/shop"
	},
	{
		"name": "Erkin Karamemet",
		"url": "https://erkinkaramemet.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Same",
		"source": "https://erkin-karamemet-studio.fontdue.com/graphql"
	},
	{
		"name": "Etc Foundry",
		"url": "https://etc.supply",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://www.etceteratype.co/"
	},
	{
		"name": "Extraset Foundry",
		"url": "https://extraset.ch",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Same",
		"source": "https://extraset.ch/typefaces/es-park/"
	},
	{
		"name": "F37",
		"url": "http://www.f37foundry.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://f37.com/information"
	},
	{
		"name": "FaceType",
		"url": "http://www.facetype.org",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Unknown",
		"source": "https://www.facetype.org/fonts/newsroom"
	},
	{
		"name": "Faire Type",
		"url": "https://fairetype.com",
		"subfamilyVF": "Split only",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Cheaper",
		"source": "https://fairetype.com/families/octave/purchase"
	},
	{
		"name": "Familiar Faces",
		"url": "https://familiarfaces.xyz",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.plau.design/fontes/vinila"
	},
	{
		"name": "Family Type",
		"url": "https://familytype.co",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Same",
		"source": "https://www.familytype.co/"
	},
	{
		"name": "Fatype",
		"url": "https://www.fatype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.fatype.com/typefaces/ucity"
	},
	{
		"name": "FDI Type Foundry",
		"url": "https://fdi-type.de",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://fdi-type.de/fonts/lettograph/"
	},
	{
		"name": "Fer Cozzi",
		"url": "https://fercozzi.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://fercozzi.com/typefaces/june-expt"
	},
	{
		"name": "Finaltype",
		"url": "https://finaltype.de/en",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://finaltype.de/en/projects/legit-sans"
	},
	{
		"name": "Flavia Zimbardi",
		"url": "https://flaviazim.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://flaviazim.com/typefaces/zc-casual"
	},
	{
		"name": "Flight Mode",
		"url": "https://contemporarytype.com/flight-mode",
		"subfamilyVF": "Yes",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Cheaper",
		"source": "https://backend.contemporarytype.com/api_front/product/science-sans?with-bundles"
	},
	{
		"name": "Florian Karsten",
		"url": "https://fonts.floriankarsten.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://fonts.floriankarsten.com/fk-grotesk-neue"
	},
	{
		"name": "Font Club Belgica",
		"url": "https://fontclubbelgica.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://fontclubbelgica.com/faq"
	},
	{
		"name": "Fontshare",
		"url": "https://www.fontshare.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Unknown",
		"source": "https://api.fontshare.com/v2/fonts"
	},
	{
		"name": "Fontstore",
		"url": "https://www.fontstore.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://api.fontstore.com/v2/fonts"
	},
	{
		"name": "Fontwerk",
		"url": "https://fontwerk.com/en/",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://fontwerk.com/en/faq"
	},
	{
		"name": "Formagari",
		"url": "https://formagari.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://formagari.com/typefaces/scenery"
	},
	{
		"name": "Formula Type",
		"url": "https://www.formulatype.com",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://www.formulatype.com/information"
	},
	{
		"name": "Fort Foundry",
		"url": "https://fortfoundry.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Same",
		"source": "https://fort.fontdue.com/graphql"
	},
	{
		"name": "Foster Type",
		"url": "https://www.fostertype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.fostertype.com/faq"
	},
	{
		"name": "Foundry5",
		"url": "https://foundryfivetype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://foundryfivetype.com/type/averta-pe"
	},
	{
		"name": "Frere-Jones",
		"url": "https://frerejones.com",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://www.slanted.de/?p=811699"
	},
	{
		"name": "FrosType",
		"url": "https://www.frostype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Same",
		"source": "https://www.frostype.xyz/typeface/scenik-mono"
	},
	{
		"name": "Furniture",
		"url": "https://www.furniture.xyz",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Same",
		"source": "https://www.furniture.xyz"
	},
	{
		"name": "G-Type",
		"url": "https://g-type.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://g-type.com/fonts/goskar"
	},
	{
		"name": "Good Type Foundry",
		"url": "https://www.goodtypefoundry.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "More",
		"source": "https://goodtypefoundry.com/wp-json/wc/store/v1/products/6252"
	},
	{
		"name": "Gradient",
		"url": "https://wearegradient.net",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://wearegradient.net/information/"
	},
	{
		"name": "Grilli Type",
		"url": "http://grillitype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.grillitype.com/information"
	},
	{
		"name": "Gruppo Due",
		"url": "https://gruppo-due.com",
		"subfamilyVF": "Yes",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Unknown",
		"source": "https://gruppo-due.com/shop/airdancer"
	},
	{
		"name": "HAL Typefaces",
		"url": "https://type.hanli.eu",
		"subfamilyVF": "Split only",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://hanli.fontdue.com/graphql"
	},
	{
		"name": "Heavyweight",
		"url": "https://heavyweight-type.com",
		"subfamilyVF": "Split only",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Unknown",
		"source": "https://heavyweight-type.com/fonts/beaujon"
	},
	{
		"name": "Herzberg Design Co",
		"url": "https://www.herzbergdesign.com",
		"subfamilyVF": "Split only",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Cheaper",
		"source": "https://www.herzbergdesign.com/libido"
	},
	{
		"name": "Hipertipo",
		"url": "https://www.hipertipo.com/fontes/",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Same",
		"source": "https://www.hipertipo.com/en/fonts/mechanica/license"
	},
	{
		"name": "Hot Type",
		"url": "https://hottype.co",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://hottype.co/fonts/shear"
	},
	{
		"name": "House Industries",
		"url": "https://houseind.com",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://houseindustries.com/"
	},
	{
		"name": "Hurme Design",
		"url": "https://hurmedesign.com/",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://hurmedesign.com/product-category/typefaces/hurme-oval-sans/"
	},
	{
		"name": "HVD Fonts",
		"url": "https://www.hvdfonts.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Same",
		"source": "https://web.archive.org/web/20260731184228/https://www.hvdfonts.com/fonts/bouba-round"
	},
	{
		"name": "Identity Letters",
		"url": "https://www.identity-letters.com",
		"subfamilyVF": "Yes",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://www.identity-letters.com/font-catalog/allrounder-grotesk"
	},
	{
		"name": "In-House Intl foundry",
		"url": "https://weareinhouse.com/types/",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Same",
		"source": "https://weareinhouse.com/types/serrucho-variable-font/"
	},
	{
		"name": "Interval Type",
		"url": "https://intervaltype.com",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://intervaltype.com/product/oceanic-gothic/"
	},
	{
		"name": "Ivy Foundry",
		"url": "https://ivyfoundry.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://ivyfoundry.com/families/ivymode/"
	},
	{
		"name": "J Foundry",
		"url": "https://jfoundry.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://jfoundry.com/fonts/sundry/"
	},
	{
		"name": "Jamie Clark Type",
		"url": "https://www.jamieclarketype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Same",
		"source": "https://jct.fontdue.com/graphql"
	},
	{
		"name": "Jonas Pelzer Typefaces",
		"url": "http://typefaces.jonaspelzer.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "http://jonastype.com/scope"
	},
	{
		"name": "July Type",
		"url": "https://www.julytype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://www.julytype.com/typefaces/jt-cyrax-sans"
	},
	{
		"name": "Jung-Lee Type Foundry",
		"url": "https://j-ltf.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://j-ltf.com/wp-json/wc/store/v1/products?per_page=100"
	},
	{
		"name": "Kanon Foundry",
		"url": "https://kanonfoundry.com",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://www.kanonfoundry.com/clippy"
	},
	{
		"name": "Kerns & Cairns",
		"url": "https://www.kernsandcairns.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://kernsandcairns.fontdue.com/graphql"
	},
	{
		"name": "Kilotype",
		"url": "https://kilotype.de",
		"subfamilyVF": "Yes",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Unknown",
		"source": "https://web.archive.org/web/2026id_/https://kilotype.de/vite/assets/Purchase-D6jV0dqh.js"
	},
	{
		"name": "Klim Type",
		"url": "https://klim.co.nz",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://klim.co.nz/buy/family/"
	},
	{
		"name": "Kometa",
		"url": "https://www.kometa.xyz/",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://kometatype.com/typefaces/attila"
	},
	{
		"name": "Kostic Type",
		"url": "http://www.kostictype.com/",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://fonts.adobe.com/fonts/deuterium-variable"
	},
	{
		"name": "La Bolde Vita",
		"url": "https://laboldevita.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Same",
		"source": "https://laboldevita.fontdue.com/graphql"
	},
	{
		"name": "Latinotype",
		"url": "http://latinotype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://latinotype.fontdue.com/graphql"
	},
	{
		"name": "Laura Worthington Design",
		"url": "https://lauraworthingtondesign.com/fonts/",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://lauraworthingtondesign.com/font/intermingle"
	},
	{
		"name": "Lazydogs Typefoundry",
		"url": "https://www.lazydogs.de/",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://lazydogs.de/support"
	},
	{
		"name": "League of Movable Type",
		"url": "https://www.theleagueofmoveabletype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Unknown",
		"source": "https://www.theleagueofmoveabletype.com/league-spartan"
	},
	{
		"name": "Leinster Type",
		"url": "https://www.leinstertype.com",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://www.leinstertype.com/fonts/multiflex"
	},
	{
		"name": "Lettermin",
		"url": "https://lettermin.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://lettermin.com/fonts/enra-sans"
	},
	{
		"name": "Letterror",
		"url": "https://letterror.com/",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://letterror.fontdue.com/graphql"
	},
	{
		"name": "Letters from Sweden",
		"url": "https://lettersfromsweden.se",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Same",
		"source": "https://lettersfromsweden.se/font/ivar-mono/"
	},
	{
		"name": "Lift Type",
		"url": "http://lift-type.fr",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.lift-type.fr/products/spinelo-pack-family"
	},
	{
		"name": "Lineto",
		"url": "https://lineto.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://lineto.com/typefaces/kleisch-variable"
	},
	{
		"name": "lo-ol Type",
		"url": "https://www.lo-ol.design",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "More",
		"source": "https://www.lo-ol.design/catalog/fuzar"
	},
	{
		"name": "London Type Foundry",
		"url": "https://londontype.co.uk",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://londontype.co.uk/fonts/ldn-shadwell"
	},
	{
		"name": "Love Letters",
		"url": "https://www.futurefonts.com/loveletters",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.futurefonts.com/api/v1/typefaces/108"
	},
	{
		"name": "LucasFonts",
		"url": "http://www.lucasfonts.com",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Unknown",
		"source": "https://www.lucasfonts.com/fonts/package/thesans-c5"
	},
	{
		"name": "Luzi Type",
		"url": "https://luzi-type.ch",
		"subfamilyVF": "Yes",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Unknown",
		"source": "https://luzi-type.ch/shop/spezia-normal"
	},
	{
		"name": "Manic Type",
		"url": "https://www.manictype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Same",
		"source": "https://manictype.fontdue.com/graphql"
	},
	{
		"name": "Mark Simonson",
		"url": "https://www.marksimonson.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://www.marksimonson.com/fonts/view/proxima-nova"
	},
	{
		"name": "Marmite Defontes",
		"url": "https://marmitedefontes.com/",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Same",
		"source": "https://store.marmitedefontes.com/graphql"
	},
	{
		"name": "Mass-Driver",
		"url": "https://mass-driver.com/",
		"subfamilyVF": "Yes",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Cheaper",
		"source": "https://mass-driver.com/typefaces/md-system/"
	},
	{
		"name": "MCKL",
		"url": "https://mckltype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.mckltype.com/typefaces/owners"
	},
	{
		"name": "Metis Foundry",
		"url": "http://metis-foundry.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "More",
		"source": "https://store.metis-foundry.com/graphql"
	},
	{
		"name": "Modern Type",
		"url": "https://www.modern-type.com",
		"subfamilyVF": "Split only",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://modern-type.fontdue.com/graphql"
	},
	{
		"name": "Monkey Type",
		"url": "http://monkeytype.xyz",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://mnkytype.com/louie"
	},
	{
		"name": "Monokrom",
		"url": "https://monokrom.no",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://store.monokrom.no/graphql"
	},
	{
		"name": "Mota Italic",
		"url": "https://www.motaitalic.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://motaitalic.com/product/show-me-the-mono/"
	},
	{
		"name": "muccaTypo",
		"url": "https://muccatypo.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://store.muccatypo.com/graphql"
	},
	{
		"name": "Muhittin Güneş Studio",
		"url": "https://gunesmuhittin.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.gunesmuhittin.com/buy/antra"
	},
	{
		"name": "MuirMcNeil",
		"url": "http://www.muirmcneil.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://muirmcneil.com/shop/"
	},
	{
		"name": "Multiocular Type",
		"url": "https://www.multioculartype.co",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://store.multioculartype.co/graphql"
	},
	{
		"name": "Naipe",
		"url": "https://store.naipefoundry.com",
		"subfamilyVF": "Split only",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://store.naipefoundry.com/graphql"
	},
	{
		"name": "NaN",
		"url": "https://nan.xyz",
		"subfamilyVF": "Yes",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Cheaper",
		"source": "https://www.nan.xyz/eula/"
	},
	{
		"name": "Ndiscover",
		"url": "https://ndiscover.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://ndiscover.com/family/worker/"
	},
	{
		"name": "Netvarec Type",
		"url": "https://type.netvarec.ooo/",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "More",
		"source": "https://nctype.com/nc-burrata/"
	},
	{
		"name": "newglyph",
		"url": "http://newglyph.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://newglyph.com/typeface/atacama/"
	},
	{
		"name": "Nguyen Gobber",
		"url": "https://nguyengobber.com/typefaces",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://nguyengobber.com/typefaces/monopol"
	},
	{
		"name": "nice to type",
		"url": "https://nicetotype.de/",
		"subfamilyVF": "Yes",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Cheaper",
		"source": "https://nicetotype.jp/retailtypefaces/massimo-grafia/"
	},
	{
		"name": "NM Type",
		"url": "http://nmtype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://nmtype.com/sixten/"
	},
	{
		"name": "Non Foundry",
		"url": "https://nonfoundry.com",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://nonfoundry.com/faq"
	},
	{
		"name": "Not Your Type",
		"url": "https://notyourtype.nl",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Unknown",
		"source": "https://www.notyourtype.nl/typefaces/nono/"
	},
	{
		"name": "Nouvelle Noire",
		"url": "https://www.nouvellenoire.ch",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://nouvellenoire.ch/information/"
	},
	{
		"name": "Nova Type Foundry",
		"url": "https://novatypefoundry.com",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://www.fontspring.com/fonts/nova-type-foundry/laca"
	},
	{
		"name": "Nymark Type",
		"url": "https://www.nymarktype.co",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Cheaper",
		"source": "http://www.nymarktype.co/buy/tranemo/"
	},
	{
		"name": "Obrysy",
		"url": "https://obrysy.xyz",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://obrysy.xyz/buy-fonts/"
	},
	{
		"name": "Occupant Fonts",
		"url": "https://occupantfonts.com",
		"subfamilyVF": "Split only",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://api.typenetwork.com/api/1/public/families/?slug=antenna-2-vf"
	},
	{
		"name": "OH no Type Co.",
		"url": "http://www.ohnotype.co",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://ohnotype.co/fonts/obviously"
	},
	{
		"name": "Okay Type",
		"url": "http://okaytype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://okaytype.com/euchre"
	},
	{
		"name": "Omnibus-Type",
		"url": "https://www.omnibus-type.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Unknown",
		"source": "https://www.omnibus-type.com/fonts/archivo/"
	},
	{
		"name": "Optimo",
		"url": "https://optimo.ch",
		"subfamilyVF": "Yes",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Cheaper",
		"source": "https://optimo.ch/cart_items/purchase_options/75"
	},
	{
		"name": "Or Type",
		"url": "https://ortype.is",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://ortype.is"
	},
	{
		"name": "Otherwhere Collective",
		"url": "https://otherwherecollective.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://otherwherecollective.com/font-licensing-simplified/"
	},
	{
		"name": "Out of the Dark",
		"url": "https://outofthedark.xyz",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.outofthedark.swiss/api/getmenu.php?typeface=Atak"
	},
	{
		"name": "Pangram Pangram",
		"url": "https://pangrampangram.com",
		"subfamilyVF": "Yes",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Unknown",
		"source": "https://pangrampangram.com/products/neue-montreal.json"
	},
	{
		"name": "Peregrin Studio",
		"url": "https://peregrinstudio.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://peregrinstudio.com/work/denton"
	},
	{
		"name": "PFA Typefaces",
		"url": "https://pfa-typefaces.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://pfa-typefaces.com"
	},
	{
		"name": "Pizza Typefaces",
		"url": "https://typefaces.pizza",
		"subfamilyVF": "Yes",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Cheaper",
		"source": "https://typefaces.pizza/licences/"
	},
	{
		"name": "Plain Form",
		"url": "https://plain-form.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Same",
		"source": "https://web.archive.org/web/2026id_/https://plain-form.com/licensing"
	},
	{
		"name": "Plau",
		"url": "https://plau.co/en/",
		"subfamilyVF": "Split only",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://admin.plau.design/api/collections/compasso?lang=en"
	},
	{
		"name": "Playtype",
		"url": "https://playtype.com",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://playtype.com/typefaces/north-east/"
	},
	{
		"name": "Poem",
		"url": "https://www.poem-editions.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Same",
		"source": "https://www.poem-editions.com/library/phong"
	},
	{
		"name": "Polytype",
		"url": "https://polytype.co.uk",
		"subfamilyVF": "Yes",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Cheaper",
		"source": "https://polytype.co.uk/freizeit/"
	},
	{
		"name": "Positype",
		"url": "https://positype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://positype.com/api/commerce/license/ace"
	},
	{
		"name": "Power Type Foundry",
		"url": "https://power-type.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Same",
		"source": "https://powertypefoundry.gumroad.com/l/power-grotesk"
	},
	{
		"name": "Primary Foundry",
		"url": "http://primary-foundry.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Same",
		"source": "https://primary-foundry.com/typefaces/captured/"
	},
	{
		"name": "Process",
		"url": "https://processtypefoundry.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://processtypefoundry.com/fonts/coordinates/"
	},
	{
		"name": "Production Type",
		"url": "https://www.productiontype.com",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://qd7iq686.apicdn.sanity.io/v2023-07-01/data/query/production"
	},
	{
		"name": "Prologue Type",
		"url": "https://www.prologuetype.co",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://prologuetype.gumroad.com/l/posthumous"
	},
	{
		"name": "Proof of Words",
		"url": "https://proof-of-words.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://proof-of-words.com/typefaces/limerick"
	},
	{
		"name": "PSTL",
		"url": "https://pstypelab.com",
		"subfamilyVF": "Split only",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://store.pstypelab.com/graphql"
	},
	{
		"name": "Public Type",
		"url": "https://www.publictype.us",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Same",
		"source": "https://store.publictype.us/graphql"
	},
	{
		"name": "Pyte Foundry",
		"url": "http://thepytefoundry.net",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Unknown",
		"source": "http://thepytefoundry.net/typefaces/kinckq"
	},
	{
		"name": "R-Typography",
		"url": "https://www.r-typography.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.r-typography.com/api/v1/fontfamilydetail/204/ramboia"
	},
	{
		"name": "Radluka",
		"url": "https://www.radluka.com",
		"subfamilyVF": "Split only",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://store.radluka.com/graphql"
	},
	{
		"name": "Rellence",
		"url": "https://rellence.com/",
		"subfamilyVF": "Split only",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://rellence.com/albra?font=albra-sans"
	},
	{
		"name": "requ (29LT)",
		"url": "https://www.29lt.com/",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://www.29lt.com/product/29lt-azahar-text-al/"
	},
	{
		"name": "Reset Type Studio",
		"url": "https://reset-type.com/",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://reset-type.com/faqs"
	},
	{
		"name": "Resistenza",
		"url": "https://www.rsztype.com",
		"subfamilyVF": "Split only",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://resistenzatype.fontdue.com/graphql"
	},
	{
		"name": "Riptype",
		"url": "https://www.riptype.xyz",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Same",
		"source": "https://www.riptype.xyz/product/generator"
	},
	{
		"name": "Road to Venice Type",
		"url": "https://www.r-vtype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.r-vtype.com/cart/"
	},
	{
		"name": "Rosetta",
		"url": "https://www.rosettatype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://shop.rosettatype.com/"
	},
	{
		"name": "Schick Toikka",
		"url": "https://www.schick-toikka.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.schick-toikka.com/lateral/buy"
	},
	{
		"name": "Schriftlabor",
		"url": "https://schriftlabor.at",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.fontbros.com/font-family/strokeweight"
	},
	{
		"name": "Setup",
		"url": "https://www.setuptype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Unknown",
		"source": "https://buy.setuptype.com/kue"
	},
	{
		"name": "Signal",
		"url": "http://signalfoundry.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Same",
		"source": "https://signalfoundry.com/typefaces/reckham"
	},
	{
		"name": "Smuss Type Kiosk",
		"url": "https://typekiosk.smuss.studio",
		"subfamilyVF": "Yes",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Cheaper",
		"source": "https://typekiosk.smuss.studio/buy?font=bureau-sans"
	},
	{
		"name": "Socio Type",
		"url": "https://socio-type.com",
		"subfamilyVF": "Yes",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Cheaper",
		"source": "https://socio-type.com/faq"
	},
	{
		"name": "Source Type",
		"url": "https://www.sourcetype.com/typefaces/",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://www.sourcetype.com/files/Rapid_ST_Specimen.pdf"
	},
	{
		"name": "Spaghetype",
		"url": "https://www.spaghetype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://www.julytype.com/typefaces/jt-disway"
	},
	{
		"name": "Storm Type",
		"url": "https://www.stormtype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Same",
		"source": "https://www.stormtype.com/families/teuton"
	},
	{
		"name": "Studio Feixen Fonts",
		"url": "https://fonts.studiofeixen.ch",
		"subfamilyVF": "Yes",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Cheaper",
		"source": "https://fonts.studiofeixen.ch/store"
	},
	{
		"name": "Studio René Bieder",
		"url": "https://www.renebieder.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.renebieder.com/info"
	},
	{
		"name": "Suitcase",
		"url": "https://www.suitcasetype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Same",
		"source": "https://www.myfonts.com/collections/atyp-font-suitcase-type-foundry/products.json"
	},
	{
		"name": "Superior Type",
		"url": "https://www.superiortype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.superiortype.com/faqs"
	},
	{
		"name": "Supertype",
		"url": "https://supertype.de",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://supertype.de/fonts/adapt"
	},
	{
		"name": "Swiss Typefaces",
		"url": "https://www.swisstypefaces.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.swisstypefaces.com/fonts/only-extended/"
	},
	{
		"name": "Teeline Fonts",
		"url": "https://teelinefonts.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://teelinefonts.com/typefaces/plenaire"
	},
	{
		"name": "Tegamitype",
		"url": "https://tegamitype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://tegamitype.com/fonts/MZ6K5348BQLV"
	},
	{
		"name": "The Letters",
		"url": "https://theletters.co/",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://store.theletters.co/"
	},
	{
		"name": "Threedotstype",
		"url": "https://threedotstype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Same",
		"source": "https://threedotstype.com/product/radius/"
	},
	{
		"name": "Tipografies",
		"url": "https://tipografies.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://tipografies.com/fonts/oscila"
	},
	{
		"name": "TipoType",
		"url": "http://tipotype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://tipotype.com/thermal/"
	},
	{
		"name": "Tiro Typeworks",
		"url": "https://www.tiro.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://www.tiro.com/fragments/purchase-packages?slug=sitka"
	},
	{
		"name": "Tokotype",
		"url": "https://www.tokotype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://www.tokotype.com/api/typefaces/font/gramatika"
	},
	{
		"name": "Tour de Force",
		"url": "https://tourdefonts.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://tourdefonts.com/fonts/deserter"
	},
	{
		"name": "Troisième Type",
		"url": "https://troisieme-type.com/",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://troisiemetype.gumroad.com/l/calvin"
	},
	{
		"name": "Type Different",
		"url": "https://www.typedifferent.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://www.typedifferent.com/fonts/bd-alien"
	},
	{
		"name": "Type Salon",
		"url": "https://type-salon.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Same",
		"source": "https://type-salon.com/izdelek/spektra/"
	},
	{
		"name": "Type-Ø-Tones",
		"url": "http://type-o-tones.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Same",
		"source": "https://type-o-tones.com/fonts/placa"
	},
	{
		"name": "Typearture",
		"url": "https://www.typearture.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.typearture.com/product/schijn/"
	},
	{
		"name": "Typeji",
		"url": "https://typeji.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "More",
		"source": "https://typeji.fontdue.com/graphql"
	},
	{
		"name": "Typejockeys",
		"url": "https://www.typejockeys.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.typejockeys.com/en/font/marie"
	},
	{
		"name": "TypeMates",
		"url": "https://www.typemates.com/",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "More",
		"source": "https://www.typemates.com/fonts/halvar/buy"
	},
	{
		"name": "Typerepublic",
		"url": "https://typerepublic.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://typerepublic.com/fonts/brossa/"
	},
	{
		"name": "TypeTogether",
		"url": "https://www.type-together.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Unknown",
		"source": "https://www.typetogether.com/fonts/portada-text-arabic/configure"
	},
	{
		"name": "TypeType",
		"url": "https://typetype.org",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://typetype.org/fonts/tt-norms-pro/"
	},
	{
		"name": "Typeverything",
		"url": "https://typeverything.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://typeverything.com/choco/buy"
	},
	{
		"name": "Typocopter",
		"url": "https://typocopter.com",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://archive.org/wayback/available?url=typocopter.com"
	},
	{
		"name": "Typotheque",
		"url": "https://www.typotheque.com",
		"subfamilyVF": "Yes",
		"vfWithoutFamily": "Subfamily",
		"priceVsFamily": "Unknown",
		"source": "https://www.typotheque.com/help"
	},
	{
		"name": "Tüpokompanii",
		"url": "https://typokompanii.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Same",
		"source": "https://typokompanii.fontdue.com/graphql"
	},
	{
		"name": "U.S. Graphics Company",
		"url": "https://usgraphics.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Same",
		"source": "https://web.archive.org/web/2026id_/https://usgraphics.com/products/berkeley-mono"
	},
	{
		"name": "Undercase",
		"url": "https://www.undercase.xyz",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://undercase.xyz/fonts/mausoleum"
	},
	{
		"name": "Underscore Type",
		"url": "https://underscoretype.com/",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://www.myfonts.com/collections/constant-font-underscore/products.json"
	},
	{
		"name": "Underware",
		"url": "http://www.underware.nl",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "More",
		"source": "https://www.underware.nl/fonts/zeitung/buy"
	},
	{
		"name": "Vectro",
		"url": "https://www.vectrotype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.vectrotype.com/static/js/main.2b345d4e.js"
	},
	{
		"name": "Very Cool Studio",
		"url": "https://www.verycoolstudio.com",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://verycoolstudio.com/articles/bruphy-design-information"
	},
	{
		"name": "Vibrant Types",
		"url": "https://www.vibrant-types.com/",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://www.vibrant-types.com/adelbrook/"
	},
	{
		"name": "W Type Foundry",
		"url": "https://wtypefoundry.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "Yes",
		"priceVsFamily": "Cheaper",
		"source": "https://wtypefoundry.com/typefaces/saes-grotesk"
	},
	{
		"name": "Weltkern",
		"url": "https://weltkern.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Same",
		"source": "https://weltkern.com/typefaces/burns"
	},
	{
		"name": "WiseType",
		"url": "https://wisetype.nl",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://wisetype.nl/typefaces/saltburn"
	},
	{
		"name": "Workhorse Type Foundry",
		"url": "https://workhorsetypefoundry.com",
		"subfamilyVF": "Unclear",
		"vfWithoutFamily": "Unclear",
		"priceVsFamily": "Unknown",
		"source": "https://workhorse.studio/products.json"
	},
	{
		"name": "XO Type Co",
		"url": "https://xotype.co",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://xotype.co/family/bronzo/"
	},
	{
		"name": "XYZ Type",
		"url": "https://xyztype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://xyztype.com/fonts/aglet/aglet-sans"
	},
	{
		"name": "Yep! Type Foundry",
		"url": "https://yeptype.com",
		"subfamilyVF": "No",
		"vfWithoutFamily": "No",
		"priceVsFamily": "Unknown",
		"source": "https://yeptype.com/fonts/unifora"
	}
]
