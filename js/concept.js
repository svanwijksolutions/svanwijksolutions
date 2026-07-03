/* ============================================================
   GRATIS CONCEPT FORMULIER — S. van Wijk Solutions
   - Bedrijfstype zoekbalk met autocomplete
   - Paginavoorstel per branche (aangevinkt + reden)
   - Talen (uitgebreid + eigen invoer)
   - Kleuren (color picker + hex + EyeDropper)
   - Pakketten (dynamisch toevoegen)
   - Formspree submit met nette opmaak
============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  var form = document.getElementById('conceptForm');
  if (!form) return;

  /* ─────────────────────────────────────────────
     BRANCHE DATA — type + voorgestelde pagina's
     paginas = interne id's (zie PAGINA_FORM_ID)
  ───────────────────────────────────────────── */
  var BRANCHES = [
    { naam: 'Kapper / kapsalon', cat: 'Beauty en verzorging', keywords: ['kapper','kapsalon','barbershop','barbier','haar','knippen','haarstylist','hairstylist','coiffure'], paginas: [{id:'home',waarom:'De etalage van je salon: sfeer, stijl en meteen een knop om een afspraak te maken.'},{id:'behandelingen',waarom:'Laat per behandeling zien wat je doet (knippen, kleuren, styling), zodat klanten weten wat ze kunnen verwachten.'},{id:'prijzen',waarom:'Een heldere prijslijst voorkomt verrassingen en trekt juist de klanten die bij je passen.'},{id:'reviews',waarom:'Ervaringen van tevreden klanten geven nieuwe bezoekers net dat laatste zetje om te boeken.'},{id:'overons',waarom:'Mensen kiezen een kapper op gevoel. Jouw verhaal en team maken het persoonlijk.'},{id:'contact',waarom:'Adres, openingstijden en een kaart, zodat mensen je makkelijk vinden en langskomen.'}] },
    { naam: 'Schoonheidsspecialist / schoonheidssalon', cat: 'Beauty en verzorging', keywords: ['schoonheidsspecialist','schoonheidssalon','beauty','huidverzorging','gezichtsbehandeling','cosmetisch','beautysalon'], paginas: [{id:'home',waarom:'Een verzorgde eerste indruk die meteen rust en professionaliteit uitstraalt.'},{id:'behandelingen',waarom:'Per behandeling uitleg en resultaten, zodat klanten precies weten waarvoor ze komen.'},{id:'prijzen',waarom:'Transparante tarieven wekken vertrouwen en trekken de juiste klanten.'},{id:'reviews',waarom:'Voor- en na-resultaten en ervaringen overtuigen twijfelaars.'},{id:'overons',waarom:'Jouw expertise en aanpak maken het verschil in een vak waarin vertrouwen telt.'},{id:'contact',waarom:'Makkelijk een afspraak maken en je salon vinden.'}] },
    { naam: 'Nagelstudio', cat: 'Beauty en verzorging', keywords: ['nagelstudio','nagels','nail','manicure','pedicure','nagelstyliste'], paginas: [{id:'home',waarom:'Visueel en sfeervol: jouw werk spreekt direct aan.'},{id:'portfolio',waarom:'Een galerij met jouw mooiste sets is je sterkste verkoopargument.'},{id:'behandelingen',waarom:'Overzicht van wat je aanbiedt, van gellak tot acryl.'},{id:'prijzen',waarom:'Duidelijke tarieven per behandeling voorkomen onduidelijkheid.'},{id:'overons',waarom:'Jouw stijl en persoonlijkheid onderscheiden je van de studio om de hoek.'},{id:'contact',waarom:'Snel een afspraak maken en je studio vinden.'}] },
    { naam: 'Massagepraktijk / masseur', cat: 'Beauty en verzorging', keywords: ['massage','masseur','massagepraktijk','ontspanning','wellness','masseuse'], paginas: [{id:'home',waarom:'Een rustige, vertrouwenwekkende uitstraling die past bij ontspanning.'},{id:'behandelingen',waarom:'Uitleg per massagevorm, zodat klanten de juiste keuze maken.'},{id:'prijzen',waarom:'Heldere tarieven en de duur per sessie scheppen duidelijkheid.'},{id:'reviews',waarom:'Ervaringen van klanten nemen de drempel weg voor een eerste bezoek.'},{id:'overons',waarom:'Vertrouwen is alles: jouw achtergrond en aanpak stellen mensen gerust.'},{id:'contact',waarom:'Eenvoudig een afspraak maken.'}] },
    { naam: 'Fysiotherapeut', cat: 'Gezondheid en zorg', keywords: ['fysiotherapeut','fysio','fysiotherapie','manueel','revalidatie','therapie'], paginas: [{id:'home',waarom:'Een professionele, geruststellende eerste indruk met een duidelijke route naar een afspraak.'},{id:'diensten',waarom:'Overzicht van je specialisaties (bijv. sport, rug, revalidatie), zodat pati\u00ebnten de juiste zorg vinden.'},{id:'behandelingen',waarom:'Uitleg over hoe een behandeling verloopt, wat onzekerheid wegneemt.'},{id:'faq',waarom:'Antwoorden op vragen over vergoeding, verwijzing en aanpak schelen veel telefoontjes.'},{id:'overons',waarom:'Pati\u00ebnten willen weten wie hen behandelt. Jouw team en aanpak scheppen vertrouwen.'},{id:'contact',waarom:'Praktijkgegevens, openingstijden en een makkelijke afspraakoptie.'}] },
    { naam: 'Huisarts / huisartsenpraktijk', cat: 'Gezondheid en zorg', keywords: ['huisarts','huisartsenpraktijk','dokter','praktijk','medisch'], paginas: [{id:'home',waarom:'Duidelijke, toegankelijke informatie staat voorop voor pati\u00ebnten van alle leeftijden.'},{id:'diensten',waarom:'Welke zorg biedt de praktijk, en hoe werkt het spreekuur.'},{id:'faq',waarom:'Veelgestelde vragen over afspraken, herhaalrecepten en spoed schelen de balie veel werk.'},{id:'overons',waarom:'Het team voorstellen maakt de praktijk persoonlijk en herkenbaar.'},{id:'contact',waarom:'Openingstijden, telefoonnummers en hoe je een afspraak maakt, meteen vindbaar.'}] },
    { naam: 'Tandarts / tandartspraktijk', cat: 'Gezondheid en zorg', keywords: ['tandarts','tandartspraktijk','gebit','mondzorg','orthodontie','dentaal'], paginas: [{id:'home',waarom:'Een verzorgde, vertrouwenwekkende uitstraling die angst wegneemt.'},{id:'behandelingen',waarom:'Uitleg per behandeling neemt onzekerheid weg bij nieuwe pati\u00ebnten.'},{id:'prijzen',waarom:'Inzicht in tarieven en vergoedingen voorkomt verrassingen.'},{id:'faq',waarom:'Antwoorden op vragen over kosten, angst en procedures verlagen de drempel.'},{id:'overons',waarom:'Het team leren kennen maakt een bezoek minder spannend.'},{id:'contact',waarom:'Praktijkinfo, openingstijden en afspraak maken.'}] },
    { naam: 'Psycholoog / therapeut', cat: 'Gezondheid en zorg', keywords: ['psycholoog','therapeut','psychotherapie','coach','ggz','counseling','hulpverlening'], paginas: [{id:'home',waarom:'Een rustige, veilige uitstraling waarin mensen zich herkend voelen.'},{id:'diensten',waarom:'Welke klachten en trajecten je behandelt, helder uitgelegd.'},{id:'faq',waarom:'Vragen over vergoeding, wachttijd en werkwijze beantwoorden neemt drempels weg.'},{id:'overons',waarom:'Een persoonlijke kennismaking is cruciaal: mensen kiezen jou op gevoel.'},{id:'contact',waarom:'Een laagdrempelige manier om contact op te nemen of aan te melden.'}] },
    { naam: 'Di\u00ebtist / voedingsdeskundige', cat: 'Gezondheid en zorg', keywords: ['dietist','voedingsdeskundige','voeding','dieet','gewicht','voedingscoach'], paginas: [{id:'home',waarom:'Een frisse, gezonde uitstraling die motiveert.'},{id:'diensten',waarom:'Je specialisaties en aanpak, zodat cli\u00ebnten weten of je bij hun doel past.'},{id:'prijzen',waarom:'Duidelijkheid over trajecten en vergoeding.'},{id:'reviews',waarom:'Resultaten en ervaringen van cli\u00ebnten werken aanstekelijk.'},{id:'overons',waarom:'Jouw achtergrond en visie op voeding scheppen vertrouwen.'},{id:'contact',waarom:'Makkelijk een eerste afspraak inplannen.'}] },
    { naam: 'Coach / lifecoach', cat: 'Coaching en advies', keywords: ['coach','lifecoach','coaching','persoonlijke ontwikkeling','begeleiding','mentor'], paginas: [{id:'home',waarom:'Als coach verkoop je vertrouwen. De homepagina moet meteen resoneren met je doelgroep.'},{id:'overons',waarom:'Jouw eigen verhaal en aanpak zijn je belangrijkste verkoopargument.'},{id:'diensten',waarom:'Helder omschreven trajecten, zodat mensen weten wat ze krijgen.'},{id:'prijzen',waarom:'Transparante pakketten nemen twijfel weg en trekken serieuze cli\u00ebnten.'},{id:'reviews',waarom:'Ervaringen van eerdere cli\u00ebnten maken je aanpak tastbaar en geloofwaardig.'},{id:'contact',waarom:'Een laagdrempelig kennismakingsgesprek als eerste stap.'}] },
    { naam: 'Business coach / zakelijk coach', cat: 'Coaching en advies', keywords: ['business coach','zakelijk coach','ondernemerscoach','leiderschap','teamcoach'], paginas: [{id:'home',waarom:'Een professionele uitstraling die ondernemers en managers aanspreekt.'},{id:'overons',waarom:'Jouw ervaring en trackrecord geven bedrijven vertrouwen om met je in zee te gaan.'},{id:'diensten',waarom:'Concrete trajecten en programma\'s, helder omschreven.'},{id:'portfolio',waarom:'Cases en resultaten laten zien dat jouw aanpak werkt.'},{id:'prijzen',waarom:'Duidelijke pakketten maken de investering bespreekbaar.'},{id:'contact',waarom:'Een makkelijke manier om een strategiegesprek in te plannen.'}] },
    { naam: 'Consultant / adviseur', cat: 'Coaching en advies', keywords: ['consultant','adviseur','advies','consultancy','interim','expert'], paginas: [{id:'home',waarom:'Autoriteit uitstralen vanaf de eerste seconde.'},{id:'overons',waarom:'Jouw expertise en aanpak onderscheiden je van de rest.'},{id:'diensten',waarom:'Welke vraagstukken je oplost, concreet en herkenbaar.'},{id:'portfolio',waarom:'Cases bewijzen je waarde beter dan woorden.'},{id:'blog',waarom:'Kennisartikelen positioneren je als expert en trekken organisch bezoekers.'},{id:'contact',waarom:'Een directe route naar een adviesgesprek.'}] },
    { naam: 'Loodgieter', cat: 'Technische dienstverlening', keywords: ['loodgieter','loodgieterswerk','sanitair','cv','verwarming','lekkage','installateur'], paginas: [{id:'home',waarom:'Wie een loodgieter zoekt heeft vaak haast. Meteen duidelijk wat je doet en hoe je bereikbaar bent.'},{id:'diensten',waarom:'Overzicht van je werkzaamheden, van lekkage tot complete badkamer.'},{id:'portfolio',waarom:'Foto\'s van uitgevoerd werk bewijzen je vakmanschap.'},{id:'reviews',waarom:'Reviews over snelheid en betrouwbaarheid geven de doorslag.'},{id:'overons',waarom:'Een gezicht en verhaal maken een vakman betrouwbaar.'},{id:'contact',waarom:'Telefoonnummer en aanvraagformulier prominent in beeld.'}] },
    { naam: 'Elektricien', cat: 'Technische dienstverlening', keywords: ['elektricien','elektra','installatie','groepenkast','verlichting','zonnepanelen'], paginas: [{id:'home',waarom:'Snel duidelijk wat je doet en dat je betrouwbaar en bereikbaar bent.'},{id:'diensten',waarom:'Van storing tot complete installatie: laat je hele aanbod zien.'},{id:'portfolio',waarom:'Uitgevoerde projecten tonen je vakmanschap.'},{id:'reviews',waarom:'Ervaringen over netheid en vakwerk overtuigen nieuwe klanten.'},{id:'overons',waarom:'Persoonlijkheid en betrouwbaarheid maken het verschil.'},{id:'contact',waarom:'Makkelijk een offerte of storing melden.'}] },
    { naam: 'Schilder / schildersbedrijf', cat: 'Technische dienstverlening', keywords: ['schilder','schildersbedrijf','schilderwerk','verf','buitenschilderwerk','binnenschilderwerk'], paginas: [{id:'home',waarom:'Een verzorgde uitstraling die meteen kwaliteit uitademt.'},{id:'portfolio',waarom:'Foto\'s van eerder werk zijn je sterkste verkoopargument.'},{id:'diensten',waarom:'Binnen, buiten, behang: laat zien wat je allemaal doet.'},{id:'reviews',waarom:'Tevreden klanten overtuigen twijfelaars.'},{id:'overons',waarom:'Vakmanschap met een gezicht erachter wekt vertrouwen.'},{id:'contact',waarom:'Eenvoudig een vrijblijvende offerte aanvragen.'}] },
    { naam: 'Klusbedrijf / handyman', cat: 'Technische dienstverlening', keywords: ['klusbedrijf','klusjesman','handyman','allround','onderhoud','timmerman','klussen'], paginas: [{id:'home',waarom:'Laat meteen zien dat je van vele markten thuis bent.'},{id:'diensten',waarom:'Een overzicht van alle klussen die je aanpakt.'},{id:'portfolio',waarom:'Foto\'s van uiteenlopende klussen tonen je veelzijdigheid.'},{id:'reviews',waarom:'Betrouwbaarheid en afspraken nakomen: dat bewijzen reviews.'},{id:'overons',waarom:'Een persoonlijk verhaal maakt je benaderbaar.'},{id:'contact',waarom:'Snel een klus aanvragen.'}] },
    { naam: 'Aannemer / bouwbedrijf', cat: 'Bouw en renovatie', keywords: ['aannemer','bouwbedrijf','bouw','verbouwing','nieuwbouw','renovatie','aanbouw'], paginas: [{id:'home',waarom:'Vertrouwen en vakmanschap uitstralen bij een grote investering.'},{id:'diensten',waarom:'Van verbouwing tot nieuwbouw: laat je volledige aanbod zien.'},{id:'portfolio',waarom:'Een uitgebreid portfolio van projecten is doorslaggevend.'},{id:'reviews',waarom:'Referenties van eerdere opdrachtgevers geven zekerheid.'},{id:'overons',waarom:'Het bedrijf en team achter het werk scheppen vertrouwen.'},{id:'vacatures',waarom:'Groeiende bouwbedrijven zoeken vakmensen. Toon je openstaande functies.'},{id:'contact',waarom:'Een makkelijke route naar een offerte of kennismaking.'}] },
    { naam: 'Dakdekker', cat: 'Bouw en renovatie', keywords: ['dakdekker','dak','dakbedekking','dakwerk','daklekkage','dakrenovatie'], paginas: [{id:'home',waarom:'Snel duidelijk dat je betrouwbaar bent voor een belangrijke klus.'},{id:'diensten',waarom:'Platte daken, hellende daken, reparaties: laat je specialismen zien.'},{id:'portfolio',waarom:'Foto\'s van daken die je hebt aangepakt geven zekerheid.'},{id:'reviews',waarom:'Ervaringen nemen twijfel weg bij zo\'n grote investering.'},{id:'overons',waarom:'Een betrouwbaar gezicht achter het bedrijf.'},{id:'contact',waarom:'Eenvoudig een inspectie of offerte aanvragen.'}] },
    { naam: 'Installatiebedrijf', cat: 'Bouw en renovatie', keywords: ['installatiebedrijf','installatie','cv','warmtepomp','airco','ventilatie','duurzaam'], paginas: [{id:'home',waarom:'Duidelijk wat je installeert en dat je betrouwbaar bent.'},{id:'diensten',waarom:'Van warmtepomp tot airco: laat je hele aanbod zien.'},{id:'portfolio',waarom:'Uitgevoerde installaties tonen je expertise.'},{id:'faq',waarom:'Vragen over garantie, subsidie en onderhoud beantwoorden schept vertrouwen.'},{id:'overons',waarom:'Het team en de aanpak achter het bedrijf.'},{id:'contact',waarom:'Makkelijk een adviesgesprek of offerte aanvragen.'}] },
    { naam: 'Stukadoor / tegelzetter', cat: 'Bouw en renovatie', keywords: ['stukadoor','tegelzetter','stucwerk','tegels','betegelen','stuc','pleisterwerk'], paginas: [{id:'home',waarom:'Strak afgewerkt werk vraagt om een strakke presentatie.'},{id:'portfolio',waarom:'Vakmanschap zie je pas als je het toont: foto\'s overtuigen direct.'},{id:'diensten',waarom:'Welke technieken en afwerkingen je aanbiedt.'},{id:'reviews',waarom:'Tevreden klanten bevestigen je kwaliteit.'},{id:'overons',waarom:'Een persoonlijk verhaal achter het vakwerk.'},{id:'contact',waarom:'Eenvoudig een offerte aanvragen.'}] },
    { naam: 'Hovenier / tuinman', cat: 'Groen en buitenruimte', keywords: ['hovenier','tuinman','tuin','tuinaanleg','tuinonderhoud','bestrating','groenvoorziening'], paginas: [{id:'home',waarom:'Groen en sfeervol: laat meteen zien wat je maakt.'},{id:'portfolio',waarom:'Foto\'s van aangelegde tuinen zijn je beste visitekaartje.'},{id:'diensten',waarom:'Aanleg, onderhoud, bestrating: toon je hele aanbod.'},{id:'reviews',waarom:'Ervaringen van tuinbezitters overtuigen nieuwe klanten.'},{id:'overons',waarom:'Passie voor groen met een gezicht erachter.'},{id:'contact',waarom:'Makkelijk een ontwerp of onderhoudsafspraak aanvragen.'}] },
    { naam: 'Schoonmaakbedrijf', cat: 'Dienstverlening', keywords: ['schoonmaakbedrijf','schoonmaak','reiniging','glazenwasser','poetsbedrijf'], paginas: [{id:'home',waarom:'Betrouwbaarheid en netheid stralen meteen af.'},{id:'diensten',waarom:'Kantoor, particulier, glas: laat zien wat je schoonmaakt.'},{id:'prijzen',waarom:'Transparante tarieven of pakketten wekken vertrouwen.'},{id:'reviews',waarom:'Ervaringen bevestigen dat je betrouwbaar en grondig bent.'},{id:'overons',waarom:'Een betrouwbaar team achter de dienst.'},{id:'contact',waarom:'Snel een offerte of proefschoonmaak aanvragen.'}] },
    { naam: 'Beveiligingsbedrijf', cat: 'Dienstverlening', keywords: ['beveiliging','beveiligingsbedrijf','security','alarm','camera','bewaking'], paginas: [{id:'home',waarom:'Zekerheid en professionaliteit uitstralen.'},{id:'diensten',waarom:'Van camerabeveiliging tot surveillance: toon je aanbod.'},{id:'portfolio',waarom:'Referenties en projecten geven vertrouwen.'},{id:'faq',waarom:'Vragen over aanpak, certificering en kosten beantwoorden.'},{id:'overons',waarom:'Betrouwbaarheid staat centraal in dit vak.'},{id:'contact',waarom:'Een directe route naar een adviesgesprek.'}] },
    { naam: 'Restaurant / eetcafe', cat: 'Horeca', keywords: ['restaurant','eetcafe','eten','dineren','bistro','brasserie','horeca','cafe'], paginas: [{id:'home',waarom:'Sfeer proef je met je ogen: mooie beelden en meteen kunnen reserveren.'},{id:'behandelingen',waarom:'Je menukaart overzichtelijk gepresenteerd is het hart van de site.'},{id:'reviews',waarom:'Ervaringen van gasten trekken nieuwe bezoekers.'},{id:'overons',waarom:'Het verhaal achter je zaak en keuken maakt het persoonlijk.'},{id:'contact',waarom:'Openingstijden, reserveren en je locatie op de kaart.'}] },
    { naam: 'Bakkerij', cat: 'Horeca en food', keywords: ['bakkerij','bakker','brood','banket','gebak','patisserie'], paginas: [{id:'home',waarom:'Verse producten in beeld maken meteen trek.'},{id:'behandelingen',waarom:'Je assortiment overzichtelijk tonen, van brood tot taarten.'},{id:'portfolio',waarom:'Foto\'s van je mooiste creaties, bijvoorbeeld bruidstaarten.'},{id:'overons',waarom:'Het ambacht en verhaal achter de bakkerij zijn goud waard.'},{id:'contact',waarom:'Openingstijden, bestellen en je winkel vinden.'}] },
    { naam: 'Catering', cat: 'Horeca en food', keywords: ['catering','cateraar','bedrijfscatering','partycatering','buffet','hapjes'], paginas: [{id:'home',waarom:'Smaakvolle presentatie die zin geeft in meer.'},{id:'diensten',waarom:'Welke arrangementen en gelegenheden je verzorgt.'},{id:'portfolio',waarom:'Foto\'s van eerdere events en buffetten overtuigen.'},{id:'prijzen',waarom:'Pakketten en arrangementen helder in beeld.'},{id:'reviews',waarom:'Ervaringen van opdrachtgevers geven vertrouwen om te boeken.'},{id:'contact',waarom:'Makkelijk een offerte op maat aanvragen.'}] },
    { naam: 'Advocaat / advocatenkantoor', cat: 'Juridisch en financieel', keywords: ['advocaat','advocatenkantoor','juridisch','recht','jurist','rechtsbijstand'], paginas: [{id:'home',waarom:'Betrouwbaarheid en deskundigheid vanaf de eerste indruk.'},{id:'diensten',waarom:'Je rechtsgebieden helder benoemd, zodat mensen de juiste hulp vinden.'},{id:'overons',waarom:'Persoonlijke profielen scheppen vertrouwen in een gevoelig vak.'},{id:'blog',waarom:'Kennisartikelen tonen expertise en trekken bezoekers via Google.'},{id:'faq',waarom:'Vragen over kosten, procedures en aanpak beantwoorden verlaagt de drempel.'},{id:'contact',waarom:'Een discrete, laagdrempelige manier om contact op te nemen.'}] },
    { naam: 'Accountant / boekhouder', cat: 'Juridisch en financieel', keywords: ['accountant','boekhouder','administratie','belasting','boekhouding','fiscaal'], paginas: [{id:'home',waarom:'Betrouwbaarheid en overzicht: precies wat ondernemers zoeken.'},{id:'diensten',waarom:'Van aangifte tot advies: toon je volledige dienstenpakket.'},{id:'overons',waarom:'Een persoonlijke klik is belangrijk. Laat het team zien.'},{id:'blog',waarom:'Fiscale tips en updates positioneren je als expert.'},{id:'faq',waarom:'Veelgestelde vragen over tarieven en werkwijze nemen drempels weg.'},{id:'contact',waarom:'Makkelijk een kennismaking inplannen.'}] },
    { naam: 'Verzekeringsadviseur / financieel adviseur', cat: 'Juridisch en financieel', keywords: ['verzekering','verzekeringsadviseur','financieel adviseur','hypotheek','assurantie','pensioen'], paginas: [{id:'home',waarom:'Vertrouwen en duidelijkheid staan centraal.'},{id:'diensten',waarom:'Welke verzekeringen en adviezen je biedt, helder uitgelegd.'},{id:'faq',waarom:'Vragen over aanpak en onafhankelijkheid beantwoorden schept vertrouwen.'},{id:'reviews',waarom:'Ervaringen van klanten bevestigen je betrouwbaarheid.'},{id:'overons',waarom:'Een persoonlijk gezicht in een vak dat om vertrouwen draait.'},{id:'contact',waarom:'Een laagdrempelig adviesgesprek als eerste stap.'}] },
    { naam: 'Makelaar', cat: 'Vastgoed', keywords: ['makelaar','makelaardij','vastgoed','woning','huizen','verkoop','taxatie'], paginas: [{id:'home',waarom:'Een sterke eerste indruk met uitgelicht aanbod.'},{id:'portfolio',waarom:'Je woningaanbod is letterlijk je etalage.'},{id:'diensten',waarom:'Verkoop, aankoop, taxatie: toon je volledige dienstverlening.'},{id:'blog',waarom:'Marktinzichten en tips positioneren je als lokale expert.'},{id:'reviews',waarom:'Ervaringen van kopers en verkopers geven vertrouwen.'},{id:'overons',waarom:'Persoonlijkheid en lokale kennis maken het verschil.'},{id:'contact',waarom:'Makkelijk een waardebepaling of kennismaking aanvragen.'}] },
    { naam: 'Architect / architectenbureau', cat: 'Ontwerp en creatief', keywords: ['architect','architectenbureau','architectuur','ontwerp','bouwkundig'], paginas: [{id:'home',waarom:'Beeld vertelt alles: laat je visie en stijl direct zien.'},{id:'portfolio',waarom:'Je projecten zijn je belangrijkste verkoopargument.'},{id:'diensten',waarom:'Van schetsontwerp tot begeleiding: toon je werkwijze.'},{id:'overons',waarom:'Jouw visie en filosofie onderscheiden je.'},{id:'blog',waarom:'Inzichten in ontwerp en duurzaamheid tonen expertise.'},{id:'contact',waarom:'Een uitnodigende manier om een project te bespreken.'}] },
    { naam: 'Grafisch ontwerper / vormgever', cat: 'Ontwerp en creatief', keywords: ['grafisch ontwerper','vormgever','graphic designer','huisstijl','logo','branding','dtp'], paginas: [{id:'home',waarom:'Je site is meteen een showcase van je eigen stijl.'},{id:'portfolio',waarom:'Je portfolio is je cv: laat je beste werk zien.'},{id:'diensten',waarom:'Van logo tot complete huisstijl: toon je aanbod.'},{id:'prijzen',waarom:'Transparante tarieven of pakketten maken de keuze makkelijk.'},{id:'overons',waarom:'Jouw stijl en aanpak maken je herkenbaar.'},{id:'contact',waarom:'Een makkelijke route naar een projectaanvraag.'}] },
    { naam: 'Fotograaf', cat: 'Ontwerp en creatief', keywords: ['fotograaf','fotografie','fotostudio','shoot','portret','bruiloft','photographer'], paginas: [{id:'home',waarom:'Beeld overtuigt: je sterkste foto\'s meteen in beeld.'},{id:'portfolio',waarom:'Een portfolio per specialisatie laat je bereik zien.'},{id:'behandelingen',waarom:'Je pakketten of shoots helder omschreven.'},{id:'prijzen',waarom:'Duidelijke tarieven trekken de juiste klanten.'},{id:'reviews',waarom:'Ervaringen van klanten bevestigen je kwaliteit.'},{id:'contact',waarom:'Makkelijk een shoot aanvragen of datum checken.'}] },
    { naam: 'Videograaf / videoproductie', cat: 'Ontwerp en creatief', keywords: ['videograaf','video','videoproductie','film','montage','reclamefilm','content'], paginas: [{id:'home',waarom:'Bewegend beeld trekt meteen de aandacht.'},{id:'portfolio',waarom:'Je showreel en projecten spreken voor zich.'},{id:'diensten',waarom:'Van bedrijfsfilm tot social content: toon je aanbod.'},{id:'prijzen',waarom:'Pakketten geven potenti\u00eble klanten houvast.'},{id:'overons',waarom:'Jouw stijl en visie maken je uniek.'},{id:'contact',waarom:'Een directe route naar een projectaanvraag.'}] },
    { naam: 'Webdesigner / webdeveloper', cat: 'IT en technologie', keywords: ['webdesigner','webdeveloper','website','webdesign','developer','programmeur','webbureau'], paginas: [{id:'home',waarom:'Je eigen site is het levende bewijs van wat je kunt.'},{id:'portfolio',waarom:'Gerealiseerde websites laten je stijl en kwaliteit zien.'},{id:'diensten',waarom:'Van webdesign tot onderhoud: toon je volledige aanbod.'},{id:'prijzen',waarom:'Transparante pakketten maken de keuze makkelijk.'},{id:'blog',waarom:'Artikelen over web en techniek trekken organisch bezoekers.'},{id:'contact',waarom:'Een makkelijke route naar een projectaanvraag.'}] },
    { naam: 'IT-bedrijf / systeembeheer', cat: 'IT en technologie', keywords: ['it bedrijf','systeembeheer','ict','support','netwerk','cloud','automatisering'], paginas: [{id:'home',waarom:'Betrouwbaarheid en deskundigheid vanaf de eerste indruk.'},{id:'diensten',waarom:'Van beheer tot cloud: toon je volledige dienstverlening.'},{id:'portfolio',waarom:'Referenties en cases bewijzen je expertise.'},{id:'blog',waarom:'Techniek begrijpelijk uitleggen positioneert je als expert.'},{id:'faq',waarom:'Vragen over support en aanpak beantwoorden schept vertrouwen.'},{id:'contact',waarom:'Een directe route naar een adviesgesprek.'}] },
    { naam: 'Sportschool / fitness', cat: 'Sport en gezondheid', keywords: ['sportschool','fitness','gym','sportcentrum','crossfit','training'], paginas: [{id:'home',waarom:'Energie en sfeer stralen meteen af.'},{id:'behandelingen',waarom:'Je lessen en faciliteiten overzichtelijk in beeld.'},{id:'prijzen',waarom:'Lidmaatschappen en abonnementen helder gepresenteerd.'},{id:'reviews',waarom:'Ervaringen van leden werken motiverend.'},{id:'vacatures',waarom:'Groeiende clubs zoeken trainers. Toon je vacatures.'},{id:'contact',waarom:'Openingstijden, proefles aanvragen en je locatie vinden.'}] },
    { naam: 'Personal trainer', cat: 'Sport en gezondheid', keywords: ['personal trainer','pt','fitnesscoach','krachttraining','afvallen','personal training'], paginas: [{id:'home',waarom:'Jouw energie en aanpak spreken meteen aan.'},{id:'overons',waarom:'Als PT ben jij het product: jouw verhaal overtuigt.'},{id:'diensten',waarom:'Je trainingsvormen en trajecten helder omschreven.'},{id:'prijzen',waarom:'Pakketten maken de investering duidelijk.'},{id:'reviews',waarom:'Transformaties en ervaringen van klanten zijn je sterkste bewijs.'},{id:'contact',waarom:'Een laagdrempelig kennismakingsgesprek.'}] },
    { naam: 'Yoga / pilatesstudio', cat: 'Sport en gezondheid', keywords: ['yoga','pilates','yogastudio','meditatie','mindfulness','yogadocent'], paginas: [{id:'home',waarom:'Rust en balans stralen af, precies zoals je lessen.'},{id:'behandelingen',waarom:'Je lesrooster en soorten lessen overzichtelijk.'},{id:'prijzen',waarom:'Losse lessen of abonnementen helder in beeld.'},{id:'reviews',waarom:'Ervaringen van deelnemers trekken nieuwe leden.'},{id:'overons',waarom:'Jouw achtergrond en stijl maken de studio persoonlijk.'},{id:'contact',waarom:'Makkelijk een proefles boeken.'}] },
    { naam: 'Kinderopvang / kinderdagverblijf', cat: 'Onderwijs en opvang', keywords: ['kinderopvang','kinderdagverblijf','kdv','bso','peuterspeelzaal','gastouder','opvang'], paginas: [{id:'home',waarom:'Een warme, veilige uitstraling die ouders geruststelt.'},{id:'diensten',waarom:'Welke opvang je biedt en voor welke leeftijden.'},{id:'prijzen',waarom:'Tarieven en uren helder, zodat ouders weten waar ze aan toe zijn.'},{id:'faq',waarom:'Vragen over wennen, voeding en veiligheid beantwoorden neemt zorgen weg.'},{id:'vacatures',waarom:'Opvang zoekt vaak personeel. Toon je vacatures.'},{id:'overons',waarom:'Het team leren kennen is voor ouders essentieel.'},{id:'contact',waarom:'Een rondleiding of plek aanvragen.'}] },
    { naam: 'Rijschool', cat: 'Onderwijs en opvang', keywords: ['rijschool','rijles','autorijles','rijinstructeur','theorie','praktijk'], paginas: [{id:'home',waarom:'Betrouwbaar en benaderbaar: precies wat leerlingen zoeken.'},{id:'diensten',waarom:'Je lespakketten en opleidingen helder in beeld.'},{id:'prijzen',waarom:'Transparante pakketten waarmee leerlingen kunnen vergelijken.'},{id:'reviews',waarom:'Slagingspercentages en ervaringen geven de doorslag.'},{id:'faq',waarom:'Vragen over het traject, examens en kosten beantwoorden.'},{id:'contact',waarom:'Makkelijk een proefles aanvragen.'}] },
    { naam: 'Dierenarts / dierenkliniek', cat: 'Dieren en natuur', keywords: ['dierenarts','dierenkliniek','dierenartspraktijk','huisdier','veterinair'], paginas: [{id:'home',waarom:'Een zorgzame, vertrouwenwekkende uitstraling voor baasjes.'},{id:'diensten',waarom:'Welke zorg je biedt, van vaccinatie tot operatie.'},{id:'faq',waarom:'Vragen over spoed, kosten en afspraken beantwoorden scheelt telefoontjes.'},{id:'vacatures',waarom:'Klinieken zoeken vaak personeel. Toon je vacatures.'},{id:'overons',waarom:'Het team leren kennen stelt baasjes gerust.'},{id:'contact',waarom:'Openingstijden, spoedinfo en afspraak maken.'}] },
    { naam: 'Dierenpension / trimsalon', cat: 'Dieren en natuur', keywords: ['dierenpension','trimsalon','hondenpension','kattenpension','trimmen','hondenkapper','dagopvang'], paginas: [{id:'home',waarom:'Een warme uitstraling die baasjes vertrouwen geeft.'},{id:'diensten',waarom:'Wat je aanbiedt: pension, trimmen, dagopvang.'},{id:'prijzen',waarom:'Tarieven per dienst helder in beeld.'},{id:'reviews',waarom:'Ervaringen van tevreden baasjes geven zekerheid.'},{id:'overons',waarom:'Jouw liefde voor dieren en aanpak stellen gerust.'},{id:'contact',waarom:'Makkelijk een plek of afspraak reserveren.'}] },
    { naam: 'Transportbedrijf / koerier', cat: 'Transport en logistiek', keywords: ['transportbedrijf','transport','koerier','logistiek','vervoer','distributie','expediteur'], paginas: [{id:'home',waarom:'Betrouwbaarheid en capaciteit stralen meteen af.'},{id:'diensten',waarom:'Welk vervoer en welke routes je verzorgt.'},{id:'reviews',waarom:'Ervaringen van opdrachtgevers bevestigen je betrouwbaarheid.'},{id:'vacatures',waarom:'De sector zoekt chauffeurs. Toon je vacatures prominent.'},{id:'overons',waarom:'Het bedrijf achter de wielen.'},{id:'contact',waarom:'Een makkelijke route naar een offerte.'}] },
    { naam: 'Verhuisbedrijf', cat: 'Transport en logistiek', keywords: ['verhuisbedrijf','verhuizen','verhuizing','verhuisservice','meubeltransport'], paginas: [{id:'home',waarom:'Ontzorging uitstralen bij een stressvolle klus.'},{id:'diensten',waarom:'Van inpakken tot opslag: toon je volledige service.'},{id:'prijzen',waarom:'Duidelijke tarieven waarmee mensen kunnen vergelijken.'},{id:'reviews',waarom:'Ervaringen nemen twijfel weg bij het kiezen.'},{id:'overons',waarom:'Een betrouwbaar team achter de verhuizing.'},{id:'contact',waarom:'Snel een offerte op maat aanvragen.'}] },
    { naam: 'Autogarage / autobedrijf', cat: 'Auto en mobiliteit', keywords: ['garage','autogarage','autobedrijf','apk','onderhoud auto','occasion','automonteur'], paginas: [{id:'home',waarom:'Betrouwbaarheid en vakmanschap stralen meteen af.'},{id:'diensten',waarom:'APK, onderhoud, reparatie: toon je volledige aanbod.'},{id:'portfolio',waarom:'Je occasionaanbod als etalage, indien van toepassing.'},{id:'reviews',waarom:'Ervaringen over eerlijkheid en service overtuigen.'},{id:'overons',waarom:'Een betrouwbaar gezicht achter de garage.'},{id:'contact',waarom:'Makkelijk een afspraak of offerte aanvragen.'}] },
    { naam: 'Webshop / winkel', cat: 'Retail en e-commerce', keywords: ['webshop','winkel','retail','online shop','verkoop','e-commerce','boetiek'], paginas: [{id:'home',waarom:'Je producten en aanbiedingen meteen aantrekkelijk in beeld.'},{id:'behandelingen',waarom:'Je productcategorie\u00ebn helder gepresenteerd.'},{id:'reviews',waarom:'Klantbeoordelingen verhogen vertrouwen en verkoop.'},{id:'faq',waarom:'Vragen over levering, retour en betaling beantwoorden verlaagt drempels.'},{id:'overons',waarom:'Het verhaal achter je merk schept een band.'},{id:'contact',waarom:'Een makkelijke route naar klantenservice.'}] },
    { naam: 'Evenementenbureau', cat: 'Evenementen', keywords: ['evenementenbureau','evenementen','events','organisatie','feest','congres','bruiloft'], paginas: [{id:'home',waarom:'Sfeer en creativiteit stralen meteen af.'},{id:'diensten',waarom:'Welke soorten events je organiseert.'},{id:'portfolio',waarom:'Cases van eerdere events zijn je sterkste verkoopargument.'},{id:'prijzen',waarom:'Pakketten of arrangementen geven houvast.'},{id:'reviews',waarom:'Ervaringen van opdrachtgevers geven vertrouwen.'},{id:'contact',waarom:'Een uitnodigende manier om een event te bespreken.'}] },
    { naam: 'Trouwfotograaf / bruiloftfotograaf', cat: 'Fotografie en evenementen', keywords: ['trouwfotograaf','bruiloftfotograaf','bruiloft','trouwen','weddingfotograaf'], paginas: [{id:'home',waarom:'Emotie en stijl meteen voelbaar via je beste beelden.'},{id:'portfolio',waarom:'Koppels kiezen op gevoel: je portfolio is doorslaggevend.'},{id:'behandelingen',waarom:'Je pakketten en wat erbij zit, helder omschreven.'},{id:'prijzen',waarom:'Transparante tarieven trekken de juiste koppels.'},{id:'reviews',waarom:'Ervaringen van bruidsparen zijn onmisbaar.'},{id:'contact',waarom:'Makkelijk je datum checken en aanvragen.'}] },
    { naam: 'Reisorganisatie / reisbureau', cat: 'Reizen en toerisme', keywords: ['reisbureau','reisorganisatie','reizen','vakantie','touroperator','reisadvies'], paginas: [{id:'home',waarom:'Dromen verkopen begint met prikkelende beelden.'},{id:'behandelingen',waarom:'Je reizen en bestemmingen aantrekkelijk gepresenteerd.'},{id:'portfolio',waarom:'Bestemmingen als inspiratiegalerij.'},{id:'reviews',waarom:'Ervaringen van reizigers geven vertrouwen om te boeken.'},{id:'blog',waarom:'Reisverhalen en tips trekken bezoekers via Google.'},{id:'contact',waarom:'Een makkelijke route naar een reisadvies op maat.'}] },
  ];

  /* Vlagcodes per taal (flagcdn) */
  var TAAL_VLAG = {
    'Engels':'gb','Duits':'de','Frans':'fr','Spaans':'es','Italiaans':'it','Portugees':'pt',
    'Pools':'pl','Turks':'tr','Arabisch':'sa','Chinees':'cn','Russisch':'ru','Oekraiens':'ua',
    'Grieks':'gr','Zweeds':'se','Noors':'no','Deens':'dk','Fins':'fi','Japans':'jp','Koreaans':'kr',
    'Hindi':'in','Roemeens':'ro','Hongaars':'hu','Tsjechisch':'cz','Slowaaks':'sk','Bulgaars':'bg',
    'Kroatisch':'hr','Servisch':'rs','Vietnamees':'vn','Thai':'th','Indonesisch':'id','Maleis':'my',
    'Hebreeuws':'il','Swahili':'ke'
  };

  var PAGINA_LABELS = {
    home:'Homepagina', overons:'Over ons', diensten:'Diensten', behandelingen:'Behandelingen/aanbod',
    portfolio:'Portfolio', prijzen:'Prijzen', blog:'Blog', faq:'FAQ', reviews:'Reviews', vacatures:'Vacatures', contact:'Contact'
  };
  var PAGINA_FORM_ID = {
    home:'pi-home', overons:'pi-overons', diensten:'pi-diensten', behandelingen:'pi-behandelingen',
    portfolio:'pi-portfolio', prijzen:'pi-prijzen', blog:'pi-blog', faq:'pi-faq', reviews:'pi-reviews',
    vacatures:'pi-vacatures', contact:'pi-contact'
  };

  /* ── DOM refs ── */
  var steps        = [document.getElementById('step1'), document.getElementById('step2'), document.getElementById('step3')];
  var stepEls      = document.querySelectorAll('.concept-step');
  var current      = 0;
  var gekozenTalen = ['Nederlands'];
  var pakketTeller = 0;

  /* ── Stap navigatie ── */
  function goTo(n) {
    steps[current].style.display = 'none';
    current = n;
    steps[current].style.display = 'block';
    stepEls.forEach(function (el, i) {
      el.classList.toggle('active',    i === current);
      el.classList.toggle('completed', i < current);
    });
    // Verbindingslijnen kleuren op basis van voortgang
    var line1 = document.getElementById('stepLine1');
    var line2 = document.getElementById('stepLine2');
    if (line1) line1.classList.toggle('is-done', current >= 1);
    if (line2) line2.classList.toggle('is-done', current >= 2);
    var wrap = document.querySelector('.concept-wrapper');
    if (wrap) window.scrollTo({ top: wrap.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
  }

  /* ── Validatie ── */
  function validateStep(n) {
    var ok = true;
    steps[n].querySelectorAll('[required]').forEach(function (el) {
      el.classList.remove('input-error');
      if (el.type === 'radio') {
        var checked = Array.from(form.querySelectorAll('[name="' + el.name + '"]')).some(function (r) { return r.checked; });
        if (!checked) {
          ok = false;
          form.querySelectorAll('[name="' + el.name + '"]').forEach(function (r) {
            var b = r.closest('.type-btn'); if (b) b.classList.add('type-btn--error');
          });
        }
      } else if (el.type === 'checkbox') {
        if (!el.checked) { ok = false; var lbl = el.closest('.checkbox-label'); if (lbl) lbl.classList.add('checkbox-error'); }
      } else if (!el.value.trim()) {
        el.classList.add('input-error'); ok = false;
      }
    });
    if (n === 0) {
      var hid = document.getElementById('hiddenBranche');
      if (!hid || !hid.value.trim()) {
        var zoek = document.getElementById('brancheZoek');
        if (zoek) { zoek.classList.add('input-error'); ok = false; }
      }
    }
    if (!ok) {
      var first = steps[n].querySelector('.input-error,.type-btn--error,.checkbox-error');
      if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return ok;
  }

  document.getElementById('step1Next').addEventListener('click', function () { if (validateStep(0)) goTo(1); });
  document.getElementById('step2Next').addEventListener('click', function () { if (validateStep(1)) goTo(2); });
  document.getElementById('step2Back').addEventListener('click', function () { goTo(0); });
  document.getElementById('step3Back').addEventListener('click', function () { goTo(1); });

  form.querySelectorAll('input, textarea').forEach(function (el) {
    el.addEventListener('input',  function () { el.classList.remove('input-error'); });
    el.addEventListener('change', function () { el.classList.remove('input-error'); });
  });

  /* ─────────────────────────────────────────────
     BRANCHE ZOEKBALK
  ───────────────────────────────────────────── */
  var zoekInput      = document.getElementById('brancheZoek');
  var sugList        = document.getElementById('brancheSuggestions');
  var clearBtn       = document.getElementById('brancheClear');
  var tagWrap        = document.getElementById('brancheTagWrap');
  var hiddenBranche  = document.getElementById('hiddenBranche');
  var focusedIndex   = -1;

  function normaliseer(s) {
    return s.toLowerCase()
      .replace(/[\u00e0-\u00e6]/g,'a').replace(/[\u00e8-\u00eb]/g,'e')
      .replace(/[\u00ec-\u00ef]/g,'i').replace(/[\u00f2-\u00f6]/g,'o')
      .replace(/[\u00f9-\u00fc]/g,'u').replace(/[^a-z0-9 ]/g,'');
  }

  // Standaard paginavoorstel voor onbekende branche (custom invoer)
  var DEFAULT_PAGINAS = [
    { id:'home',     waarom:'De basis van je website: een sterke eerste indruk en een duidelijke volgende stap voor bezoekers.' },
    { id:'overons',  waarom:'Mensen doen zaken met mensen. Jouw verhaal schept vertrouwen.' },
    { id:'diensten', waarom:'Een helder overzicht van wat je aanbiedt, zodat bezoekers snel vinden wat ze zoeken.' },
    { id:'contact',  waarom:'Een makkelijke manier om contact op te nemen of een offerte aan te vragen.' }
  ];

  function matchBranche(nq) {
    // Score elke branche op basis van keyword-match
    var scored = [];
    BRANCHES.forEach(function (b) {
      var score = 0;
      // naam-match telt zwaar
      if (normaliseer(b.naam).indexOf(nq) !== -1) score += 10;
      // keyword-match
      for (var i = 0; i < b.keywords.length; i++) {
        var kw = normaliseer(b.keywords[i]);
        if (kw.indexOf(nq) !== -1 || nq.indexOf(kw) !== -1) { score += 6; break; }
      }
      // categorie-match telt licht mee
      if (normaliseer(b.cat).indexOf(nq) !== -1) score += 2;
      if (score > 0) scored.push({ b: b, score: score });
    });
    scored.sort(function (a, c) { return c.score - a.score; });
    return scored.map(function (s) { return s.b; });
  }

  function showSuggestions(q) {
    sugList.innerHTML = '';
    focusedIndex = -1;
    var trimmed = (q || '').trim();
    if (!trimmed) { sugList.style.display = 'none'; return; }
    var nq = normaliseer(trimmed);
    if (!nq) { sugList.style.display = 'none'; return; }

    var results = matchBranche(nq).slice(0, 8);

    results.forEach(function (b) {
      var li = document.createElement('li');
      li.setAttribute('role', 'option');
      li.innerHTML = '<span>' + b.naam + '</span><span class="sug-cat">' + b.cat + '</span>';
      li.addEventListener('mousedown', function (ev) { ev.preventDefault(); kiesBranche(b); });
      sugList.appendChild(li);
    });

    // Altijd de mogelijkheid om eigen invoer te gebruiken
    var custom = document.createElement('li');
    custom.className = 'sug-custom';
    custom.setAttribute('role', 'option');
    custom.innerHTML = 'Gebruik <strong>&ldquo;' + trimmed + '&rdquo;</strong> als mijn bedrijfstype';
    custom.addEventListener('mousedown', function (ev) {
      ev.preventDefault();
      kiesBranche({ naam: trimmed, cat: null, paginas: DEFAULT_PAGINAS, custom: true });
    });
    sugList.appendChild(custom);

    sugList.style.display = 'block';
  }

  function kiesBranche(b) {
    hiddenBranche.value = b.naam;
    zoekInput.value = '';
    sugList.style.display = 'none';
    sugList.innerHTML = '';
    clearBtn.style.display = 'none';
    zoekInput.classList.remove('input-error');

    tagWrap.innerHTML = '';
    var tag = document.createElement('span');
    tag.className = 'branche-tag';
    var label = b.cat ? (b.naam + ' \u00b7 ' + b.cat) : b.naam;
    tag.innerHTML = '<span>' + label + '</span> <button type="button" aria-label="Wijzig bedrijfstype">\u2715</button>';
    tag.querySelector('button').addEventListener('click', function () {
      hiddenBranche.value = '';
      tagWrap.innerHTML = '';
      resetPaginaVoorstel();
      zoekInput.focus();
    });
    tagWrap.appendChild(tag);

    laadPaginaVoorstel(b);
  }

  zoekInput.addEventListener('input', function () {
    clearBtn.style.display = this.value ? 'block' : 'none';
    showSuggestions(this.value);
  });
  zoekInput.addEventListener('focus', function () {
    if (this.value.trim()) showSuggestions(this.value);
  });
  zoekInput.addEventListener('keydown', function (e) {
    var items = sugList.querySelectorAll('li');
    if (e.key === 'ArrowDown') {
      e.preventDefault(); focusedIndex = Math.min(focusedIndex + 1, items.length - 1);
      items.forEach(function (li, i) { li.classList.toggle('focused', i === focusedIndex); if (i === focusedIndex) li.scrollIntoView({ block: 'nearest' }); });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault(); focusedIndex = Math.max(focusedIndex - 1, 0);
      items.forEach(function (li, i) { li.classList.toggle('focused', i === focusedIndex); });
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (focusedIndex >= 0 && items[focusedIndex]) items[focusedIndex].dispatchEvent(new MouseEvent('mousedown'));
      else if (this.value.trim()) kiesBranche({ naam: this.value.trim(), cat: null, paginas: DEFAULT_PAGINAS, custom: true });
    } else if (e.key === 'Escape') { sugList.style.display = 'none'; }
  });
  clearBtn.addEventListener('click', function () {
    zoekInput.value = ''; clearBtn.style.display = 'none'; sugList.style.display = 'none'; sugList.innerHTML = ''; zoekInput.focus();
  });
  document.addEventListener('click', function (e) {
    if (!zoekInput.contains(e.target) && !sugList.contains(e.target)) sugList.style.display = 'none';
  });

  /* ── Paginavoorstel ── */
  function resetAllePaginas() {
    document.querySelectorAll('.pagina-item').forEach(function (item) {
      if (item.id === 'pi-anders') return;
      var cb    = item.querySelector('.pagina-check');
      var why   = item.querySelector('.pagina-item__why');
      var badge = item.querySelector('.pagina-item__badge');
      if (cb) cb.checked = false;
      item.classList.remove('is-recommended');
      if (why) { why.style.display = 'none'; why.textContent = ''; }
      if (badge) { badge.textContent = 'Optioneel'; badge.className = 'pagina-item__badge'; }
    });
  }

  function laadPaginaVoorstel(b) {
    var banner = document.getElementById('paginaVoorstelBanner');
    var tekst  = document.getElementById('paginaVoorstelTekst');
    var namen  = b.paginas.map(function (p) { return PAGINA_LABELS[p.id] || p.id; });

    if (b.custom) {
      tekst.innerHTML = '<strong>Bedrijfstype: ' + b.naam + '.</strong> ' +
        'We kennen dit type niet exact, maar hebben een sterke standaardset klaargezet: <strong>' + namen.join(', ') +
        '</strong>. Elke pagina hieronder legt uit waarom die zinvol is. Pas het gerust aan naar jouw situatie.';
    } else {
      tekst.innerHTML = '<strong>Ons voorstel voor ' + b.naam + '.</strong> ' +
        'Op basis van jouw type bedrijf hebben we deze pagina\u2019s aanbevolen: <strong>' + namen.join(', ') +
        '</strong>. Bij elke pagina lees je waarom die juist voor jou belangrijk is. Alles is aan te passen.';
    }
    banner.classList.add('visible');

    resetAllePaginas();

    b.paginas.forEach(function (p) {
      var formId = PAGINA_FORM_ID[p.id];
      if (!formId) return;
      var item = document.getElementById(formId);
      if (!item) return;
      var cb    = item.querySelector('.pagina-check');
      var why   = item.querySelector('.pagina-item__why');
      var badge = item.querySelector('.pagina-item__badge');
      if (cb) cb.checked = true;
      item.classList.add('is-recommended');
      if (why) { why.textContent = p.waarom || ''; why.style.display = 'block'; }
      if (badge) { badge.textContent = 'Aanbevolen'; badge.className = 'pagina-item__badge badge-aanbevolen'; }
    });

    calcPrijs();
    updateHiddenPages();
  }

  function resetPaginaVoorstel() {
    var banner = document.getElementById('paginaVoorstelBanner');
    banner.classList.remove('visible');
    resetAllePaginas();
    // Home blijft standaard aangevinkt
    var home = document.getElementById('pi-home');
    if (home) {
      var cb = home.querySelector('.pagina-check');
      var why = home.querySelector('.pagina-item__why');
      var badge = home.querySelector('.pagina-item__badge');
      if (cb) cb.checked = true;
      home.classList.add('is-recommended');
      if (why) { why.textContent = 'De basis van je website: een sterke eerste indruk en een duidelijke volgende stap voor bezoekers.'; why.style.display = 'block'; }
      if (badge) { badge.textContent = 'Aanbevolen'; badge.className = 'pagina-item__badge badge-aanbevolen'; }
    }
    calcPrijs();
    updateHiddenPages();
  }

  /* ── Pagina accordeon ── */
  document.querySelectorAll('.pagina-item__toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var item   = btn.closest('.pagina-item');
      var detail = item.querySelector('.pagina-item__detail');
      var open   = detail.style.display !== 'none';
      detail.style.display = open ? 'none' : 'block';
      btn.innerHTML = open ? '\u25be' : '\u25b4';
      btn.setAttribute('aria-expanded', String(!open));
    });
  });

  document.querySelectorAll('.pagina-check').forEach(function (cb) {
    cb.addEventListener('change', function () {
      var item   = cb.closest('.pagina-item');
      var detail = item.querySelector('.pagina-item__detail');
      var btn    = item.querySelector('.pagina-item__toggle');
      if (cb.checked) {
        detail.style.display = 'block';
        if (btn) { btn.innerHTML = '\u25b4'; btn.setAttribute('aria-expanded', 'true'); }
      }
      calcPrijs();
      updateHiddenPages();
    });
  });

  /* ── Project type toggle ── */
  var urlWrap       = document.getElementById('huidigeUrlWrap');
  var logoOptieWrap = document.getElementById('logo-optie-wrap');
  var logoNaam      = document.getElementById('logoNaamPreview');
  var bedrijfInput  = document.getElementById('c-bedrijf');

  form.querySelectorAll('[name="Type project"]').forEach(function (r) {
    r.addEventListener('change', function () {
      if (urlWrap)       urlWrap.style.display       = (r.value === 'Redesign') ? 'block' : 'none';
      if (logoOptieWrap) logoOptieWrap.style.display = (r.value === 'Nieuwe website') ? 'block' : 'none';
      if (logoNaam && bedrijfInput) logoNaam.textContent = bedrijfInput.value.trim() || '\u2014';
      form.querySelectorAll('.type-btn').forEach(function (b) { b.classList.remove('type-btn--error'); });
    });
  });
  if (bedrijfInput && logoNaam) bedrijfInput.addEventListener('input', function () {
    logoNaam.textContent = bedrijfInput.value.trim() || '\u2014';
  });

  /* ── Logo optie ── */
  var logoOptieCheck = document.getElementById('logoOptie');
  var logoStijlWrap  = document.getElementById('logoStijlWrap');
  if (logoOptieCheck && logoStijlWrap) {
    logoOptieCheck.addEventListener('change', function () {
      logoStijlWrap.style.display = logoOptieCheck.checked ? 'block' : 'none';
      calcPrijs();
    });
  }

  /* ── Logo chips ── */
  function initChips(containerId, hiddenId) {
    var container = document.getElementById(containerId);
    var hidden    = document.getElementById(hiddenId);
    if (!container || !hidden) return;
    var selected = [];
    container.querySelectorAll('.logo-chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var val = btn.dataset.waarde;
        var idx = selected.indexOf(val);
        if (idx === -1) { selected.push(val); btn.classList.add('logo-chip--active'); }
        else            { selected.splice(idx, 1); btn.classList.remove('logo-chip--active'); }
        hidden.value = selected.join(', ');
      });
    });
  }
  initChips('logoStijlChips', 'logoStijlChipsHidden');
  initChips('logoKleurChips', 'logoKleurChipsHidden');

  /* ── Social media toggle ── */
  var socialCheck     = document.getElementById('socialCheck');
  var socialLinksWrap = document.getElementById('socialLinksWrap');
  if (socialCheck && socialLinksWrap) {
    socialCheck.addEventListener('change', function () {
      socialLinksWrap.style.display = socialCheck.checked ? 'block' : 'none';
    });
  }

  /* ── Privacy checkbox ── */
  var privacyCheck = document.getElementById('privacyCheck');
  if (privacyCheck) privacyCheck.addEventListener('change', function () {
    var lbl = this.closest('.checkbox-label'); if (lbl) lbl.classList.remove('checkbox-error');
  });

  /* ── Zelf aanpassen -> portaal advies ── */
  var portaalAdvies = document.getElementById('portaalAdvies');
  var portaalUitleg = document.getElementById('portaalUitleg');
  form.querySelectorAll('[name="Zelf aanpassen"]').forEach(function (r) {
    r.addEventListener('change', function () {
      var portaalCb = document.getElementById('portaalOptie');
      if (r.value === 'Ja, zelf aanpassen') {
        if (portaalAdvies) portaalAdvies.style.display = 'flex';
        if (portaalUitleg) portaalUitleg.style.display = 'none';
        // Portaal automatisch aanvinken + in prijs verwerken
        if (portaalCb && !portaalCb.checked) { portaalCb.checked = true; }
      } else if (r.value === 'Weet ik nog niet') {
        if (portaalAdvies) portaalAdvies.style.display = 'none';
        if (portaalUitleg) portaalUitleg.style.display = 'flex';
      } else { // Nee, niet nodig
        if (portaalAdvies) portaalAdvies.style.display = 'none';
        if (portaalUitleg) portaalUitleg.style.display = 'none';
      }
      form.querySelectorAll('.type-btn').forEach(function (b) { b.classList.remove('type-btn--error'); });
      calcPrijs();
    });
  });

  /* ─────────────────────────────────────────────
     TALEN
  ───────────────────────────────────────────── */
  var taalTags     = document.getElementById('taalTags');
  var taalDropdown = document.getElementById('taalDropdown');
  var taalEigen    = document.getElementById('taalEigen');
  var taalEigenAdd = document.getElementById('taalEigenAdd');
  var hiddenTalen  = document.getElementById('hiddenTalen');

  function vlagHTML(taal) {
    var code = TAAL_VLAG[taal];
    if (code) return '<img class="taal-tag__vlag" src="https://flagcdn.com/' + code + '.svg" alt="" width="20" height="14" loading="lazy">';
    return '<span style="font-size:.9em;">\ud83c\udf10</span>';
  }
  function renderTaalTags() {
    Array.from(taalTags.querySelectorAll('.taal-tag:not(.taal-tag--fixed)')).forEach(function (t) { t.remove(); });
    gekozenTalen.forEach(function (taal) {
      if (taal === 'Nederlands') return;
      var tag = document.createElement('span');
      tag.className = 'taal-tag';
      tag.innerHTML = vlagHTML(taal) + ' ' + taal + ' <button type="button" class="taal-tag__remove" aria-label="Verwijder ' + taal + '">\u2715</button>';
      tag.querySelector('.taal-tag__remove').addEventListener('click', function () {
        gekozenTalen = gekozenTalen.filter(function (t) { return t !== taal; });
        renderTaalTags(); updateHiddenTalen(); calcPrijs();
      });
      taalTags.appendChild(tag);
    });
  }
  function updateHiddenTalen() { if (hiddenTalen) hiddenTalen.value = gekozenTalen.join(', '); }
  function voegTaalToe(taal) {
    taal = (taal || '').trim();
    if (!taal) return;
    // Normaliseer eerste letter hoofdletter
    taal = taal.charAt(0).toUpperCase() + taal.slice(1);
    if (gekozenTalen.indexOf(taal) !== -1) return;
    gekozenTalen.push(taal);
    renderTaalTags(); updateHiddenTalen(); calcPrijs();
  }
  if (taalDropdown) taalDropdown.addEventListener('change', function () { if (this.value) { voegTaalToe(this.value); this.value = ''; } });
  if (taalEigenAdd) taalEigenAdd.addEventListener('click', function () { if (taalEigen) { voegTaalToe(taalEigen.value); taalEigen.value = ''; } });
  if (taalEigen) taalEigen.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); voegTaalToe(taalEigen.value); taalEigen.value = ''; } });

  /* ─────────────────────────────────────────────
     KLEUREN + EYEDROPPER
  ───────────────────────────────────────────── */
  var eyedropperSupported = (typeof window.EyeDropper !== 'undefined');

  ['1','2','3'].forEach(function (n) {
    var colorInput = document.getElementById('kleur' + n);
    var hexInput   = document.getElementById('hex' + n);
    var swatch     = document.getElementById('swatch' + n);
    var eyeBtn     = document.getElementById('eye' + n);
    if (!colorInput || !hexInput || !swatch) return;

    if (!eyedropperSupported && eyeBtn) eyeBtn.classList.add('hidden');

    function paint(val) {
      hexInput.value = val.toUpperCase();
      swatch.style.background = val;
    }
    colorInput.addEventListener('input', function () { paint(this.value); });
    hexInput.addEventListener('input', function () {
      var v = this.value.trim();
      if (v && v.charAt(0) !== '#') v = '#' + v;
      if (/^#[0-9A-Fa-f]{6}$/.test(v)) { colorInput.value = v; swatch.style.background = v; }
    });
    hexInput.addEventListener('blur', function () {
      var v = this.value.trim();
      if (v && v.charAt(0) !== '#') v = '#' + v;
      if (/^#[0-9A-Fa-f]{6}$/.test(v)) this.value = v.toUpperCase();
      else this.value = colorInput.value.toUpperCase();
    });
    if (eyeBtn && eyedropperSupported) {
      eyeBtn.addEventListener('click', function () {
        try {
          var ed = new window.EyeDropper();
          ed.open().then(function (res) { colorInput.value = res.sRGBHex; paint(res.sRGBHex); }).catch(function () {});
        } catch (err) {}
      });
    }
    paint(colorInput.value);
  });

  /* ─────────────────────────────────────────────
     PAKKETTEN
  ───────────────────────────────────────────── */
  var pakketWrap = document.getElementById('pakketten-wrap');
  var pakketAdd  = document.getElementById('pakketAddBtn');
  var hiddenPak  = document.getElementById('hiddenPakketten');

  function updateHiddenPakketten() {
    if (!pakketWrap || !hiddenPak) return;
    var lines = [];
    pakketWrap.querySelectorAll('.pakket-item').forEach(function (item, i) {
      var titel   = item.querySelector('.pakket-title-input');
      var omschr  = item.querySelector('.pakket-omschr');
      var prijsCb = item.querySelector('.pakket-prijs-cb');
      var prijsIn = item.querySelector('.pakket-prijs-val');
      var t = titel ? titel.value.trim() : '';
      var o = omschr ? omschr.value.trim() : '';
      var p = '';
      if (prijsCb && prijsCb.checked && prijsIn && prijsIn.value.trim()) p = prijsIn.value.trim();
      else if (prijsCb && !prijsCb.checked) p = 'Prijs op aanvraag';
      if (!t && !o && !p) return;
      lines.push('Pakket ' + (i + 1) + ': ' + (t || 'zonder titel') + (p ? ' [' + p + ']' : '') + (o ? ' \u2014 ' + o : ''));
    });
    hiddenPak.value = lines.join('  ||  ');
  }

  function maakPakket() {
    pakketTeller++;
    var item = document.createElement('div');
    item.className = 'pakket-item';
    item.innerHTML =
      '<button type="button" class="pakket-remove" title="Verwijder dit pakket">Verwijder</button>' +
      '<div class="pakket-header">' +
        '<span class="pakket-nummer">' + pakketTeller + '</span>' +
        '<div class="pakket-title-wrap">' +
          '<input type="text" class="pakket-title-input" placeholder="Titel, bijv. Basispakket of Vanaf \u20ac750" maxlength="80">' +
        '</div>' +
      '</div>' +
      '<div class="pakket-body">' +
        '<textarea class="pakket-omschr" rows="3" placeholder="Wat zit er in dit pakket? Bijv. inclusief 4 behandelingen, kleuradvies en nabespreking."></textarea>' +
        '<div class="pakket-prijs-rij">' +
          '<label><input type="checkbox" class="pakket-prijs-cb"> Prijs vermelden</label>' +
          '<input type="text" class="pakket-prijs-val" placeholder="Bijv. \u20ac750 of Vanaf \u20ac500" style="display:none;">' +
        '</div>' +
      '</div>';

    var cb  = item.querySelector('.pakket-prijs-cb');
    var val = item.querySelector('.pakket-prijs-val');
    cb.addEventListener('change', function () { val.style.display = cb.checked ? 'block' : 'none'; updateHiddenPakketten(); });
    item.querySelector('.pakket-remove').addEventListener('click', function () { item.remove(); hernummer(); updateHiddenPakketten(); });
    item.querySelectorAll('input, textarea').forEach(function (el) { el.addEventListener('input', updateHiddenPakketten); });

    pakketWrap.appendChild(item);
    updateHiddenPakketten();
  }

  function hernummer() {
    pakketTeller = 0;
    pakketWrap.querySelectorAll('.pakket-item .pakket-nummer').forEach(function (span) { span.textContent = (++pakketTeller); });
  }

  if (pakketAdd) pakketAdd.addEventListener('click', maakPakket);

  var prijzenCheck = document.querySelector('#pi-prijzen .pagina-check');
  if (prijzenCheck) {
    prijzenCheck.addEventListener('change', function () {
      if (this.checked && pakketWrap && pakketWrap.children.length === 0) maakPakket();
    });
  }

  /* ─────────────────────────────────────────────
     PRIJSCALCULATOR
  ───────────────────────────────────────────── */
  var BASE            = 750;   // tot 5 pagina's, 1 taal, contactformulier
  var INBEGREPEN_PAGINAS = 5;
  var PER_EXTRA_PAGE  = 75;
  var PER_EXTRA_TAAL  = 200;
  var PORTAAL_PRIJS   = 350;
  var ONDERHOUD       = 29.95; // per maand
  function fmt(n) { var s = n.toFixed(2).replace('.', ','); s = s.replace(/\B(?=(\d{3})+(?!\d),)/g, '.'); return '\u20ac' + s; }
  function calcPrijs() {
    var pages = document.querySelectorAll('.pagina-check:checked').length || 1;
    var talen = gekozenTalen.length || 1;

    var once = BASE;
    once += Math.max(0, pages - INBEGREPEN_PAGINAS) * PER_EXTRA_PAGE;
    once += Math.max(0, talen - 1) * PER_EXTRA_TAAL;

    var portaalCb = document.getElementById('portaalOptie');
    if (portaalCb && portaalCb.checked) once += PORTAAL_PRIJS;

    // Overige losse prijsopties (bijv. logo) tellen mee indien aanwezig
    form.querySelectorAll('.price-option:checked').forEach(function (opt) { once += parseFloat(opt.dataset.price) || 0; });

    var el = document.getElementById('priceDisplay'); if (el) el.textContent = fmt(once);
    var hid = document.getElementById('hiddenPriceOnce'); if (hid) hid.value = fmt(once);

    // Onderhoud apart tonen als maandbedrag
    var onderhoudCb = document.getElementById('onderhoudOptie');
    var maandEl = document.getElementById('priceMaandDisplay');
    var maandHid = document.getElementById('hiddenPriceMaand');
    var maand = (onderhoudCb && onderhoudCb.checked) ? ONDERHOUD : 0;
    if (maandEl) maandEl.textContent = maand ? (fmt(maand) + ' /maand') : '\u2014';
    if (maandHid) maandHid.value = maand ? fmt(maand) : '';

    // Opbouw voor in de mail
    var opbouw = [];
    opbouw.push('Basis (tot 5 pagina\'s, 1 taal, contactformulier): ' + fmt(BASE));
    var extraP = Math.max(0, pages - INBEGREPEN_PAGINAS);
    if (extraP > 0) opbouw.push(extraP + ' extra pagina\'s x ' + fmt(PER_EXTRA_PAGE) + ': ' + fmt(extraP * PER_EXTRA_PAGE));
    var extraT = Math.max(0, talen - 1);
    if (extraT > 0) opbouw.push(extraT + ' extra taal/talen x ' + fmt(PER_EXTRA_TAAL) + ': ' + fmt(extraT * PER_EXTRA_TAAL));
    if (portaalCb && portaalCb.checked) opbouw.push('Klantportaal: ' + fmt(PORTAAL_PRIJS));
    form.querySelectorAll('.price-option:checked').forEach(function (opt) {
      var lbl = opt.value || 'Extra';
      opbouw.push(lbl + ': ' + fmt(parseFloat(opt.dataset.price) || 0));
    });
    if (maand) opbouw.push('Maandelijks onderhoud: ' + fmt(ONDERHOUD) + ' /maand');
    var hidOpbouw = document.getElementById('hiddenPriceOpbouw');
    if (hidOpbouw) hidOpbouw.value = opbouw.join('  ||  ');
  }
  function updateHiddenPages() {
    var sel = Array.from(document.querySelectorAll('.pagina-check:checked')).map(function (c) { return c.value; });
    var hp = document.getElementById('hiddenPages'); if (hp) hp.value = sel.join(', ');
  }

  /* ─────────────────────────────────────────────
     MAIL-OPMAAK: bundel losse checkboxes tot nette regels
     zodat je aanvraag overzichtelijk in je inbox landt
  ───────────────────────────────────────────── */
  function verwijderVeld(naam) {
    form.querySelectorAll('input[type="hidden"][data-bundle="' + naam + '"]').forEach(function (el) { el.remove(); });
  }
  function zetVeld(naam, waarde) {
    verwijderVeld(naam);
    if (!waarde) return;
    var inp = document.createElement('input');
    inp.type = 'hidden';
    inp.name = naam;
    inp.value = waarde;
    inp.setAttribute('data-bundle', naam);
    form.appendChild(inp);
  }
  function verzamelChecked(elementNaam) {
    return Array.from(form.querySelectorAll('[name="' + elementNaam + '"]:checked'))
      .map(function (c) { return c.value; }).join(', ');
  }
  function bundelVoorMail() {
    // Per pagina: bundel gekozen elementen tot een leesbare regel
    var paginaBundels = [
      { pagina: 'Homepagina',   elementNaam: 'Homepagina elementen' },
      { pagina: 'Over ons',     elementNaam: 'Over Ons elementen' },
      { pagina: 'Diensten',     elementNaam: 'Diensten elementen' },
      { pagina: 'Behandelingen',elementNaam: 'Behandelingen elementen' },
      { pagina: 'Portfolio',    elementNaam: 'Portfolio elementen' },
      { pagina: 'Prijzen',      elementNaam: 'Prijzen elementen' },
      { pagina: 'Blog',         elementNaam: 'Blog elementen' },
      { pagina: 'FAQ',          elementNaam: 'FAQ elementen' },
      { pagina: 'Reviews',      elementNaam: 'Reviews elementen' },
      { pagina: 'Vacatures',    elementNaam: 'Vacatures elementen' }
    ];
    var samenvatting = [];
    paginaBundels.forEach(function (pb) {
      var gekozen = verzamelChecked(pb.elementNaam);
      // Alleen meenemen als de pagina zelf gekozen is
      var paginaGekozen = Array.from(form.querySelectorAll('.pagina-check:checked')).some(function (c) {
        return c.value.toLowerCase().indexOf(pb.pagina.toLowerCase()) !== -1;
      });
      if (paginaGekozen && gekozen) {
        samenvatting.push(pb.pagina + ': ' + gekozen);
      }
    });
    zetVeld('Gekozen paginaonderdelen', samenvatting.join('  ||  '));

    // Bundel gewenste stijl
    zetVeld('Gewenste uitstraling', verzamelChecked('Gewenste stijl'));

    // Bundel extra opties
    zetVeld('Gekozen extras', verzamelChecked('Extras'));

    // Bundel kleuren in 1 leesbaar veld
    var k1 = form.querySelector('#hex1'), k2 = form.querySelector('#hex2'), k3 = form.querySelector('#hex3');
    var kleuren = [];
    if (k1 && k1.value) kleuren.push('Hoofdkleur ' + k1.value);
    if (k2 && k2.value) kleuren.push('Ondersteunend ' + k2.value);
    if (k3 && k3.value) kleuren.push('Extra ' + k3.value);
    zetVeld('Kleurenpalet', kleuren.join(', '));

    // Bundel social media (alleen ingevulde)
    var socialVelden = ['Instagram URL','Facebook URL','LinkedIn URL','TikTok URL','YouTube URL'];
    var socials = [];
    socialVelden.forEach(function (naam) {
      var inp = form.querySelector('[name="' + naam + '"]');
      if (inp && inp.value.trim()) socials.push(naam.replace(' URL','') + ': ' + inp.value.trim());
    });
    zetVeld('Social media', socials.join('  ||  '));

    // Contact-pagina onderdelen (los opgezet)
    var contactGekozen = Array.from(form.querySelectorAll('.pagina-check:checked')).some(function (c) { return c.value === 'Contact'; });
    var contactEl = verzamelChecked('Contact elementen');
    if (contactGekozen && contactEl) zetVeld('Contact onderdelen', contactEl);

    // Verberg de rauwe losse velden uit de mail (disabled = niet verzonden)
    var rauweNamen = [
      'Homepagina elementen','Over Ons elementen','Diensten elementen','Behandelingen elementen',
      'Portfolio elementen','Prijzen elementen','Blog elementen','FAQ elementen','Reviews elementen',
      'Vacatures elementen','Contact elementen','Gewenste stijl','Extras',
      'Instagram URL','Facebook URL','LinkedIn URL','TikTok URL','YouTube URL',
      'Kleur 1 hoofdkleur','Kleur 2 ondersteunend','Kleur 3 extra','Paginas'
    ];
    rauweNamen.forEach(function (naam) {
      form.querySelectorAll('[name="' + naam + '"]').forEach(function (el) { el.disabled = true; });
    });
    // Contact-elementen wel als leesbare regel toevoegen
    // (contact staat niet in paginaBundels omdat het losse opzet heeft)
  }

  form.querySelectorAll('.price-option').forEach(function (el) { el.addEventListener('change', calcPrijs); });
  var portaalCb = document.getElementById('portaalOptie');
  if (portaalCb) portaalCb.addEventListener('change', calcPrijs);
  var onderhoudCb = document.getElementById('onderhoudOptie');
  if (onderhoudCb) onderhoudCb.addEventListener('change', calcPrijs);
  calcPrijs();
  updateHiddenPages();

  /* ─────────────────────────────────────────────
     SUBMIT
  ───────────────────────────────────────────── */
  var successOverlay = document.getElementById('successOverlay');
  var successClose   = document.getElementById('successClose');

  function launchRockets() {
    var container = document.getElementById('successRockets');
    if (!container) return;
    var emojis = ['\ud83d\ude80','\ud83c\udf89','\u2728','\ud83c\udf1f','\ud83d\udcab','\ud83c\udf8a'];
    for (var i = 0; i < 18; i++) {
      (function (i) {
        setTimeout(function () {
          var el = document.createElement('span');
          el.className = 'rocket-particle';
          el.textContent = emojis[i % emojis.length];
          el.style.left = Math.random() * 100 + '%';
          el.style.animationDuration = (0.8 + Math.random() * 0.8) + 's';
          el.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
          container.appendChild(el);
          setTimeout(function () { el.remove(); }, 1800);
        }, i * 80);
      })(i);
    }
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var honey = form.querySelector('[name="_gotcha"]');
    if (honey && honey.value) return;
    if (!validateStep(2)) return;

    // Zorg dat alle hidden velden up-to-date zijn
    updateHiddenPages();
    updateHiddenTalen();
    updateHiddenPakketten();

    // ── Consolideer alles tot nette, leesbare hidden-velden voor de mail ──
    bundelVoorMail();

    // Onderwerp persoonlijker maken
    var subject = form.querySelector('[name="_subject"]');
    var bn = (bedrijfInput && bedrijfInput.value.trim()) ? bedrijfInput.value.trim() : 'onbekend bedrijf';
    var bt = (hiddenBranche && hiddenBranche.value.trim()) ? hiddenBranche.value.trim() : '';
    if (subject) subject.value = 'Nieuwe conceptaanvraag \u2014 ' + bn + (bt ? ' (' + bt + ')' : '');

    var btn  = document.getElementById('submitBtn');
    var orig = btn.innerHTML;
    btn.textContent = 'Verzenden...';
    btn.disabled = true;

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(function (res) {
      if (res.ok) {
        form.style.display = 'none';
        var stepsBar = document.querySelector('.concept-steps');
        if (stepsBar) stepsBar.style.display = 'none';
        var bedankt = document.getElementById('conceptBedankt');
        if (bedankt) bedankt.style.display = 'block';
        if (successOverlay) {
          successOverlay.classList.add('show');
          document.body.style.overflow = 'hidden';
          setTimeout(function () {
            var ic = document.getElementById('successIcon'); if (ic) ic.classList.add('animate');
            launchRockets();
          }, 100);
        }
        var topEl = document.querySelector('.concept-wrapper');
        if (topEl) window.scrollTo({ top: topEl.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
      } else {
        alert('Er ging iets mis bij het verzenden. Probeer het opnieuw of mail ons op sem@svanwijksolutions.nl');
      }
    }).catch(function () {
      alert('Geen verbinding. Controleer je internet en probeer het opnieuw.');
    }).finally(function () {
      btn.innerHTML = orig;
      btn.disabled = false;
    });
  });

  function closeOverlay() {
    if (!successOverlay) return;
    successOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }
  if (successClose) successClose.addEventListener('click', closeOverlay);
  if (successOverlay) successOverlay.addEventListener('click', function (e) { if (e.target === successOverlay) closeOverlay(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeOverlay(); });

});