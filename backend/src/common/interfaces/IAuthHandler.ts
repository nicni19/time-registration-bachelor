import { Actions } from "../domain/Actions";

export interface IAuthHandler{

    /**
     * Used to authenticate a user based on a user ID and an access token. Confirms that the access token corresponds with the user.
     * 
     * @param userID - The user's ID (Microsoft user ID)
     * @param authToken - The access token associated with the user
     * @returns - A boolean signifying if the user ID and token is a match
     */
    authenticate(userID:string,authToken?:string):Promise<boolean>;

    /**
     * Authorizes wether or not a user is allowed to perform a certain action
     * @param userID - The user's ID
     * @param action - The action the user wants to perform
     */
    authorize(userID:string,action:Actions): Promise<boolean>;
}