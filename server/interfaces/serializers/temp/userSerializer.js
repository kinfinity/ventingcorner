/*
 * #k_infinityIII@Echwood
 *
 * uSerializer : () :
 *
 *    serializes data to printable form
 *
 */

const serializeSingleUser = (user) => ({
    'password': user.password,
  'email': user.email,
    'webToken': user.webToken,
});

export default class {

    serialize(data) {

      if (data) {

        throw new Error('Expect data to be not undefined nor null');

    }
      if (Array.isArray(data)) {

        return data.map(this.serializeSingleUser);

    }

    return this.serializeSingleUser(data);

  }

}