define("models/Microsoft.LUIS", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /* Microsoft LUIS model
    ** Based on the schema available at https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5892283039e2bb0d9c2805f5
    */
    var LUMC;
    (function (LUMC) {
        var LUIS;
        (function (LUIS) {
            /* Helper functions */
            function addToCollection(collection, newItem, equal, merger) {
                if (collection !== null && collection.length > 0) {
                    if (collection.find((item, index) => {
                        if (equal(item, newItem)) {
                            if (merger instanceof Function) {
                                collection[index] = merger(item, newItem);
                            }
                            return true;
                        }
                        return false;
                    }) == undefined) {
                        collection.push(newItem);
                    }
                }
                else {
                    collection = new Array(newItem);
                }
                return collection;
            }
            function addToNamedCollection(collection, newItem, merger) {
                return addToCollection(collection, newItem, (itemA, itemB) => {
                    return itemA.name.toLocaleLowerCase() == itemB.name.toLocaleLowerCase();
                }, merger);
            }
            function addToNamedRolesBasedCollection(collection, newItem) {
                return addToCollection(collection, newItem, (itemA, itemB) => {
                    return itemA.name.toLocaleLowerCase() == itemB.name.toLocaleLowerCase();
                }, (baseItem, mergedItem) => {
                    mergedItem.roles.forEach((role) => {
                        baseItem.addRole(role);
                    });
                    return baseItem;
                });
            }
            function addToStringCollection(collection, newItem, caseSensetive = false) {
                return addToCollection(collection, newItem, (itemA, itemB) => {
                    if (caseSensetive) {
                        return itemA == itemB;
                    }
                    else {
                        return itemA.toLocaleLowerCase() == itemB.toLocaleLowerCase();
                    }
                }, null);
            }
            /* LUIS Model Classes */
            class Intent {
                constructor(name, inherit) {
                    this.name = name;
                    this.inherits = (inherit !== undefined) ? inherit : null;
                }
                setInherits(inherit) {
                    this.inherits = inherit;
                }
            }
            LUIS.Intent = Intent;
            class Inherit {
                constructor(domainName, modelName) {
                    this.domain_name = domainName;
                    this.model_name = modelName;
                }
            }
            LUIS.Inherit = Inherit;
            class Entity {
                constructor(name, children, roles, inherit) {
                    this.name = name;
                    this.children = (children !== undefined) ? children : new Array();
                    this.roles = (roles !== undefined) ? roles : new Array();
                    this.inherits = (inherit !== undefined) ? inherit : null;
                }
                addChild(newChildEntity) {
                    this.children = addToStringCollection(this.children, newChildEntity);
                }
                addRole(newRole) {
                    this.roles = addToStringCollection(this.roles, newRole);
                }
                setInherits(inherit) {
                    this.inherits = inherit;
                }
            }
            LUIS.Entity = Entity;
            /*
            class BingEntity extends Entity {
        
            }
        
            class Action {
                public actionName: string;
                public actionParameters: Array<ActionParameter>;
                public intentName: string;
                public channel: ActionChannel;
            }
            
        
            class ActionParameter {
                public phraseListFeatureName: string;
                public parameterName: string;
                public entityName: string;
                public required: boolean;
                public question: string;
            }
        
            class ActionChannel {
                public settings: Array<ActionChannelSetting>;
                public name: string;
                public method: string;
            }
        
            class ActionChannelSetting {
                public name: string;
                public value: string;
            }
            */
            class ClosedList {
                constructor(name, sublists, roles) {
                    this.name = name;
                    this.sublists = sublists;
                    this.roles = (roles !== undefined) ? roles : new Array();
                }
                addSublist(newSubList, merge = false) {
                    this.sublists = addToCollection(this.sublists, newSubList, (itemA, itemB) => {
                        return itemA.canonicalForm.toLocaleLowerCase() == itemB.canonicalForm.toLocaleLowerCase();
                    }, (baseItem, mergedItem) => {
                        return baseItem.mergeSublist(mergedItem);
                    });
                }
                addRole(newRole) {
                    this.roles = addToStringCollection(this.roles, newRole);
                }
            }
            LUIS.ClosedList = ClosedList;
            class ClosedListSublist {
                constructor(canonicalForm, list, roles) {
                    this.canonicalForm = canonicalForm;
                    this.list = (list !== undefined) ? list : new Array();
                    this.roles = (roles !== undefined) ? roles : new Array();
                }
                addListItem(newItem) {
                    this.list = addToStringCollection(this.list, newItem);
                }
                addRole(newRole) {
                    this.roles = addToStringCollection(this.roles, newRole);
                }
                mergeSublist(sublist) {
                    sublist.list.forEach((item) => {
                        this.addListItem(item);
                    });
                    sublist.roles.forEach((role) => {
                        this.addRole(role);
                    });
                    return this;
                }
            }
            LUIS.ClosedListSublist = ClosedListSublist;
            class Composite {
                constructor(name, children, roles) {
                    this.name = name;
                    this.children = (children !== undefined) ? children : new Array();
                    this.roles = (roles !== undefined) ? roles : new Array();
                }
                addChild(newChildEntity) {
                    this.children = addToStringCollection(this.children, newChildEntity);
                }
                addRole(newRole) {
                    this.roles = addToStringCollection(this.roles, newRole);
                }
            }
            LUIS.Composite = Composite;
            class PatternAnyEntity {
                constructor(name, explicitList, roles) {
                    this.name = name;
                    this.explicitList = (explicitList !== undefined) ? explicitList : new Array();
                    this.roles = (roles !== undefined) ? roles : new Array();
                }
                addExplicitListItem(newListItem) {
                    this.explicitList = addToStringCollection(this.explicitList, newListItem);
                }
                addRole(newRole) {
                    this.roles = addToStringCollection(this.roles, newRole);
                }
            }
            LUIS.PatternAnyEntity = PatternAnyEntity;
            class RegExEntity {
                constructor(name, regexPattern, roles) {
                    this.name = name;
                    this.regexPattern = regexPattern;
                    this.roles = (roles !== undefined) ? roles : new Array();
                }
                addRole(newRole) {
                    this.roles = addToStringCollection(this.roles, newRole);
                }
            }
            LUIS.RegExEntity = RegExEntity;
            class PrebuiltEntity {
                constructor(name, roles) {
                    this.name = name;
                    this.roles = (roles !== undefined) ? roles : new Array();
                }
                addRole(newRole) {
                    this.roles = addToStringCollection(this.roles, newRole);
                }
            }
            LUIS.PrebuiltEntity = PrebuiltEntity;
            class RegExFeature {
                constructor(name, pattern, activated = true, roles) {
                    this.name = name;
                    this.pattern = pattern;
                    this.activated = activated;
                    this.roles = (roles !== undefined) ? roles : new Array();
                }
                addRole(newRole) {
                    this.roles = addToStringCollection(this.roles, newRole);
                }
            }
            LUIS.RegExFeature = RegExFeature;
            class ModelFeature {
                constructor(name, words, mode = true, activated = true) {
                    this.name = name;
                    this.words = words;
                    this.mode = mode;
                    this.activated = activated;
                }
            }
            LUIS.ModelFeature = ModelFeature;
            class Pattern {
                constructor(pattern, intent) {
                    this.pattern = pattern;
                    this.intent = intent;
                }
            }
            LUIS.Pattern = Pattern;
            class Utterance {
                constructor(text, intent, entities) {
                    this.text = text;
                    this.intent = intent;
                    this.entities = (entities !== undefined) ? entities : new Array();
                }
                addEntity(newEntity) {
                    if (this.entities !== null) {
                        // no additional checks for duplicates?
                        this.entities.push(newEntity);
                    }
                }
            }
            LUIS.Utterance = Utterance;
            class UtteranceEntity {
                constructor(startPos, endPos, entity) {
                    this.startPos = startPos;
                    this.endPos = endPos;
                    this.entity = entity;
                }
            }
            LUIS.UtteranceEntity = UtteranceEntity;
            class LUISModel {
                constructor(name, versionId, culture, desc = "") {
                    // basic properties
                    this.name = name;
                    this.versionId = versionId;
                    this.culture = (culture !== undefined) ? culture : LUISModel.DefaultCulture;
                    this.luis_schema_version = LUISModel.DefaultSchemaVersion;
                    this.desc = desc;
                    // model content
                    this.intents = new Array();
                    this.entities = new Array();
                    this.closedLists = new Array();
                    this.composites = new Array();
                    this.patternAnyEntities = new Array();
                    this.regex_entities = new Array();
                    this.prebuiltEntities = new Array();
                    this.regex_features = new Array();
                    this.model_features = new Array();
                    this.patterns = new Array();
                    this.utterances = new Array();
                }
                addIntent(newIntent) {
                    this.intents = addToNamedCollection(this.intents, newIntent);
                }
                addEntity(newEntity) {
                    this.entities = addToNamedRolesBasedCollection(this.entities, newEntity);
                }
                addClosedList(newClosedList) {
                    this.closedLists = addToNamedRolesBasedCollection(this.closedLists, newClosedList);
                }
                addComposite(newComposite) {
                    this.composites = addToNamedRolesBasedCollection(this.composites, newComposite);
                }
                addPatternAnyEntity(newPatternAnyEntity) {
                    this.patternAnyEntities = addToNamedRolesBasedCollection(this.patternAnyEntities, newPatternAnyEntity);
                }
                addRegExEntity(newRegExEntity) {
                    this.regex_entities = addToNamedRolesBasedCollection(this.regex_entities, newRegExEntity);
                }
                addPrebuiltEntity(newPrebuiltEntity) {
                    this.prebuiltEntities = addToNamedRolesBasedCollection(this.prebuiltEntities, newPrebuiltEntity);
                }
                addRegExFeature(newRegExFeature) {
                    this.regex_features = addToNamedRolesBasedCollection(this.regex_features, newRegExFeature);
                }
                addModelFeature(newModelFeature) {
                    this.model_features = addToNamedCollection(this.model_features, newModelFeature);
                }
                addPattern(newPattern) {
                    this.patterns = addToCollection(this.patterns, newPattern, (itemA, itemB) => {
                        return itemA.pattern.toLocaleLowerCase() == itemB.pattern.toLocaleLowerCase();
                    }, null);
                }
                addUtterance(newUtterance) {
                    this.utterances = addToCollection(this.utterances, newUtterance, (itemA, itemB) => {
                        return itemA.text.toLocaleLowerCase() == itemB.text.toLocaleLowerCase();
                    }, null);
                }
                serialize() {
                    return JSON.stringify(this);
                }
            }
            LUISModel.DefaultSchemaVersion = "3.1.0";
            LUISModel.DefaultCulture = "en-us";
            LUIS.LUISModel = LUISModel;
        })(LUIS = LUMC.LUIS || (LUMC.LUIS = {}));
    })(LUMC = exports.LUMC || (exports.LUMC = {}));
});
/* Amazon Alexa Language Understanding model
** Based on the Interaction Model described here: https://developer.amazon.com/docs/smapi/interaction-model-schema.html
*/
define("models/Amazon.Alexa", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LUMC;
    (function (LUMC) {
        var Alexa;
        (function (Alexa) {
            class InteractionModel {
                constructor(languageModel, dialog, prompts) {
                    this.languageModel = languageModel;
                    this.dialog = (dialog !== undefined) ? dialog : null;
                    this.prompts = (prompts !== undefined) ? prompts : new Array();
                }
                static fromJSONObject(jsonObj) {
                    if (jsonObj.languageModel !== undefined) {
                        let im = new InteractionModel(LanguageModel.fromJSONObject(jsonObj.languageModel));
                        if (jsonObj.dialog !== undefined) {
                            im.dialog = Dialog.fromJSONObject(jsonObj.dialog);
                        }
                        if (jsonObj.prompts !== undefined) {
                            im.prompts = jsonObj.prompts.map((prompt) => {
                                return Prompt.fromJSONObject(prompt);
                            });
                        }
                        return im;
                    }
                    else {
                        throw ("Provided JSON object doesn't match class definition for InteractionModel");
                    }
                }
            }
            Alexa.InteractionModel = InteractionModel;
            class LanguageModel {
                constructor(invocationName, intents, types) {
                    this.invocationName = invocationName;
                    this.intents = intents;
                    this.types = (types != undefined) ? types : new Array();
                }
                static fromJSONObject(jsonObj) {
                    if (jsonObj.invocationName !== undefined && jsonObj.intents !== undefined) {
                        let lm = new LanguageModel(jsonObj.invocationName, jsonObj.intents.map((intent) => {
                            return LanguageModelIntent.fromJSONObject(intent);
                        }));
                        if (jsonObj.intents !== undefined) {
                            lm.types = jsonObj.types.map((type) => {
                                return LanguageModelType.fromJSONObject(type);
                            });
                        }
                        return lm;
                    }
                    else {
                        throw ("Provided JSON object doesn't match class definition for LanguageModel");
                    }
                }
            }
            Alexa.LanguageModel = LanguageModel;
            class LanguageModelIntent {
                constructor(name, slots, samples) {
                    this.name = name;
                    this.slots = (slots !== undefined) ? slots : new Array();
                    this.samples = (samples !== undefined) ? samples : new Array();
                }
                static fromJSONObject(jsonObj) {
                    if (jsonObj.name !== undefined) {
                        let intent = new LanguageModelIntent(jsonObj.name);
                        if (jsonObj.slots !== undefined) {
                            intent.slots = jsonObj.slots.map((slot) => {
                                return LanguageModelIntentSlot.fromJSONObj(slot);
                            });
                        }
                        if (jsonObj.samples !== undefined) {
                            intent.samples = jsonObj.samples.map((sample) => {
                                return sample.toString();
                            });
                        }
                        return intent;
                    }
                    else {
                        throw ("Provided JSON object doesn't match class definition for LanguageModelIntent");
                    }
                }
            }
            Alexa.LanguageModelIntent = LanguageModelIntent;
            class LanguageModelIntentSlot {
                constructor(name, type, samples = []) {
                    this.name = name;
                    this.type = type;
                    this.samples = samples;
                }
                static fromJSONObj(jsonObj) {
                    if (jsonObj.name !== undefined && jsonObj.type !== undefined) {
                        let slot = new LanguageModelIntentSlot(jsonObj.name, jsonObj.type);
                        if (jsonObj.samples !== undefined) {
                            slot.samples = jsonObj.samples.map((sample) => {
                                return sample.toString();
                            });
                        }
                        return slot;
                    }
                    else {
                        throw ("Provided JSON object doesn't match class definition for LanguageModelIntentSlot");
                    }
                }
            }
            Alexa.LanguageModelIntentSlot = LanguageModelIntentSlot;
            class LanguageModelType {
                constructor(name, values) {
                    this.name = name;
                    this.values = values;
                }
                static fromJSONObject(jsonObj) {
                    if (jsonObj.name !== undefined && jsonObj.values !== undefined) {
                        return new LanguageModelType(jsonObj.name, jsonObj.values.map((value) => {
                            return LanguageModelTypeValue.fromJSONObject(value);
                        }));
                    }
                    else {
                        throw ("Provided JSON object doesn't match class definition for LanguageModelType");
                    }
                }
            }
            Alexa.LanguageModelType = LanguageModelType;
            class LanguageModelTypeValue {
                constructor(name, id = "") {
                    this.name = name;
                    this.id = id;
                }
                static fromJSONObject(jsonObj) {
                    if (jsonObj.name !== undefined) {
                        let value = new LanguageModelTypeValue(LanguageModelTypeValueName.fromJSONObject(jsonObj.name));
                        if (jsonObj.id !== undefined) {
                            value.id = jsonObj.id.toString();
                        }
                        return value;
                    }
                    else {
                        throw ("Provided JSON object doesn't match class definition for LanguageModelTypeValue");
                    }
                }
            }
            Alexa.LanguageModelTypeValue = LanguageModelTypeValue;
            class LanguageModelTypeValueName {
                constructor(value) {
                    this.value = value;
                }
                static fromJSONObject(jsonObj) {
                    if (jsonObj.value !== undefined) {
                        return new LanguageModelTypeValueName(jsonObj.value);
                    }
                    else {
                        throw ("Provided JSON object doesn't match class definition for LanguageModelTypeValueName");
                    }
                }
            }
            Alexa.LanguageModelTypeValueName = LanguageModelTypeValueName;
            class LanguageModelTypeValueSynonyms extends LanguageModelTypeValueName {
                constructor(value, synonyms) {
                    super(value);
                    this.synonyms = (synonyms !== undefined) ? synonyms : new Array();
                }
                static fromJSONObject(jsonObj) {
                    if (jsonObj.value !== undefined) {
                        let value = new LanguageModelTypeValueSynonyms(jsonObj.value);
                        if (jsonObj.synonyms !== undefined) {
                            value.synonyms = jsonObj.synonyms.map((synonym) => {
                                return synonym.toString();
                            });
                        }
                        return value;
                    }
                    else {
                        throw ("Provided JSON object doesn't match class definition for LanguageModelTypeValueSynonyms");
                    }
                }
            }
            Alexa.LanguageModelTypeValueSynonyms = LanguageModelTypeValueSynonyms;
            class Dialog {
                constructor(intents) {
                    this.intents = intents;
                }
                static fromJSONObject(jsonObj) {
                    if (jsonObj.intents !== undefined) {
                        return new Dialog(jsonObj.intents.map((intent) => {
                            return DialogIntent.fromJSONObject(intent);
                        }));
                    }
                    else {
                        throw ("Provided JSON object doesn't match class definition for Dialog");
                    }
                }
            }
            Alexa.Dialog = Dialog;
            class DialogIntent {
                constructor(name, slots, confirmationRequired, prompts) {
                    this.name = name;
                    this.slots = (slots !== undefined) ? slots : new Array();
                    this.confirmationRequired = (confirmationRequired !== undefined) ? confirmationRequired : false;
                    this.prompts = (prompts !== undefined) ? prompts : new DialogIntentPromptType();
                }
                static fromJSONObject(jsonObj) {
                    if (jsonObj.name !== undefined) {
                        let intent = new DialogIntent(jsonObj.name);
                        if (jsonObj.slots !== undefined) {
                            intent.slots = jsonObj.slots.map((slot) => {
                                return DialogIntentSlot.fromJSONObject(slot);
                            });
                        }
                        if (jsonObj.confirmationRequired !== undefined) {
                            intent.confirmationRequired = jsonObj.confirmationRequired;
                        }
                        if (jsonObj.prompts !== undefined) {
                            intent.prompts = DialogIntentPromptType.fromJSONObject(jsonObj.prompts);
                        }
                        return intent;
                    }
                    else {
                        throw ("Provided JSON object doesn't match class definition for DialogIntent");
                    }
                }
            }
            Alexa.DialogIntent = DialogIntent;
            class DialogIntentPromptType {
                constructor(confirmation) {
                    this.confirmation = (this.confirmation !== undefined) ? confirmation : "";
                }
                static fromJSONObject(jsonObj) {
                    return new DialogIntentPromptType(jsonObj.confirmation);
                    // no exceptions as empty object is allowed
                }
            }
            Alexa.DialogIntentPromptType = DialogIntentPromptType;
            class DialogIntentSlot {
                constructor(name, type, elicitationRequired, confirmationRequired, prompts) {
                    this.name = name;
                    this.type = type;
                    this.elicitationRequired = (elicitationRequired !== undefined) ? elicitationRequired : false;
                    this.confirmationRequired = (confirmationRequired !== undefined) ? confirmationRequired : false;
                    this.prompts = (prompts !== undefined) ? prompts : new DialogIntentSlotPromptType();
                }
                static fromJSONObject(jsonObj) {
                    if (jsonObj.name !== undefined && jsonObj.type !== undefined) {
                        let slot = new DialogIntentSlot(jsonObj.name, jsonObj.type);
                        if (jsonObj.confirmationRequired !== undefined) {
                            slot.confirmationRequired = jsonObj.confirmationRequired;
                        }
                        if (jsonObj.elicitationRequired !== undefined) {
                            slot.elicitationRequired = jsonObj.elicitationRequired;
                        }
                        if (jsonObj.prompts !== undefined) {
                            slot.prompts = DialogIntentSlotPromptType.fromJSONObject(jsonObj.prompts);
                        }
                        return slot;
                    }
                    else {
                        throw ("Provided JSON object doesn't match class definition for DialogIntentSlot");
                    }
                }
            }
            Alexa.DialogIntentSlot = DialogIntentSlot;
            class DialogIntentSlotPromptType {
                constructor(elicitation, confirmation) {
                    this.elicitation = (elicitation !== undefined) ? elicitation : "";
                    this.confirmation = (confirmation !== undefined) ? confirmation : "";
                }
                static fromJSONObject(jsonObj) {
                    return new DialogIntentSlotPromptType(jsonObj.elicitation, jsonObj.confirmation);
                    // no exceptions as empty object is allowed
                }
            }
            Alexa.DialogIntentSlotPromptType = DialogIntentSlotPromptType;
            class Prompt {
                constructor(id, variations) {
                    this.id = id;
                    this.variations = variations;
                }
                static fromJSONObject(jsonObj) {
                    if (jsonObj.id !== undefined && jsonObj.variations !== undefined) {
                        return new Prompt(jsonObj.id, jsonObj.variations.map((variation) => {
                            return PromptVariation.fromJSONObject(variation);
                        }));
                    }
                    else {
                        throw ("Provided JSON object doesn't match class definition for Prompt");
                    }
                }
            }
            Alexa.Prompt = Prompt;
            class PromptVariation {
                constructor(type, value) {
                    this.type = type;
                    this.value = value;
                }
                static fromJSONObject(jsonObj) {
                    if (jsonObj.type !== undefined && jsonObj.value !== undefined) {
                        return new PromptVariation(jsonObj.type, jsonObj.value);
                    }
                    else {
                        throw ("Provided JSON object doesn't match class definition for PromptVariation");
                    }
                }
            }
            Alexa.PromptVariation = PromptVariation;
            let PromptVariationType;
            (function (PromptVariationType) {
                PromptVariationType["PlainText"] = "PlainText";
                PromptVariationType["SSML"] = "SSML";
            })(PromptVariationType = Alexa.PromptVariationType || (Alexa.PromptVariationType = {}));
            class AlexaModel {
                constructor(interactionModel) {
                    this.interactionModel = interactionModel;
                }
                static fromJSONObject(jsonObj) {
                    if (jsonObj.interactionModel !== undefined) {
                        return new AlexaModel(InteractionModel.fromJSONObject(jsonObj.interactionModel));
                    }
                    else {
                        throw ("Provided JSON object doesn't match class definition for AlexaModel");
                    }
                }
                serialize() {
                    return JSON.stringify(this);
                }
                static deserialize(json) {
                    let o = JSON.parse(json);
                    return AlexaModel.fromJSONObject(o);
                }
            }
            Alexa.AlexaModel = AlexaModel;
        })(Alexa = LUMC.Alexa || (LUMC.Alexa = {}));
    })(LUMC = exports.LUMC || (exports.LUMC = {}));
});
define("converters/Alexa2Luis", ["require", "exports", "models/Microsoft.LUIS"], function (require, exports, Microsoft_LUIS_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LUMC;
    (function (LUMC) {
        var Converters;
        (function (Converters) {
            class Alexa2LUISConverter {
                constructor(alexaModel, versionId, culture) {
                    /* Standard Built-in Alexa Intents
                    ** Source: https://developer.amazon.com/docs/custom-skills/standard-built-in-intents.html
                    ** Used locale: English
                    **
                    ** Important: no domain based intents cover yet
                    */
                    this.builtInAlexaIntents = [
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
                    this.buildInTypesMap = [
                        /* Numbers, Dates, and Times */
                        { alexa: "AMAZON.DATE", luis: "datetimeV2", luisType: "prebuilt" },
                        //{ alexa: "AMAZON.DURATION", luis: ""},
                        //{ alexa: "AMAZON.FOUR_DIGIT_NUMBER", luis: ""},
                        { alexa: "AMAZON.NUMBER", luis: "number", luisType: "prebuilt" },
                        { alexa: "AMAZON.Ordinal", luis: "ordinal", luisType: "prebuilt" },
                        { alexa: "AMAZON.PhoneNumber", luis: "phonenumber", luisType: "prebuilt" },
                        { alexa: "AMAZON.TIME", luis: "datetimeV2", luisType: "prebuilt" },
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
                        { alexa: "AMAZON.Country", luis: "geographyV2", luisType: "prebuilt" },
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
                        { alexa: "AMAZON.Language", luis: "Translate.TargetLanguage", luisType: "domain" },
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
                        { alexa: "AMAZON.Musician", luis: "Music.ArtistName", luisType: "domain" },
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
                        { alexa: "AMAZON.TelevisionChannel", luis: "TV.ChannelName", luisType: "domain" },
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
                        { alexa: "AMAZON.GB_FIRST_NAME", luis: "personName", luisType: "prebuilt" },
                        //{ alexa: "AMAZON.GB_REGION", luis: ""},
                        /* US */
                        { alexa: "AMAZON.US_CITY", luis: "geographyV2", luisType: "prebuilt" },
                        { alexa: "AMAZON.US_FIRST_NAME", luis: "personName", luisType: "prebuilt" },
                        { alexa: "AMAZON.US_STATE", luis: "geographyV2", luisType: "prebuilt" },
                    ];
                    this.alexa = alexaModel;
                    this.luisVersionId = versionId;
                    this.luisCulture = culture;
                }
                convert() {
                    if (this.alexa !== null) {
                        let modelName = this.alexa.interactionModel.languageModel.invocationName;
                        this.luis = new Microsoft_LUIS_1.LUMC.LUIS.LUISModel(modelName, this.luisVersionId, this.luisCulture, "");
                        let languageModel = this.alexa.interactionModel.languageModel;
                        languageModel.intents.forEach((intent) => {
                            if (intent.slots == null || intent.slots.length == 0) {
                                this.processSimpleAlexaIntent(intent);
                            }
                            else {
                                this.processComplexAlexaIntent(intent, languageModel.types);
                            }
                        });
                        /* Ignore Dialog and Prompts
                         * ...but, slots samples, used in dialogs, are translated into patterns
        
                        let dialog = this.alexa.interactionModel.dialog;
                        let prompts = this.alexa.interactionModel.prompts;
                        */
                    }
                }
                // Intent with no slots
                processSimpleAlexaIntent(intent) {
                    // Use some samples from AMAZON for standard built-in intents to generate utterances
                    // Open issues:
                    // * Coverage on built-in intents
                    // * Mapping of Alexa build-in intents to LUIS build-in intents
                    if (intent.name.startsWith("AMAZON")) {
                        let builtInIntent = this.builtInAlexaIntents.find((builtin) => {
                            return builtin.intentName == intent.name;
                        });
                        if (builtInIntent !== undefined) {
                            if (builtInIntent.samples == null || builtInIntent.samples.length == 0) {
                                // not samples provided, ignore
                                console.log("Warning. No samples provided for the built-in Alexa intent: " + intent.name);
                            }
                            else {
                                builtInIntent.samples.forEach((sample) => {
                                    this.luis.addUtterance(new Microsoft_LUIS_1.LUMC.LUIS.Utterance(sample, intent.name));
                                });
                            }
                        }
                        else {
                            // not found, ignore
                            console.log("Warning. Not found built-in Alexa intent: " + intent.name);
                        }
                    }
                    // Use intent samples to generate utterances  
                    else {
                        intent.samples.forEach((sample) => {
                            this.luis.addUtterance(new Microsoft_LUIS_1.LUMC.LUIS.Utterance(sample, intent.name));
                        });
                    }
                }
                // Intent with slots
                processComplexAlexaIntent(intent, types) {
                    let slots = intent.slots;
                    // Convert slots into entities
                    slots.forEach((slot) => {
                        let type = slot.type;
                        // Use mapping for built-in entities
                        if (type.startsWith("AMAZON")) {
                            let map = this.buildInTypesMap.find((pair) => {
                                return pair.alexa == type;
                            });
                            if (map !== undefined) {
                                if (map.luisType === "domain") {
                                    let entity = new Microsoft_LUIS_1.LUMC.LUIS.Entity(map.luis, [slot.name]);
                                    let parts = map.luis.split(".");
                                    entity.setInherits(new Microsoft_LUIS_1.LUMC.LUIS.Inherit(parts[0], parts[1]));
                                    this.luis.addEntity(entity);
                                }
                                else if (map.luisType === "prebuilt") {
                                    this.luis.addPrebuiltEntity(new Microsoft_LUIS_1.LUMC.LUIS.PrebuiltEntity(map.luis, [slot.name]));
                                }
                            }
                            else {
                                // not found, ignore
                                console.log("Warning. Not found built-in Alexa entity: " + type);
                            }
                        }
                    });
                }
                /* External interface */
                static convert(alexaModel, versionId, culture) {
                    let converter = new Alexa2LUISConverter(alexaModel, versionId, culture);
                    converter.convert();
                    return converter.luis;
                }
            }
            Converters.Alexa2LUISConverter = Alexa2LUISConverter;
        })(Converters = LUMC.Converters || (LUMC.Converters = {}));
    })(LUMC = exports.LUMC || (exports.LUMC = {}));
});
//# sourceMappingURL=lucm.js.map