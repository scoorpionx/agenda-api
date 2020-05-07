'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PhoneSchema extends Schema {
  up () {
    this.create('phones', (table) => {
      table.increments('id_phone')
      table.integer('person_id').unsigned()
      table.string('number', 11).notNullable()
      table.enu('type', ['comercial', 'pessoal']).notNullable()
      table.timestamps()

      table.foreign('person_id').references('id_person').inTable('people').onDelete('cascade')
    })
  }

  down () {
    this.drop('phones')
  }
}

module.exports = PhoneSchema
