/* Amazon Alexa Language Understanding model 
** Based on the Interaction Model described here: https://developer.amazon.com/docs/smapi/interaction-model-schema.html
*/

export namespace Amazon {
    export class InteractionModel {
        // Conversational primitives for the skill, required
        public languageModel: LanguageModel;
        // Rules for conducting a multi-turn dialog with the user, optional
        public dialog: Dialog;
        // Cues to the user on behalf of the skill for eliciting data or providing feedback, optional
        public prompts: Array<Prompt>;       
        
        constructor(languageModel:LanguageModel, dialog?: Dialog, prompts?: Array<Prompt>) {
            this.languageModel = languageModel;
            this.dialog = (dialog !== undefined)? dialog: null;
            this.prompts = (prompts !== undefined)? prompts: new Array<Prompt>();
        }

        public toJSONObject(): { languageModel: any, dialog?: any; prompts?: Array<any>} {
            return {
                languageModel: this.languageModel.toJSONObject(),
                dialog: (this.dialog !== null)? this.dialog.toJSONObject(): null,
                prompts: this.prompts.map((prompt) => {
                    return prompt.toJSONObject();
                })
            };
        }

        public static fromJSONObject(jsonObj: { languageModel: any, dialog?: any; prompts?: Array<any>}): InteractionModel {
            if (jsonObj.languageModel !== undefined) {
                let im = new InteractionModel(LanguageModel.fromJSONObject(jsonObj.languageModel));
                if (jsonObj.dialog !== undefined) {
                    im.dialog = Dialog.fromJSONObject(jsonObj.dialog);
                }
                if (jsonObj.prompts !== undefined) {
                    im.prompts = jsonObj.prompts.map((prompt) => {
                        return Prompt.fromJSONObject(prompt);
                    })
                }                
                return im;
            }
            else {
                throw("Provided JSON object doesn't match class definition for InteractionModel");
            }
        }

    }

    export class LanguageModel {
        // Invocation name of the skill, required
        public invocationName: string;
        // Intents and their slots, required
        public intents: Array<LanguageModelIntent>;
        // Custom slot types, optional
        public types: Array<LanguageModelType>;

        constructor(invocationName: string, intents: Array<LanguageModelIntent>, types?: Array<LanguageModelType>) {
            this.invocationName = invocationName;
            this.intents = intents;
            this.types = (types != undefined)? types: new Array<LanguageModelType>();
        }

        public toJSONObject(): { invocationName: string, intents: Array<any>; types?: Array<any>} {
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

        public static fromJSONObject(jsonObj: { invocationName: string, intents: Array<any>; types?: Array<any>}): LanguageModel {
            if (jsonObj.invocationName !== undefined && jsonObj.intents !== undefined) {
                let lm = new LanguageModel(
                    jsonObj.invocationName, 
                    jsonObj.intents.map((intent) => {
                        return LanguageModelIntent.fromJSONObject(intent);
                    })
                );

                if (jsonObj.intents !== undefined) {
                    lm.types = jsonObj.types.map((type) => {
                        return LanguageModelType.fromJSONObject(type);
                    })
                }                        
                return lm;
            }
            else {
                throw("Provided JSON object doesn't match class definition for LanguageModel");
            }
        }

    }

    export class LanguageModelIntent {
        // Name of the intent, required
        public name: string;
        // List of slots within the intent, optional
        public slots: Array<LanguageModelIntentSlot>;
        // Sample utterances for the intent, optional
        public samples: Array<string>;

        constructor(name: string, slots?: Array<LanguageModelIntentSlot>, samples?: Array<string>){
            this.name = name;
            this.slots = (slots !== undefined)? slots: new Array<LanguageModelIntentSlot>();
            this.samples = (samples !== undefined)? samples: new Array<string>();
        }

        public toJSONObject(): { name: any, slots?: Array<any>, samples?: Array<any> } {
            return {
                name: this.name,
                slots: this.slots.map((slot) => {
                    return slot.toJSONObject();
                }),
                samples: this.samples.map((sample) => {
                    return sample;
                })
            }
        }

        public static fromJSONObject(jsonObj: { name: any, slots?: Array<any>, samples?: Array<any> }): LanguageModelIntent {
            if (jsonObj.name !== undefined) {
                let intent = new LanguageModelIntent(jsonObj.name);

                if (jsonObj.slots !== undefined) {
                    intent.slots = jsonObj.slots.map((slot) => {
                        return LanguageModelIntentSlot.fromJSONObj(slot);
                    })
                }
                if (jsonObj.samples !== undefined) {
                    intent.samples = jsonObj.samples.map((sample) => {
                        return sample.toString();
                    })
                }

                return intent;
            } else {
                throw("Provided JSON object doesn't match class definition for LanguageModelIntent");
            }
        }
    }

