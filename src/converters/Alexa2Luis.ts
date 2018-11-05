import { LUMC as Microsoft } from "./../models/Microsoft.LUIS";
import { LUMC as Amazon } from "./../models/Amazon.Alexa";

export module LUMC.Converters {
    export class Alexa2LUISConverter {
        private alexa: Amazon.Alexa.AlexaModel;
        private luis: Microsoft.LUIS.LUISModel;
        private luisVersionId: string;
        private luisCulture: string;
         
        private constructor(alexaModel: Amazon.Alexa.AlexaModel, versionId: string, culture: string) {
            this.alexa = alexaModel;
            this.luisVersionId = versionId;
            this.luisCulture = culture;
        }

        /* Standard Built-in Alexa Intents 
        ** Source: https://developer.amazon.com/docs/custom-skills/standard-built-in-intents.html
        ** Used locale: English
        **
        ** Important: no domain based intents cover yet
        */
        private builtInAlexaIntents: Array<{ intentName: string, samples: string[] }> = [
            { 
                intentName: "AMAZON.CancelIntent",
                samples: ["cancel", "never mind", "forget it"]
            },
            { 
                intentName: "AMAZON.FallbackIntent",
                samples: []
            },
            { 
                intentName: "AMAZON.HelpIntent",
                samples: ["help", "help me", "can you help me"]
            },
            { 
                intentName: "AMAZON.LoopOffIntent",
                samples: ["loop off"]
            },
            { 
                intentName: "AMAZON.LoopOnIntent",
                samples: ["loop", "loop on", "keep playing this"]
            },
            { 
                intentName: "AMAZON.NextIntent",
                samples: ["next", "skip", "skip forward"]
            },
            { 
                intentName: "AMAZON.NoIntent",
                samples: ["no", "no thanks"]
            },
            { 
                intentName: "AMAZON.PauseIntent",
                samples: ["pause", "pause that"]
            },
            { 
                intentName: "AMAZON.PreviousIntent",
                samples: ["repeat", "say that again", "repeat that"]
            },
            { 
                intentName: "AMAZON.RepeatIntent",
                samples: ["help", "help me", "can you help me"]
            },
            { 
                intentName: "AMAZON.ResumeIntent",
                samples: ["resume", "continue", "keep going"]
            },
            { 
                intentName: "AMAZON.SelectIntent",
                samples: ["select that item", "pick this option", "get fourth option", "select third entry", "select fifth item", "get top result", "get last result", "Show the first option", "show that item"]
            },
            { 
                intentName: "AMAZON.ShuffleOffIntent",
                samples: ["stop shuffling", "shuffle off", "turn off shuffle"]
            },
            { 
                intentName: "AMAZON.ShuffleOnIntent",
                samples: ["shuffle", "shuffle on", "shuffle the music", "shuffle mode"]
            },
            { 
                intentName: "AMAZON.StartOverIntent",
                samples: ["start over", "restart", "start again"]
            },
            { 
                intentName: "AMAZON.StopIntent",
                samples: ["stop", "off", "shut up"]
            },
            { 
                intentName: "AMAZON.YesIntent",
                samples: ["yes", "yes please", "sure"]
            }
        ];

