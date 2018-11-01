define("models/Microsoft.LUIS", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    /* Microsoft LUIS model
    ** Based on the schema available at https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5892283039e2bb0d9c2805f5
    */
    var LUMC;
    (function (LUMC) {
        var Models;
        (function (Models) {
            var LUIS;
            (function (LUIS) {
                /* Helper functions */
                function addToNamedCollection(collection, newItem) {
                    if (collection !== null) {
                        let i;
                        if ((i = collection.find((item) => {
                            return item.name.toLocaleLowerCase() == newItem.name.toLocaleLowerCase();
                        })) == null) {
                            collection.push(newItem);
                        }
                    }
                    else {
                        collection = new Array(newItem);
                    }
                    return collection;
                }
                function addToStringCollection(collection, newItem, caseSensetive = false) {
                    if (collection !== null) {
                        if (collection.find((item) => {
                            if (caseSensetive) {
                                return item == newItem;
                            }
                            else {
                                return item.toLocaleLowerCase() == newItem.toLocaleLowerCase();
                            }
                        }) == null) {
                            collection.push(newItem);
                        }
                    }
                    else {
                        collection = new Array(newItem);
                    }
                    return collection;
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
                class IntentInherit {
                    constructor(domainName, modelName) {
                        this.domain_name = domainName;
                        this.model_name = modelName;
                    }
                }
                LUIS.IntentInherit = IntentInherit;
                class Entity {
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
                        if (this.sublists !== null) {
                            let l = null;
                            // check for duplicates
                            if ((l = this.sublists.find((list) => {
                                return list.canonicalForm.toLocaleLowerCase() == newSubList.canonicalForm.toLocaleLowerCase();
                            })) == null) {
                                this.sublists.push(newSubList);
                            }
                            else if (merge) {
                                l.mergeSublist(newSubList);
                            }
                        }
                        else {
                            this.sublists = new Array(newSubList);
                        }
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
                        this.entities = addToNamedCollection(this.entities, newEntity);
                    }
                    addClosedList(newClosedList) {
                        this.closedLists = addToNamedCollection(this.closedLists, newClosedList);
                    }
                    addComposite(newComposite) {
                        this.composites = addToNamedCollection(this.composites, newComposite);
                    }
                    addPatternAnyEntity(newPatternAnyEntity) {
                        this.patternAnyEntities = addToNamedCollection(this.patternAnyEntities, newPatternAnyEntity);
                    }
                    addRegExEntity(newRegExEntity) {
                        this.regex_entities = addToNamedCollection(this.regex_entities, newRegExEntity);
                    }
                    addPrebuiltEntity(newPrebuiltEntity) {
                        this.prebuiltEntities = addToNamedCollection(this.prebuiltEntities, newPrebuiltEntity);
                    }
                    addRegExFeature(newRegExFeature) {
                        this.regex_features = addToNamedCollection(this.regex_features, newRegExFeature);
                    }
                    addModelFeature(newModelFeature) {
                        this.model_features = addToNamedCollection(this.model_features, newModelFeature);
                    }
                    addPattern(newPattern) {
                        if (this.patterns !== null) {
                            if (this.patterns.find((pattern) => {
                                return pattern.pattern.toLocaleLowerCase() == newPattern.pattern.toLocaleLowerCase();
                            }) == null) {
                                this.patterns.push(newPattern);
                            }
                        }
                        else {
                            this.patterns = new Array(newPattern);
                        }
                    }
                    addUtterance(newUtterance) {
                        if (this.utterances !== null) {
                            if (this.utterances.find((utterance) => {
                                return utterance.text.toLocaleLowerCase() == newUtterance.text.toLocaleLowerCase();
                            }) == null) {
                                this.utterances.push(newUtterance);
                            }
                        }
                        else {
                            this.utterances = new Array(newUtterance);
                        }
                    }
                }
                LUISModel.DefaultSchemaVersion = "3.1.0";
                LUISModel.DefaultCulture = "en-us";
                LUIS.LUISModel = LUISModel;
            })(LUIS = Models.LUIS || (Models.LUIS = {}));
        })(Models = LUMC.Models || (LUMC.Models = {}));
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
        var Models;
        (function (Models) {
            var Alexa;
            (function (Alexa) {
                class InteractionModel {
                    constructor(languageModel, dialog, prompts) {
                        this.languageModel = languageModel;
                        this.dialog = (dialog !== undefined) ? dialog : null;
                        this.prompts = (prompts !== undefined) ? prompts : new Array();
                    }
                    toJSONObject() {
                        return {
                            languageModel: this.languageModel.toJSONObject(),
                            dialog: (this.dialog !== null) ? this.dialog.toJSONObject() : null,
                            prompts: this.prompts.map((prompt) => {
                                return prompt.toJSONObject();
                            })
                        };
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
                    toJSONObject() {
                        return {
                            invocationName: this.invocationName,
                            intents: this.intents.map((intent) => {
                                return intent.toJSONObject();
                            }),
                            types: this.types.map((type) => {
                                return type.toJSONObject();
                            })
                        };
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
                    toJSONObject() {
                        return {
                            name: this.name,
                            slots: this.slots.map((slot) => {
                                return slot.toJSONObject();
                            }),
                            samples: this.samples.map((sample) => {
                                return sample;
                            })
                        };
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
                    toJSONObject() {
                        return {
                            name: this.name,
                            type: this.type,
                            samples: this.samples.map((sample) => {
                                return sample;
                            })
                        };
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
                    toJSONObject() {
                        return {
                            name: this.name,
                            values: this.values.map((value) => {
                                return value.toJSONObject();
                            })
                        };
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
                    toJSONObject() {
                        return {
                            name: this.name.toJSONObject(),
                            id: this.id,
                        };
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
                    toJSONObject() {
                        return {
                            value: this.value
                        };
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
                    toJSONObject() {
                        return {
                            value: this.value,
                            synonyms: this.synonyms.map((synonym) => {
                                return synonym.toString();
                            })
                        };
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
                    toJSONObject() {
                        return {
                            intents: this.intents.map((intent) => {
                                return intent.toJSONObject();
                            })
                        };
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
                    toJSONObject() {
                        return {
                            name: this.name,
                            slots: this.slots.map((slot) => {
                                return slot.toJSONObject();
                            }),
                            confirmationRequired: this.confirmationRequired,
                            prompts: this.prompts.toJSONObject()
                        };
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
                    toJSONObject() {
                        return {
                            confirmation: this.confirmation
                        };
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
                    toJSONObject() {
                        return {
                            name: this.name,
                            type: this.type,
                            elicitationRequired: this.elicitationRequired,
                            confirmationRequired: this.confirmationRequired,
                            prompts: this.prompts.toJSONObject()
                        };
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
                    toJSONObject() {
                        return {
                            elicitation: this.elicitation,
                            confirmation: this.confirmation
                        };
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
                    toJSONObject() {
                        return {
                            id: this.id,
                            variations: this.variations.map((variation) => {
                                return variation.toJSONObject();
                            })
                        };
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
                    toJSONObject() {
                        return {
                            type: this.type,
                            value: this.value
                        };
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
                    toJSONObject() {
                        return {
                            interactionModel: this.interactionModel.toJSONObject()
                        };
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
                        return JSON.stringify(this.toJSONObject());
                    }
                    static deserialize(json) {
                        let o = JSON.parse(json);
                        return AlexaModel.fromJSONObject(o);
                    }
                }
                Alexa.AlexaModel = AlexaModel;
            })(Alexa = Models.Alexa || (Models.Alexa = {}));
        })(Models = LUMC.Models || (LUMC.Models = {}));
    })(LUMC = exports.LUMC || (exports.LUMC = {}));
});
define("converters/Alexa2Luis", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LUMC;
    (function (LUMC) {
        var Converters;
        (function (Converters) {
            class Alexa2LUIS {
            }
            Converters.Alexa2LUIS = Alexa2LUIS;
        })(Converters = LUMC.Converters || (LUMC.Converters = {}));
    })(LUMC = exports.LUMC || (exports.LUMC = {}));
});
//# sourceMappingURL=lucm.js.map