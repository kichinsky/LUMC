/* Microsoft LUIS model
** Based on the schema available at https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5892283039e2bb0d9c2805f5 
*/

export namespace LUMC.Models {

    class Intent {
        // required
        public name: string;
        // optional
        public inherits: IntentInherit;
    }

    class IntentInherit {
        // required
        public domain_name: string;
        // required
        public model_name: string;
    }

    class Entity {
        // required
        public name: string;
        // optional
        public children: Array<string>;
        // optional
        public roles: Array<string>;
    }
    
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
        // required
        public name: string;
        // required
        public sublists: Array<ClosedListSublist>;
    }

    class ClosedListSublist {
        // required
        public canonicalForm: string;
        // optional
        public list: Array<string>;
        // optional
        public roles: Array<string>;
    }

    class Composite {
        // required
        public name: string;
        // required
        public children: Array<string>;
        // optional
        public roles: Array<string>;
    }

    class PatternAnyEntity {
        // required
        public name: string;
        // optional
        public explicitList: Array<string>;
        // optional
        public roles: Array<string>;
    }

    class RegExEntity {
        // required
        public name: string;
        // required
        public regexPattern: string;
        // optional
        public roles: Array<string>;
    }

    class PrebuiltEntity {
        // required
        public name: string;
        // optional
        public roles: Array<string>;
    }

    class RegExFeature {
        // required
        public name: string;
        // required
        public pattern: string;
        // optional
        public activated: boolean;
        // optional
        public roles: Array<string>;
    }

    class ModelFeature {
        // required
        public name: string;
        // required, default true
        public mode: boolean;
        // required               
        public words: string;
        // optional, default true
        public activated: boolean; 
    }

    class Pattern {
        // required
        public pattern: string;
        // required
        public intent: string;
    }

    class Utterance {
        // required
        public text: string;
        // required
        public intent: string;
        // optional
        public entities: Array<UtteranceEntity>;
    }

    class UtteranceEntity {
        // required
        public startPos: number;
        // required
        public endPos: number;
        // required
        public entity: string;
    }

    export class LUISModel {
        public static DefaultSchemaVersion: string = "3.1.0";
        public static DefaultCulture: string = "en-us";
        // required
        public luis_schema_version: string = LUISModel.DefaultSchemaVersion;
        // required
        public name: string;
        // required
        public versionId: string;
        // optional
        public desc: string;
        // required
        public culture: string = LUISModel.DefaultCulture;

        public intents: Array<Intent>;
        public entities: Array<Entity>;
        /*
        public bing_entities: Array<BingEntity>;
        public actions: Array<Action>;
        */
        public closedLists: Array<ClosedList>;
        public composites: Array<Composite>;
        public patternAnyEntities: Array<PatternAnyEntity>;
        public regex_entities: Array<RegExEntity>;
        public prebuiltEntities: Array<PrebuiltEntity>;
        public regex_features: Array<RegExFeature>;
        public model_features: Array<ModelFeature>;
        public utterances: Array<Utterance>;
        public patterns: Array<Pattern>;
    }    

}