        /* Mapping based on these lists: 
        Alexa: https://developer.amazon.com/docs/custom-skills/slot-type-reference.html
        LUIS: https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-reference-prebuilt-domains
        */
        private buildInTypesMap:Array<{ alexa: string, luis: string, luisType: "prebuilt" | "domain" }> = 
        [
            /* Numbers, Dates, and Times */
            { alexa: "AMAZON.DATE", luis: "datetimeV2", luisType: "prebuilt"},
            //{ alexa: "AMAZON.DURATION", luis: ""},
            //{ alexa: "AMAZON.FOUR_DIGIT_NUMBER", luis: ""},
            { alexa: "AMAZON.NUMBER", luis: "number", luisType: "prebuilt"},
            { alexa: "AMAZON.Ordinal", luis: "ordinal", luisType: "prebuilt"},
            { alexa: "AMAZON.PhoneNumber", luis: "phonenumber", luisType: "prebuilt"},
            { alexa: "AMAZON.TIME", luis: "datetimeV2", luisType: "prebuilt"},

            /* Phrases */
            //{ alexa: "AMAZON.SearchQuery", luis: ""},

            /* List */ 
            //{ alexa: "AMAZON.Actor", luis: ""},
            //{ alexa: "AMAZON.AdministrativeArea", luis: ""},
            //{ alexa: "AMAZON.AggregateRating", luis: ""},
            //{ alexa: "AMAZON.Airline", luis: ""},
            //{ alexa: "AMAZON.Airport", luis: ""},
            //{ alexa: "AMAZON.Anaphor", luis: ""},
            //{ alexa: "AMAZON.Animal", luis: ""},
            //{ alexa: "AMAZON.Artist", luis: ""},
            //{ alexa: "AMAZON.Athlete", luis: ""},
            //{ alexa: "AMAZON.Author", luis: ""},
            //{ alexa: "AMAZON.Book", luis: ""},
            //{ alexa: "AMAZON.BookSeries", luis: ""},
            //{ alexa: "AMAZON.BroadcastChannel", luis: ""},
            //{ alexa: "AMAZON.CivicStructure", luis: ""},
            //{ alexa: "AMAZON.Color", luis: ""},
            //{ alexa: "AMAZON.Comic", luis: ""},
            //{ alexa: "AMAZON.Corporation", luis: ""},
            { alexa: "AMAZON.Country", luis: "geographyV2", luisType: "prebuilt"},
            //{ alexa: "AMAZON.CreativeWorkType", luis: ""},
            //{ alexa: "AMAZON.DayOfWeek", luis: ""},
            //{ alexa: "AMAZON.Dessert", luis: ""},
            //{ alexa: "AMAZON.DeviceType", luis: ""},
            //{ alexa: "AMAZON.Director", luis: ""},
            //{ alexa: "AMAZON.Drink", luis: ""},
            //{ alexa: "AMAZON.EducationalOrganization", luis: ""},
            //{ alexa: "AMAZON.EventType", luis: ""},
            //{ alexa: "AMAZON.Festival", luis: ""},
            //{ alexa: "AMAZON.FictionalCharacter", luis: ""},
            //{ alexa: "AMAZON.FinancialService", luis: ""},
            //{ alexa: "AMAZON.Food", luis: ""},
            //{ alexa: "AMAZON.FoodEstablishment", luis: ""},
            //{ alexa: "AMAZON.Game", luis: ""},
            //{ alexa: "AMAZON.Genre", luis: ""},
            //{ alexa: "AMAZON.Landform", luis: ""},
            //{ alexa: "AMAZON.LandmarksOrHistoricalBuildings", luis: ""},
            { alexa: "AMAZON.Language", luis: "Translate.TargetLanguage", luisType: "domain"},
            //{ alexa: "AMAZON.LocalBusiness", luis: ""},
            //{ alexa: "AMAZON.LocalBusinessType", luis: ""},
            //{ alexa: "AMAZON.MedicalOrganization", luis: ""},
            //{ alexa: "AMAZON.Month", luis: ""},
            //{ alexa: "AMAZON.Movie", luis: ""},
            //{ alexa: "AMAZON.MovieSeries", luis: ""},
            //{ alexa: "AMAZON.MovieTheater", luis: ""},
            //{ alexa: "AMAZON.MusicAlbum", luis: ""},
            //{ alexa: "AMAZON.MusicCreativeWorkType", luis: ""},
            //{ alexa: "AMAZON.MusicEvent", luis: ""},
            //{ alexa: "AMAZON.MusicGroup", luis: ""},
            { alexa: "AMAZON.Musician", luis: "Music.ArtistName", luisType: "domain"},
            //{ alexa: "AMAZON.MusicPlaylist", luis: ""},
            //{ alexa: "AMAZON.MusicRecording", luis: ""},
            //{ alexa: "AMAZON.MusicVenue", luis: ""},
            //{ alexa: "AMAZON.MusicVideo", luis: ""},
            //{ alexa: "AMAZON.Organization", luis: ""},
            //{ alexa: "AMAZON.Person", luis: ""},
            //{ alexa: "AMAZON.PostalAddress", luis: ""},
            //{ alexa: "AMAZON.Professional", luis: ""},
            //{ alexa: "AMAZON.ProfessionalType", luis: ""},
            //{ alexa: "AMAZON.RadioChannel", luis: ""},
            //{ alexa: "AMAZON.RelativePosition", luis: ""},
            //{ alexa: "AMAZON.Residence", luis: ""},
            //{ alexa: "AMAZON.Room", luis: ""},
            //{ alexa: "AMAZON.ScreeningEvent", luis: ""},
            //{ alexa: "AMAZON.Service", luis: ""},
            //{ alexa: "AMAZON.SocialMediaPlatform", luis: ""},
            //{ alexa: "AMAZON.SoftwareApplication", luis: ""},
            //{ alexa: "AMAZON.SoftwareGame", luis: ""},
            //{ alexa: "AMAZON.Sport", luis: ""},
            //{ alexa: "AMAZON.SportsEvent", luis: ""},
            //{ alexa: "AMAZON.SportsTeam", luis: ""},
            //{ alexa: "AMAZON.StreetAddress", luis: ""},
            //{ alexa: "AMAZON.StreetName", luis: ""},
            { alexa: "AMAZON.TelevisionChannel", luis: "TV.ChannelName", luisType: "domain"},
            //{ alexa: "AMAZON.TVEpisode", luis: ""},
            //{ alexa: "AMAZON.TVSeason", luis: ""},
            //{ alexa: "AMAZON.TVSeries", luis: ""},
            //{ alexa: "AMAZON.VideoGame", luis: ""},
            //{ alexa: "AMAZON.VisualModeTrigger", luis: ""},
            //{ alexa: "AMAZON.WeatherCondition", luis: ""},
            //{ alexa: "AMAZON.WrittenCreativeWorkType", luis: ""},
            //{ alexa: "AMAZON.Actor", luis: ""},


            /* Europe, UK, Germany & Austria */
            //{ alexa: "AMAZON.AT_CITY", luis: ""},
            //{ alexa: "AMAZON.AT_REGION", luis: ""},
            //{ alexa: "AMAZON.DE_CITY", luis: ""},
            //{ alexa: "AMAZON.DE_FIRST_NAME", luis: ""},
            //{ alexa: "AMAZON.DE_REGION", luis: ""},
            //{ alexa: "AMAZON.EUROPE_CITY", luis: ""},
            //{ alexa: "AMAZON.GB_CITY", luis: ""},
            { alexa: "AMAZON.GB_FIRST_NAME", luis: "personName", luisType: "prebuilt"},
            //{ alexa: "AMAZON.GB_REGION", luis: ""},

            /* US */
            { alexa: "AMAZON.US_CITY", luis: "geographyV2", luisType: "prebuilt"},
            { alexa: "AMAZON.US_FIRST_NAME", luis: "personName", luisType: "prebuilt"},
            { alexa: "AMAZON.US_STATE", luis: "geographyV2", luisType: "prebuilt"},

        ];

