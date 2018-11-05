# Language Understanding Model Converter

version 0.1

* Convert an Alexa Interaction model to a LUIS model

## Usage

* Run samples/index.html from a hosted environment as a static website.
* Open exported Alexa model as a json file.
* Press "Convert" button.
* Save generated LUIS model as a json file.
* Edit version of required.

## Know issues

* Not all built-in Alexa entities and intents are covered (= not mapped into built-in LUIS intents or entities). See the maps in [Alexa2Luis.ts](https://github.com/kichinsky/LUMC/blob/master/src/converters/Alexa2Luis.ts) - builtInAlexaIntents and buildInTypesMap.
* Choosing between ClosedList and Hierarchical entities is an open question (when converting typed entities).
* Samples with more than one occurrence of the same slot are ignore as not supported for LUIS. E.g. "What is the difference between {term} and {term}".
* Samples (e.g. patterns) with different number of ending space charecters are threated by LUIS as equal (manual edits required so far). E.g. "What is {term}" and "what is {term} ".
* On import edits for version number in LUIS model might be required.