    export class LanguageModelIntentSlot {
        // Name of the slot, required
        public name: string;
        // Type of the slot, required
        public type: string;
        // Sample utterances for the slot, optional
        public samples: Array<string>;

        constructor(name: string, type: string, samples: Array<string> = []) {
            this.name = name;
            this.type = type;
            this.samples = samples;
        }

        public toJSONObject(): { name: any, type: any, samples?: Array<any> } {
            return {
                name: this.name,
                type: this.type,
                samples: this.samples.map((sample) => {
                    return sample;
                })
            }
        }

        public static fromJSONObj(jsonObj: { name: any, type: any, samples?: Array<any> }): LanguageModelIntentSlot {
            if (jsonObj.name !== undefined && jsonObj.type !== undefined) {
                let slot = new LanguageModelIntentSlot(jsonObj.name, jsonObj.type);

                if (jsonObj.samples !== undefined) {
                    slot.samples = jsonObj.samples.map((sample) => {
                        return sample.toString();
                    })
                }

                return slot;
            } else {
                throw("Provided JSON object doesn't match class definition for LanguageModelIntentSlot");
            }
        }
    }

    export class LanguageModelType {
        // Name of the custom slot type, required
        public name: string;
        // List of representative values for the slot, required
        public values: Array<LanguageModelTypeValue>;       
        
        constructor(name: string, values: Array<LanguageModelTypeValue>) {
            this.name = name;
            this.values = values;
        }

        public toJSONObject(): { name: any, values: Array<any> } {
            return {
                name: this.name,
                values: this.values.map((value) => {
                    return value.toJSONObject();
                })
            }
        }

        public static fromJSONObject(jsonObj: { name: any, values: Array<any> }): LanguageModelType {
            if (jsonObj.name !== undefined && jsonObj.values !== undefined) {
                return new LanguageModelType(
                    jsonObj.name,
                    jsonObj.values.map((value) => {
                        return LanguageModelTypeValue.fromJSONObject(value);
                    })
                )
            } else {
                throw("Provided JSON object doesn't match class definition for LanguageModelType");
            }
        }
    }

    export class LanguageModelTypeValue {
        // Describes a value of a custom slot type, required
        public name: LanguageModelTypeValueName;
        // Identifier for a value of a custom slot type, optional?
        public id: string;

        constructor(name: LanguageModelTypeValueName, id: string = "") {
            this.name = name;
            this.id = id;
        }

        public toJSONObject(): { name: any, id?: any} {
            return {
                name: this.name.toJSONObject(),
                id: this.id,
            }
        }

        public static fromJSONObject(jsonObj: { name: any, id?: any}): LanguageModelTypeValue {
            if (jsonObj.name !== undefined) {
                let value = new LanguageModelTypeValue(LanguageModelTypeValueName.fromJSONObject(jsonObj.name));
                if (jsonObj.id !== undefined) {
                    value.id = jsonObj.id.toString();
                }
                return value;
            } else {
                throw("Provided JSON object doesn't match class definition for LanguageModelTypeValue");
            }
        }
    }

    export class LanguageModelTypeValueName {
        // A value for a custom slot type, required
        public value: string;

        constructor(value: string) {
            this.value = value;
        }

        public toJSONObject(): { value: any} {
            return {
                value: this.value
            }
        }

        public static fromJSONObject(jsonObj: { value: any}): LanguageModelTypeValueName {
            if (jsonObj.value !== undefined) {
                return new LanguageModelTypeValueName(jsonObj.value);
            } else {
                throw("Provided JSON object doesn't match class definition for LanguageModelTypeValueName");
            }
        }
    }

    export class LanguageModelTypeValueSynonyms extends LanguageModelTypeValueName {
        // List of potential synonyms for a value of a custom slot type, optional
        public synonyms: Array<string>;

        constructor(value: string, synonyms?: Array<string>) {
            super(value);
            this.synonyms = (synonyms !== undefined)? synonyms : new Array<string>();
        }

        public toJSONObject(): { value: any, synonyms?: Array<any> } {
            return {
                value: this.value,
                synonyms: this.synonyms.map((synonym) => {
                    return synonym.toString();
                })
            }
        }

