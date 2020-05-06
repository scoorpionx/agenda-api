'use strict'

const Database = use('Database')
const Person = use('App/Models/Person')
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
    const query = Person.query()
    
    var uid = await auth.getUser()
    uid = uid.$attributes.id

    query
      .innerJoin('phones', 'people.id', 'phones.person_id')
      .where('people.user_id', uid)
 
    const people = await query.paginate(pagination.page, pagination.limit)
    const transformedPeople = await transform.paginate(people, Transformer)
     
    return response.send(transformedPeople)    
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
      const transformedPerson = await transform.item(person, Transformer)
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
  async show ({ params: { id }, request, response, transform }) {
    const person = await Person.findOrFail(id)
    const transformedPerson = await transform.item(person, Transformer)    
    return response.send(transformedPerson)
  }

  /**
   * Update person details.
   * PUT or PATCH people/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params: { id }, request, response, transform }) {
    const person = await Person.findOrFail(id)
    try {
      const { name, nickname, email } = request.all()
      product.merge({ name, nickname, email })
      await product.save()

      const transformedPerson = await transform.item(person, Transformer)
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
  async destroy ({ params: { id }, request, response }) {
    const person = await Person.findOrFail(id)
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
