'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PhoneSchema extends Schema {
  up () {
    this.create('phones', (table) => {
      table.increments()
      table.integer('id_user').unsigned()
      table.integer('id_person').unsigned()
      table.integer('number', 11).notNullable()
      table.enu('type', ['comercial', 'personal']).notNullable()
      table.timestamps()

      table.foreign('id_user').references('id').inTable('users').onDelete('cascade')
      table.foreign('id_person').references('id').inTable('people').onDelete('cascade')
    })
  }

  down () {
    this.drop('phones')
  }
}

module.exports = PhoneSchema