        public static fromJSONObject(jsonObj: { value: any, synonyms?: Array<any> }): LanguageModelTypeValueSynonyms {
            if (jsonObj.value !== undefined) {
                let value = new LanguageModelTypeValueSynonyms(jsonObj.value);
                
                if (jsonObj.synonyms !== undefined) {
                    value.synonyms = jsonObj.synonyms.map((synonym) => {
                        return synonym.toString();
                    })
                }

                return value;
            } else {
                throw("Provided JSON object doesn't match class definition for LanguageModelTypeValueSynonyms");
            }
        }
    }

    export class Dialog {
        // List of intents that have dialog rules associated with them, required
        public intents: Array<DialogIntent>;

        constructor(intents: Array<DialogIntent>) {
            this.intents = intents;
        }

        public toJSONObject(): { intents: Array<any> } {
            return {
                intents: this.intents.map((intent) => {
                    return intent.toJSONObject();
                })
            }
        }

        public static fromJSONObject(jsonObj: { intents: Array<any> }): Dialog {
            if (jsonObj.intents !== undefined) {
                return new Dialog(jsonObj.intents.map((intent) => {
                    return DialogIntent.fromJSONObject(intent);
                }))
            } else {
                throw("Provided JSON object doesn't match class definition for Dialog");
            }
        }
     }

    export class DialogIntent {
        // Name of the intent that has dialog rules, required
        public name: string;
        // List of slots in this intent that have dialog rules, optional
        public slots: Array<DialogIntentSlot>;
        // Describes whether confirmation of the intent is required, optional
        public confirmationRequired: boolean;
        // Collection of prompts for this intent, optional
        public prompts: DialogIntentPromptType;

        constructor(name: string, slots?: Array<DialogIntentSlot>, confirmationRequired?: boolean, prompts?: DialogIntentPromptType) {
            this.name = name;
            this.slots = (slots !== undefined)? slots : new Array<DialogIntentSlot>();
            this.confirmationRequired = (confirmationRequired !== undefined)? confirmationRequired : false;
            this.prompts = (prompts !== undefined)? prompts: new DialogIntentPromptType();
        }

        public toJSONObject(): { name: any, slots?: Array<any>, confirmationRequired?: any, prompts?: any } {
            return {
                name: this.name,
                slots: this.slots.map((slot) => {
                    return slot.toJSONObject();
                }),
                confirmationRequired: this.confirmationRequired,
                prompts: this.prompts.toJSONObject()
                
            }
        }

        public static fromJSONObject(jsonObj: { name: any, slots?: Array<any>, confirmationRequired?: any, prompts?: any }): DialogIntent {
            if (jsonObj.name !== undefined) {
                let intent = new DialogIntent(jsonObj.name);

                if (jsonObj.slots !== undefined) {
                    intent.slots = jsonObj.slots.map((slot) => {
                        return DialogIntentSlot.fromJSONObject(slot);
                    })
                }

                if (jsonObj.confirmationRequired !== undefined) {
                    intent.confirmationRequired = jsonObj.confirmationRequired;
                }

                if (jsonObj.prompts !== undefined) {
                    intent.prompts = DialogIntentPromptType.fromJSONObject(jsonObj.prompts);
                }

                return intent;
            } else {
                throw("Provided JSON object doesn't match class definition for DialogIntent");
            }
        }
    }

    export class DialogIntentPromptType {
        // Enum value in the dialog_intents map to reference the confirmation prompt id, optional
        public confirmation: string;

        constructor(confirmation?: string) {
            this.confirmation = (this.confirmation !== undefined)? confirmation: "";
        }

        public toJSONObject(): { confirmation?: any} {
            return {
                confirmation: this.confirmation
            }
        }

        public static fromJSONObject(jsonObj: { confirmation?: any}): DialogIntentPromptType {
            return new DialogIntentPromptType(jsonObj.confirmation);

            // no exceptions as empty object is allowed
        }
    }

    export class DialogIntentSlot {
        // Name of the slot in the dialog intent, required
        public name: string;
        // Type of the slot in the dialog intent, required
        public type: string;
        // Describes whether elicitation of the slot is required, optional
        public elicitationRequired: boolean;
        // Describes whether confirmation of the slot is required, optional
        public confirmationRequired: boolean;
        // Collection of prompts for this slot, optional
        public prompts: DialogIntentSlotPromptType;