        private convert(): void {
            if (this.alexa !== null) {
                let modelName = this.alexa.interactionModel.languageModel.invocationName;
                this.luis = new Microsoft.LUIS.LUISModel(modelName, this.luisVersionId, this.luisCulture, "");

                let languageModel = this.alexa.interactionModel.languageModel;

                languageModel.intents.forEach((intent: Amazon.Alexa.LanguageModelIntent) => {
                    if (intent.slots == null || intent.slots.length == 0) {
                        this.processSimpleIntent(intent);
                    } else {
                        this.processComplexIntent(intent, languageModel.types);
                    }   
                });

                /* Ignore Dialog and Prompts 
                 * ...but, slots samples, used in dialogs, are translated into patterns

                let dialog = this.alexa.interactionModel.dialog;
                let prompts = this.alexa.interactionModel.prompts;
                */
            }            
        }

        // Process intent without slots
        private processSimpleIntent(intent: Amazon.Alexa.LanguageModelIntent) {
            // Use some samples from AMAZON for standard built-in intents to generate utterances
            if (intent.name.startsWith("AMAZON")) {    
                this.processBuiltInAlexaIntent(intent);
            }
            // Use intent samples to generate utterances  
            else {
                this.processCustomSimpleIntent(intent);
            }
        }

        // Process build-in Alexa Intent
        // Open issues:
        // * Coverage on built-in intents
        // * Mapping of Alexa build-in intents to LUIS build-in intents
        private processBuiltInAlexaIntent(intent: Amazon.Alexa.LanguageModelIntent) {            
            let builtInIntent = this.builtInAlexaIntents.find((builtin) => {
                return builtin.intentName == intent.name;
            })
            if (builtInIntent !== undefined) {
                if (builtInIntent.samples !== null && builtInIntent.samples.length > 0) {
                    builtInIntent.samples.forEach((sample: string) => {
                        this.luis.addUtterance(new Microsoft.LUIS.Utterance(sample, intent.name));
                    });
                } else {
                    // not samples provided, ignore
                    console.log(`Warning. No samples provided for the built-in Alexa intent: ${intent.name}.`);
                }

                this.luis.addIntent(new Microsoft.LUIS.Intent(intent.name));
            } else {
                // not found, ignore
                console.log(`Warning. Not found built-in Alexa intent: ${intent.name}.`);
                console.log(`...Processing build-in intent ${intent.name} as custom intent.`);
                this.processCustomSimpleIntent(intent);             
            }
        }

