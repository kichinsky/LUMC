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
* Not all built-in Alexa entities and intents are covered (= not mapped into built-in LUIS intents or entities).
* Choosing between ClosedList and Hierarchical entities is an open question (when converting typed entities).
* Samples with more than one occurrence of the same slot are ignore as not supported for LUIS.
* Samples (e.g. patterns) with different number of ending space charecters are threated by LUIS as equal (manual edits required so far).
* On import edits for version number in LUIS model might be required.
