'use strict'

const Database = use('Database')
const Person = use('App/Models/Person')
const Phone = use('App/Models/Phone')
const Transformer = use('App/Transformers/Admin/PersonTransformer')

class PersonController {
    /**
   * Show a list of all people.
   * GET people
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, pagination, transform, auth }) {
    try {
      var uid = await auth.getUser()
      uid = uid.$attributes.id
      const query = Person.query()

      query
        .select([
          'people.*',
          Database.raw('GROUP_CONCAT (`phones`.`id_phone`, ",", `phones`.`number`, ",", `phones`.`type`) AS phones')
        ])
        .where('user_id', uid)
        .leftJoin('phones', 'people.id_person', 'phones.person_id')
        .groupBy('people.id_person')
       
      const people = await query.paginate(pagination.page, pagination.limit)
      const transformedPeople = await transform.paginate(people, Transformer)
      return response.send(transformedPeople)  
      
    } catch (error) {
      return response.status(400).send(error.message)
    }
  }

  /**
   * Create/save a new person.
   * POST people
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth, transform }) {
    const trx = await Database.beginTransaction()
    try {
      const { name, nickname, email } = request.all()
      var user_id = await auth.getUser()
      user_id = user_id.$attributes.id
      const person = await Person.create({
        user_id,
        name,
        nickname,
        email
      }, trx)

      await trx.commit()
      const transformedPerson = await transform.collection(person, Transformer)
      return response.status(201).send(transformedPerson)
    } catch(err) {
      await trx.rollback()
      return response.status(400).send({
        message: 'Não foi possível criar esse contato no momento!'
      })
    }
  }

  /**
   * Display a single person.
   * GET people/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params: { id }, auth, response, transform, pagination }) {
    try {
      var uid = await auth.getUser()
      uid = uid.$attributes.id
      const query = Person
        .query()
        .select([
          'people.*',
          Database.raw('GROUP_CONCAT (`phones`.`id_phone`, ",", `phones`.`number`, ",", `phones`.`type`) AS phones')
        ])
        .where({
          'user_id': uid,
          'id_person': id
        })
        .leftJoin('phones', 'people.id_person', 'phones.person_id')
        .groupBy('people.id_person')
        .fetch()
      
      const transformedPerson = await transform.collection(query, Transformer)
          
      return response.send(transformedPerson)
    } catch (error) {
      return response.status(400).send(error)
    }
  }

  /**
   * Update person details.
   * PUT or PATCH people/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params: { id }, request, response, transform, auth }) {
    var uid = await auth.getUser()
    uid = uid.$attributes.id
    
    try {
      const { name, nickname, email } = request.all()
      
      await Person
        .query()
        .where({
          'user_id': uid,
          'id_person': id
        })
        .update({ name, nickname, email })
      
      const person = await Person
        .query()
        .select([
          'people.*',
          Database.raw('GROUP_CONCAT (`phones`.`id_phone`, ",", `phones`.`number`, ",", `phones`.`type`) AS phones')
        ])
        .where({
          'user_id': uid,
          'id_person': id
        })
        .leftJoin('phones', 'people.id_person', 'phones.person_id')
        .groupBy('people.id_person')
        .fetch()
    
      console.log(person)
      const transformedPerson = await transform.collection(person, Transformer)
      return response.send(transformedPerson)
    } catch(err) {
      return response.status(400).send({
        message: 'Não foi possível atualizar esse contato no momento!'
      })
    }
  }

  /**
   * Delete a person with id.
   * DELETE people/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params: { id }, auth, response }) {
    var uid = await auth.getUser()
    uid = uid.$attributes.id
    const person = Person.query()
      await person
        .select()
        .where({
          'user_id': uid,
          'id_person': id
        })
        .fetch()
    try {
      await person.delete()
      return response.status(204).send()
    } catch (err) {
      return response.status(500).send({
        message: 'Não foi possível deletar este produto no momento!'
      })
    }
  }
}

module.exports = PersonController
