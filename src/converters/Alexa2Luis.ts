import { LUMC as Microsoft } from "./../models/Microsoft.LUIS";
import { LUMC as Amazon } from "./../models/Amazon.Alexa";

export module LUMC.Converters {

    export class Alexa2LUISConverter {
        private alexa: Amazon.Models.Alexa.AlexaModel;
        private luis: Microsoft.Models.LUIS.LUISModel;
         
        constructor(alexaModel: Amazon.Models.Alexa.AlexaModel) {
            this.alexa = alexaModel;
        }

        public convert(): Microsoft.Models.LUIS.LUISModel {
            return this.luis;
        }
    }
}