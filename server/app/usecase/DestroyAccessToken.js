/*
 * #k_infinityIII@Echwood
 *
 * GetAccesToken: () :
 *
 */

export default class {

    constructor(accessTokenManager) {
  
      this.accessTokenManager = accessTokenManager;
  
      }
  
      execute(payload) {
  
        return this.accessTokenManager.destroy(payload);
  
    }
  
  }