        private processCustomSimpleIntent(intent: Amazon.Alexa.LanguageModelIntent) {  
            if (intent.samples !== null && intent.samples.length > 0) {
                intent.samples.forEach((sample: string) => {
                    this.luis.addUtterance(new Microsoft.LUIS.Utterance(sample, intent.name));
                });
            } else {
                // not samples provided, ignore
                console.log(`Warning. No samples provided for the intent: ${intent.name}.`);
            }
            this.luis.addIntent(new Microsoft.LUIS.Intent(intent.name));
        }

        // Process intent with slots
        private processComplexIntent(intent: Amazon.Alexa.LanguageModelIntent, types: Array<Amazon.Alexa.LanguageModelType>) {
            let slots = intent.slots;

            let samples: string[] = [];
            let slotReplacements: Array<{slot: string, replacement: string}>;

            // Convert slots into entities
            slotReplacements = slots.map((slot: Amazon.Alexa.LanguageModelIntentSlot) => {
                let typeName = slot.type;
                let typeDescriptor: Amazon.Alexa.LanguageModelType;
                let entityName: string;
                // Use mapping for built-in entities
                if (typeName.startsWith("AMAZON")) {
                    entityName = this.processBuiltInAlexaEntity(slot);
                } 
                // Convert types into entities
                else if ((typeDescriptor = types.find(
                    (t) => {
                        return t.name == typeName;
                    })) !== undefined) {
                    entityName = this.processTypedEntity(slot, typeDescriptor);
                } 
                else {
                    entityName = this.processSimpleEntity(slot);
                }

                // process slot samples
                if (slot.samples !== null && slot.samples.length > 0) {
                    samples = samples.concat(slot.samples);
                }

                return {slot: slot.name, replacement: entityName};
            });

            // process samples
            samples = samples.concat(intent.samples);
            samples.forEach((sample) => {
                this.processEntitySample(intent.name, sample, slotReplacements);
            });

            this.luis.addIntent(new Microsoft.LUIS.Intent(intent.name));
        }

