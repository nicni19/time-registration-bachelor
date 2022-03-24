export interface IDatabaseHandler{
    sayHello():String;

    getPreferences(id:String):{};

    getLogElements(queryArguments:String[]);
}
