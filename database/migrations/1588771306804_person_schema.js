'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PersonSchema extends Schema {
  up () {
    this.create('people', (table) => {
      table.increments('id_person')
      table.integer('user_id').unsigned()
      table.string('name', 255).notNullable()
      table.string('nickname', 255)
      table.string('email', 254)
      table.timestamps()

      table.foreign('user_id').references('id').inTable('users').onDelete('cascade')
    })
  }

  down () {
    this.drop('people')
  }
}

module.exports = PersonSchema