        // Process build-in Alexa entity
        // Open issues:
        // * Coverage on built-in entities
        private processBuiltInAlexaEntity(slot: Amazon.Alexa.LanguageModelIntentSlot): string {
            let typeName = slot.type;
            let entityName: string;
            let map = this.buildInTypesMap.find((pair) => {
                return pair.alexa == typeName;
            });
            if (map !== undefined) {
                // Convert domain-based slot into Entity with Inheritance
                if (map.luisType === "domain") {
                    let parts = map.luis.split(".");
                    let entity = new Microsoft.LUIS.Entity(map.luis, [slot.name], undefined, new Microsoft.LUIS.Inherit(parts[0], parts[1]));
                    this.luis.addEntity(entity);
                // Convert prebuild basic slot into PrebuiltEntity
                } else if (map.luisType === "prebuilt") {
                    this.luis.addPrebuiltEntity(new Microsoft.LUIS.PrebuiltEntity(map.luis, [slot.name]));
                } 
                entityName = map.luis + ":" + slot.name;
            } else {
                // not found, ignore
                console.log(`Warning. Not found built-in Alexa entity: ${typeName}.`);
                console.log(`...Processing build-in entity ${typeName} as simple entity.`);
                entityName = this.processSimpleEntity(slot);
            }
            return entityName;
        }

        // Process typed Alexa entity
        // Open issues:
        // * Choose using hierarchical entity OR closed list
        private processTypedEntity(slot: Amazon.Alexa.LanguageModelIntentSlot, typeDescriptor: Amazon.Alexa.LanguageModelType) {
            let closedList = new Microsoft.LUIS.ClosedList(slot.type, [], [slot.name]);
            typeDescriptor.values.forEach((value) => {
                let canonicalForm = new Microsoft.LUIS.ClosedListSublist(value.name.value);
                closedList.addSublist(canonicalForm, true);
            })

            this.luis.addClosedList(closedList);
            return slot.type + ":" + slot.name;
        }

        // Process simple Alexa entity (no type provided)
        private processSimpleEntity(slot: Amazon.Alexa.LanguageModelIntentSlot): string {
            this.luis.addEntity(new Microsoft.LUIS.Entity(slot.type, [slot.name]));
            return slot.type + ":" + slot.name;
        }

        private processEntitySample(intentName: string, sample: string, slotPairs: Array<{slot: string, replacement: string}>) {
            // replace slots with new entities
            let pattern = sample;

            if (slotPairs !== null && slotPairs.length > 0) {
                let ignore = false;
                slotPairs.forEach((pair) => {
                    // replace all occurrences
                    let escape = `{${pair.slot}}`.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
                    let escapeRegExp = new RegExp(escape, 'g');

                    if ((pattern.match(escapeRegExp) || []).length == 1) {
                        pattern = pattern.replace(escapeRegExp, `{${pair.replacement}}`);
                    } else {
                        // ignore patterns with 2 or more occurrences of the same slot (not supported in LUIS)
                        console.log(`Warning. Ignoring the sample: "${sample}". Multiple occurrences of the same slot are not suppurted for patterns in LUIS.`)
                        ignore = true;
                    }
                });
                if (!ignore) {
                    this.luis.addPattern(new Microsoft.LUIS.Pattern(pattern, intentName));
                }                
            } else {
                this.luis.addUtterance(new Microsoft.LUIS.Utterance(sample, intentName));
            }
            
        }

        /* External interface */

        public static convert(alexaModel: Amazon.Alexa.AlexaModel, versionId: string, culture: string): Microsoft.LUIS.LUISModel {
            let converter = new Alexa2LUISConverter(alexaModel, versionId, culture);
            converter.convert();
            return converter.luis;

        }
    }
}