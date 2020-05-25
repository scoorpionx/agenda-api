'use strict'

const Database = use('Database')
const Phone = use('App/Models/Phone')
const Transformer = use('App/Transformers/Admin/PhoneTransformer')

class PhoneController {
    /**
   * Show a list of all phones.
   * GET phones
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, pagination, transform, auth }) {
    const query = Phone.query()
    
    var uid = await auth.getUser()
    uid = uid.$attributes.id

    query.leftJoin('people', 'phones.person_id', 'people.id_person').where('people.user_id', uid)

    const people = await query.paginate(pagination.page, pagination.limit)
    const transformedPeople = await transform.paginate(people, Transformer)
     
    return response.send(transformedPeople)    
  }

  /**
   * Create/save a new phone.
   * POST phone
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response, auth, transform }) {
    const trx = await Database.beginTransaction()
    try {
      const { person_id, number, type } = request.all()

      const phone = await Phone.create({
        person_id,
        number,
        type
      }, trx)
      await trx.commit()
      const transformedPhone = await transform.item(phone, Transformer)
      return response.status(201).send(transformedPhone)
    } catch(err) {
      await trx.rollback()
      return response.status(400).send({
        message: 'Não foi possível criar este número no momento!',
        error: err
      })
    }
  }

  /**
   * Display a single phone.
   * GET phones/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params: { id }, request, response, transform, auth }) {
    var uid = await auth.getUser()
    uid = uid.$attributes.id

    const query = await Phone
      .query()
      .leftJoin('people', 'phones.person_id', 'people.id_person')
      .where({
        'phones.id_phone': id,
        'people.user_id': uid
      })
      .fetch()
    
    return response.send(query)
  }

  /**
   * Update phone details.
   * PUT or PATCH phone/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params: { id }, request, response, transform, auth }) {
    var uid = await auth.getUser()
    uid = uid.$attributes.id
    try {
      const { number, type } = request.all()
      await Phone
        .query()
        .select()
        .where('id_phone', id)
        .update({ number, type })
  
      const phone = await Phone
        .query()
        .where('id_phone', id)
        .fetch()

      const transformedPhone = await transform.collection(phone, Transformer)
      return response.send(transformedPhone)
    } catch(err) {
      return response.status(400).send({
        message: 'Não foi possível atualizar esse contato no momento!',
        error: err.message
      })
    }
  }

  /**
   * Delete a phone with id.
   * DELETE phone/:id
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

module.exports = PhoneController
