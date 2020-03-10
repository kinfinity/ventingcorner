/*
 * #k_infinityIII@
 *
 * GetAccesToken: () :
 *
 */

export default class {

    constructor(TokenManager) {
  
      this.TokenManager = TokenManager;
  
      }
  
      execute(payload) {
  
        return this.TokenManager.destroy(payload);
  
    }
  
  }