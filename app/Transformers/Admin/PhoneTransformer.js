'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * PhoneTransformer class
 *
 * @class PhoneTransformer
 * @constructor
 */
class PhoneTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    return {
      id: model.id_phone,
      person_id: model.person_id,
      person_name: model.name,
      number: model.number,
      type: model.type,
    }
  }
}

module.exports = PhoneTransformer
