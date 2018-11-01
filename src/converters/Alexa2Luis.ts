import { LUMC as Microsoft } from "./../models/Microsoft.LUIS";
import { LUMC as Amazon } from "./../models/Amazon.Alexa";

export module LUMC.Converters {

    export class Alexa2LUIS {
        private alexa: Amazon.Models.AlexaModel;
        private luis: Microsoft.Models.LUISModel;
         
    }
}