'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Phone extends Model {
    user() {
        return this.belongsTo('App/Models/Image')
    }

    phone() {
        return this.belongsTo('App/Models/Person')
    }
}

module.exports = Phone
