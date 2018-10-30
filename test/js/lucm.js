/* Microsoft LUIS model
*/
define("models/Microsoft.LUIS", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Microsoft;
    (function (Microsoft) {
        class LUISModel {
        }
        Microsoft.LUISModel = LUISModel;
    })(Microsoft = exports.Microsoft || (exports.Microsoft = {}));
});
/* Amazon Alexa Language Understanding model
** Based on the Interaction Model described here: https://developer.amazon.com/docs/smapi/interaction-model-schema.html
*/
define("models/Amazon.Alexa", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Amazon;
    (function (Amazon) {
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
        Amazon.InteractionModel = InteractionModel;
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
        Amazon.LanguageModel = LanguageModel;
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
        Amazon.LanguageModelIntent = LanguageModelIntent;
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
        Amazon.LanguageModelIntentSlot = LanguageModelIntentSlot;
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
        Amazon.LanguageModelType = LanguageModelType;
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
        Amazon.LanguageModelTypeValue = LanguageModelTypeValue;
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
        Amazon.LanguageModelTypeValueName = LanguageModelTypeValueName;
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
        Amazon.LanguageModelTypeValueSynonyms = LanguageModelTypeValueSynonyms;
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
        Amazon.Dialog = Dialog;
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
        Amazon.DialogIntent = DialogIntent;
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
        Amazon.DialogIntentPromptType = DialogIntentPromptType;
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
        Amazon.DialogIntentSlot = DialogIntentSlot;
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
        Amazon.DialogIntentSlotPromptType = DialogIntentSlotPromptType;
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
        Amazon.Prompt = Prompt;
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
        Amazon.PromptVariation = PromptVariation;
        let PromptVariationType;
        (function (PromptVariationType) {
            PromptVariationType["PlainText"] = "PlainText";
            PromptVariationType["SSML"] = "SSML";
        })(PromptVariationType = Amazon.PromptVariationType || (Amazon.PromptVariationType = {}));
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
        Amazon.AlexaModel = AlexaModel;
    })(Amazon = exports.Amazon || (exports.Amazon = {}));
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