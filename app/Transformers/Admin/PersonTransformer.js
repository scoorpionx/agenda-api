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
    return {
      id: model.id_person,
      name: model.name,
      nickname: model.nickname,
      email: model.email,
      phones: {
        number: model.number,
        type: model.type,
      }
    }
  }
}

module.exports = PersonTransformer
