'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * PersonTransformer class
 *
 * @class PersonTransformer
 * @constructor
 */
class PersonTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    if(!model.phones) {
      return {
        id: model.id_person,
        name: model.name,
        nickname: model.nickname,
        email: model.email
      }
    }
    
    /**
     * String treatment to become json
     **/
    let str = model.phones
    let res = str.split(",")
    let phones = []
    for(let i = 0; i < res.length; i++) {
      if (i % 3 === 0) {
        var id = '"id_phone":' + res[i]
      } else if ((i-1) % 3 === 0) {
        var number = '"number":' + res[i]
      } else {
        let type = '"type":"' + res[i] + '"'
        let row = '{'+id+', '+number+', '+type+'}'
        let obj = JSON.parse(row)
        phones.push(obj)
      }
    }
    return {
      id: model.id_person,
      name: model.name,
      nickname: model.nickname,
      email: model.email,
      phones: phones
    }

  }
}

module.exports = PersonTransformer
