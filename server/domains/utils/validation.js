/*
 * Created by k_infinity3 <ksupro1@gmail.com>
 *
 * email validation 
 * 
 */
export default {
    validateEmail(email) {

    const re = '/^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$/';

    return email.match(re);

  },

};