        constructor(name: string, type: string, elicitationRequired?: boolean, confirmationRequired?: boolean, prompts?: DialogIntentSlotPromptType) {
            this.name = name;
            this.type = type;
            this.elicitationRequired = (elicitationRequired !== undefined)? elicitationRequired: false;
            this.confirmationRequired = (confirmationRequired !== undefined)? confirmationRequired: false;
            this.prompts = (prompts !== undefined)? prompts: new DialogIntentSlotPromptType();
        }

        public toJSONObject(): { name: any, type: any, elicitationRequired?: any, confirmationRequired?: any, prompts?: any } {
            return {
                name: this.name,
                type: this.type,
                elicitationRequired: this.elicitationRequired,
                confirmationRequired: this.confirmationRequired,
                prompts: this.prompts.toJSONObject()
            }
        }

        public static fromJSONObject(jsonObj: { name: any, type: any, elicitationRequired?: any, confirmationRequired?: any, prompts?: any }): DialogIntentSlot {
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
            } else {
                throw("Provided JSON object doesn't match class definition for DialogIntentSlot");
            }
        } 
    }

    export class DialogIntentSlotPromptType {
        // Enum value in the dialog_slots map to reference the elicitation prompt id, optional
        public elicitation: string;
        // Enum value in the dialog_slots map to reference the confirmation prompt id, optional
        public confirmation: string;

        constructor(elicitation?: string, confirmation?: string) {
            this.elicitation = (elicitation !== undefined)? elicitation: "";
            this.confirmation = (confirmation !== undefined)? confirmation: "";
        }

        public toJSONObject(): { elicitation?: any, confirmation?: any } {
            return {
                elicitation: this.elicitation,
                confirmation: this.confirmation
            }
        } 

        public static fromJSONObject(jsonObj: { elicitation?: any, confirmation?: any }): DialogIntentSlotPromptType {
            return new DialogIntentSlotPromptType(jsonObj.elicitation, jsonObj.confirmation);

            // no exceptions as empty object is allowed
        }
    }

    export class Prompt {
        // Identifier of the prompt, required
        public id: string;
        // List of variations of the prompt, required
        public variations: Array<PromptVariation>;

        constructor(id: string, variations: Array<PromptVariation>) {
            this.id = id;
            this.variations = variations;
        }

        public toJSONObject(): { id: any, variations: Array<any> } {
            return {
                id: this.id,
                variations: this.variations.map((variation) => {
                    return variation.toJSONObject();
                })
            }
        }

        public static fromJSONObject(jsonObj: { id: any, variations: Array<any> }): Prompt {
            if (jsonObj.id !== undefined && jsonObj.variations !== undefined) {
                return new Prompt(
                    jsonObj.id, 
                    jsonObj.variations.map((variation) => {
                        return PromptVariation.fromJSONObject(variation);
                    }));                    
            } else {
                throw("Provided JSON object doesn't match class definition for Prompt");
            }
        }
    }

    export class PromptVariation {
        // One of: "PlainText" or "SSML", required
        public type: PromptVariationType;
        // Text that Alexa says as a prompt, required
        public value: string;

        constructor(type:PromptVariationType, value: string) {
            this.type = type;
            this.value = value;    
        }

        public toJSONObject(): { type: any, value: any }{
            return {
                type: this.type,
                value: this.value
            };
        }

        public static fromJSONObject(jsonObj: { type: any, value: any }): PromptVariation {
            if (jsonObj.type !== undefined && jsonObj.value !== undefined) {
                return new PromptVariation(jsonObj.type, jsonObj.value);
            }
            else {
                throw("Provided JSON object doesn't match class definition for PromptVariation");
            }
        }
    }

    export enum PromptVariationType {
        PlainText = "PlainText",
        SSML = "SSML"
    }

    export class AlexaModel {
        public interactionModel: InteractionModel;

        constructor(interactionModel: InteractionModel) {
            this.interactionModel = interactionModel;
        }

        public toJSONObject(): { interactionModel: any }{
            return {
                interactionModel: this.interactionModel.toJSONObject()
            };
        }

        public static fromJSONObject(jsonObj: { interactionModel: any }): AlexaModel {
            if (jsonObj.interactionModel !== undefined) {
                return new AlexaModel(InteractionModel.fromJSONObject(jsonObj.interactionModel));
            }
            else {
                throw("Provided JSON object doesn't match class definition for AlexaModel");
            }
        }

        public serialize(): string {
            return JSON.stringify(this.toJSONObject());
        }

        public static deserialize(json: string): AlexaModel {
            let o = JSON.parse(json);
            return AlexaModel.fromJSONObject(o);
        }
    }    
}
