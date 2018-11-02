import { stringify } from "querystring";

/* Microsoft LUIS model
** Based on the schema available at https://westus.dev.cognitive.microsoft.com/docs/services/5890b47c39e2bb17b84a55ff/operations/5892283039e2bb0d9c2805f5 
*/

export namespace LUMC.LUIS {
    interface INamed {
        name: string;        
    }

    interface INamedRolesBased extends INamed {
        roles: string[];
        addRole(newRole: string): void;
    }

    /* Helper functions */
    function addToCollection<T>(collection: Array<T>, newItem:T, equal: (itemA:T, itemB: T) => boolean, merger?: (base:T, merged: T) => T): Array<T> {
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
        } else {
            collection = new Array<T>(newItem);
        }
        return collection;
    }

    function addToNamedCollection<T extends INamed>(collection: Array<T>, newItem:T, merger?: (base:T, merged: T) => T): Array<T> {
        return addToCollection<T>(collection, newItem, (itemA:T, itemB:T) => {
            return itemA.name.toLocaleLowerCase() == itemB.name.toLocaleLowerCase();
        }, merger);
    }

    function addToNamedRolesBasedCollection<T extends INamedRolesBased>(collection: Array<T>, newItem:T): Array<T> {
        return addToCollection<T>(collection, newItem, (itemA:T, itemB:T) => {
            return itemA.name.toLocaleLowerCase() == itemB.name.toLocaleLowerCase();
        }, (baseItem, mergedItem) => {
            mergedItem.roles.forEach((role) => {
                baseItem.addRole(role);
            });
            return baseItem;  
        });
    }

    function addToStringCollection(collection: Array<string>, newItem: string, caseSensetive: boolean = false) {
        return addToCollection<string>(collection, newItem, (itemA:string, itemB:string) => {
            if (caseSensetive) {
                return itemA == itemB;
            } else {
                return itemA.toLocaleLowerCase() == itemB.toLocaleLowerCase();
            }            
        }, null);
    }

    /* LUIS Model Classes */
    export class Intent implements INamed {
        // required
        public name: string;
        // optional
        public inherits: Inherit;

        constructor(name: string, inherit?: Inherit) {
            this.name = name;
            this.inherits = (inherit !== undefined) ? inherit: null;
        }

        public setInherits(inherit: Inherit) {
            this.inherits = inherit;
        }
    }

    export class Inherit {
        // required
        public domain_name: string;
        // required
        public model_name: string;

        constructor(domainName: string, modelName: string) {
            this.domain_name = domainName;
            this.model_name = modelName;
        }
    }

    export class Entity implements INamedRolesBased {
        // required
        public name: string;
        // optional
        public children: Array<string>;
        // optional
        public roles: Array<string>;
        // optional
        public inherits: Inherit;

        constructor(name: string, children?: Array<string>, roles?: Array<string>, inherit?: Inherit) {
            this.name = name;
            this.children = (children !== undefined) ? children : new Array<string>();
            this.roles = (roles !== undefined) ? roles : new Array<string>();
            this.inherits = (inherit !== undefined) ? inherit: null;
        }

        public addChild(newChildEntity: string) {
            this.children = addToStringCollection(this.children, newChildEntity);
        }

        public addRole(newRole: string) {
            this.roles = addToStringCollection(this.roles, newRole);
        }

        public setInherits(inherit: Inherit) {
            this.inherits = inherit;
        }
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

    export class ClosedList implements INamedRolesBased {
        // required
        public name: string;
        // required
        public sublists: Array<ClosedListSublist>;
        // optional
        public roles: Array<string>;
        
        constructor(name: string, sublists: Array<ClosedListSublist>, roles?: Array<string>) {
            this.name = name;
            this.sublists = sublists;
            this.roles = (roles !== undefined) ? roles : new Array<string>();
        }

        public addSublist(newSubList: ClosedListSublist, merge: boolean = false) {
            this.sublists = addToCollection<ClosedListSublist>(this.sublists, newSubList, 
                (itemA:ClosedListSublist, itemB:ClosedListSublist) => {
                    return itemA.canonicalForm.toLocaleLowerCase() == itemB.canonicalForm.toLocaleLowerCase();
                }, 
                (baseItem, mergedItem) => {
                    return baseItem.mergeSublist(mergedItem);
                }
            );
        }

        public addRole(newRole: string) {
            this.roles = addToStringCollection(this.roles, newRole);
        }
    }

    export class ClosedListSublist {
        // required
        public canonicalForm: string;
        // optional
        public list: Array<string>;
        // optional
        public roles: Array<string>;

        constructor(canonicalForm: string, list?: Array<string>, roles?: Array<string>) {
            this.canonicalForm = canonicalForm;
            this.list = (list !== undefined) ? list : new Array<string>();
            this.roles = (roles !== undefined) ? roles : new Array<string>();
        }

        public addListItem(newItem: string) {
            this.list = addToStringCollection(this.list, newItem);
        }

        public addRole(newRole: string) {
            this.roles = addToStringCollection(this.roles, newRole);
        }        

        public mergeSublist(sublist: ClosedListSublist): ClosedListSublist {
            sublist.list.forEach((item) => {
                this.addListItem(item);
            })
            sublist.roles.forEach((role) => {
                this.addRole(role);
            })
            return this;
        }
    }

    export class Composite implements INamedRolesBased {
        // required
        public name: string;
        // required
        public children: Array<string>;
        // optional
        public roles: Array<string>;

        constructor(name: string, children?: Array<string>, roles?: Array<string>) {
            this.name = name;
            this.children = (children !== undefined) ? children : new Array<string>();
            this.roles = (roles !== undefined) ? roles : new Array<string>();
        }

        public addChild(newChildEntity: string) {
            this.children = addToStringCollection(this.children, newChildEntity);        
        }

        public addRole(newRole: string) {
            this.roles = addToStringCollection(this.roles, newRole);
        }
    }

    export class PatternAnyEntity implements INamedRolesBased {
        // required
        public name: string;
        // optional
        public explicitList: Array<string>;
        // optional
        public roles: Array<string>;

        constructor(name: string, explicitList?: Array<string>, roles?: Array<string>) {
            this.name = name;
            this.explicitList = (explicitList !== undefined) ? explicitList : new Array<string>();
            this.roles = (roles !== undefined) ? roles : new Array<string>();
        }

        public addExplicitListItem(newListItem: string) {
            this.explicitList = addToStringCollection(this.explicitList, newListItem);  
        }

        public addRole(newRole: string) {
            this.roles = addToStringCollection(this.roles, newRole);
        }
    }

    export class RegExEntity implements INamedRolesBased {
        // required
        public name: string;
        // required
        public regexPattern: string;
        // optional
        public roles: Array<string>;

        constructor(name: string, regexPattern: string, roles?: Array<string>) {
            this.name = name;
            this.regexPattern = regexPattern;
            this.roles = (roles !== undefined) ? roles : new Array<string>();
        }

        public addRole(newRole: string) {
            this.roles = addToStringCollection(this.roles, newRole);
        }
    }

    export class PrebuiltEntity implements INamedRolesBased {
        // required
        public name: string;
        // optional
        public roles: Array<string>;

        constructor(name: string, roles?: Array<string>) {
            this.name = name;
            this.roles = (roles !== undefined) ? roles : new Array<string>();
        }

        public addRole(newRole: string) {
            this.roles = addToStringCollection(this.roles, newRole);
        }
    }

    export class RegExFeature implements INamedRolesBased {
        // required
        public name: string;
        // required
        public pattern: string;
        // optional, default = true;
        public activated: boolean;
        // optional
        public roles: Array<string>;

        constructor(name: string, pattern: string, activated: boolean = true, roles?: Array<string>) {
            this.name = name;
            this.pattern = pattern;
            this.activated = activated;
            this.roles = (roles !== undefined) ? roles : new Array<string>();
        }

        public addRole(newRole: string) {
            this.roles = addToStringCollection(this.roles, newRole);
        }
    }

    export class ModelFeature implements INamed {
        // required
        public name: string;
        // required, default true
        public mode: boolean;
        // required               
        public words: string;
        // optional, default true
        public activated: boolean; 

        constructor(name: string, words: string, mode:boolean = true, activated: boolean = true) {
            this.name = name;
            this.words = words;
            this.mode = mode;
            this.activated = activated;            
        }
    }

    export class Pattern {
        // required
        public pattern: string;
        // required
        public intent: string;

        constructor(pattern: string, intent: string) {
            this.pattern = pattern;
            this.intent = intent;
        }
    }

    export class Utterance {
        // required
        public text: string;
        // required
        public intent: string;
        // optional
        public entities: Array<UtteranceEntity>;

        constructor(text: string, intent: string, entities?: Array<UtteranceEntity>) {
            this.text = text;
            this.intent = intent;
            this.entities = (entities !== undefined) ? entities : new Array<UtteranceEntity>();
        }

        addEntity(newEntity: UtteranceEntity) {
            if (this.entities !== null) {
                // no additional checks for duplicates?
                this.entities.push(newEntity);
            }
        }
    }

    export class UtteranceEntity {
        // required
        public startPos: number;
        // required
        public endPos: number;
        // required
        public entity: string;

        constructor(startPos: number, endPos: number, entity: string) {
            this.startPos = startPos;
            this.endPos = endPos;
            this.entity = entity;
        }
    }

    export class LUISModel {
        public static DefaultSchemaVersion: string = "3.1.0";
        public static DefaultCulture: string = "en-us";
        // required
        public luis_schema_version: string;
        // required
        public name: string;
        // required
        public versionId: string;
        // optional
        public desc: string;
        // required
        public culture: string;

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
        public patterns: Array<Pattern>;
        public utterances: Array<Utterance>;


        constructor(name: string, versionId: string, culture?: string, desc: string = "") {
            // basic properties
            this.name = name;
            this.versionId = versionId;
            this.culture = (culture !== undefined) ? culture: LUISModel.DefaultCulture;
            this.luis_schema_version = LUISModel.DefaultSchemaVersion;
            this.desc = desc;

            // model content
            this.intents = new Array<Intent>();
            this.entities = new Array<Entity>();
            this.closedLists = new Array<ClosedList>();
            this.composites = new Array<Composite>();
            this.patternAnyEntities = new Array<PatternAnyEntity>();
            this.regex_entities = new Array<RegExEntity>();
            this.prebuiltEntities = new Array<PrebuiltEntity>();
            this.regex_features = new Array<RegExFeature>();
            this.model_features = new Array<ModelFeature>();
            this.patterns = new Array<Pattern>(); 
            this.utterances = new Array<Utterance>();           
        }

        public addIntent(newIntent: Intent) {
            this.intents = addToNamedCollection<Intent>(this.intents, newIntent);
        }

        public addEntity(newEntity: Entity) {
            this.entities = addToNamedRolesBasedCollection<Entity>(this.entities, newEntity);
        }

        public addClosedList(newClosedList: ClosedList) {
            this.closedLists = addToNamedRolesBasedCollection<ClosedList>(this.closedLists, newClosedList);
        }

        public addComposite(newComposite: Composite) {
            this.composites = addToNamedRolesBasedCollection<Composite>(this.composites, newComposite);
        }

        public addPatternAnyEntity(newPatternAnyEntity: PatternAnyEntity) {
            this.patternAnyEntities = addToNamedRolesBasedCollection<PatternAnyEntity>(this.patternAnyEntities, newPatternAnyEntity);
        }

        public addRegExEntity(newRegExEntity: RegExEntity) {
            this.regex_entities = addToNamedRolesBasedCollection<RegExEntity>(this.regex_entities, newRegExEntity);
        }

        public addPrebuiltEntity(newPrebuiltEntity: PrebuiltEntity) {
            this.prebuiltEntities = addToNamedRolesBasedCollection<PrebuiltEntity>(this.prebuiltEntities, newPrebuiltEntity);
        }

        public addRegExFeature(newRegExFeature: RegExFeature) {
            this.regex_features = addToNamedRolesBasedCollection<RegExFeature>(this.regex_features, newRegExFeature);
        }

        public addModelFeature(newModelFeature: ModelFeature) {
            this.model_features = addToNamedCollection<ModelFeature>(this.model_features, newModelFeature);
        }

        public addPattern(newPattern: Pattern) {
            this.patterns = addToCollection<Pattern>(this.patterns, newPattern, 
                (itemA:Pattern, itemB:Pattern) => {
                    return itemA.pattern.toLocaleLowerCase() == itemB.pattern.toLocaleLowerCase();
                }, 
                null
            );
        }

        public addUtterance(newUtterance: Utterance) {
            this.utterances = addToCollection<Utterance>(this.utterances, newUtterance, 
                (itemA:Utterance, itemB:Utterance) => {
                    return itemA.text.toLocaleLowerCase() == itemB.text.toLocaleLowerCase();
                }, 
                null
            );
        }

        public serialize(): string {
            return JSON.stringify(this);
        }


    }    

}
