import {Microsoft} from "./../models/Microsoft.LUIS";
import {Amazon} from "./../models/Amazon.Alexa";

export namespace LUMC.Converters {

    export class Alexa2LUIS {
        private alexa: Amazon.AlexaModel;
        private luis: Microsoft.LUISModel;
         
    }
}