import { ContactsCollection } from '../db/models/contact.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { SORT_ORDER } from '../constants/contacts.js';

export const getAllContacts = async ({
  page = 1,
  perPage = 10,
  sortOrder = SORT_ORDER.ASC,
  sortBy = '_id',
  filter = {},
}) => {
  const query = ContactsCollection.find(filter);

  const contactsCount = await ContactsCollection.countDocuments(filter);

  const skip = (page - 1) * perPage;
  const limit = perPage;

  const contacts = await query
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();

  const paginationData = calculatePaginationData(contactsCount, perPage, page);

  return {
    data: contacts,
    ...paginationData,
  };
};

export const getContactById = async (contactId, userId) => {
  const contact = await ContactsCollection.findOne({
    _id: contactId,
    userId,
  });
  return contact;
};

export const createContact = async (payload) => {
  const contact = await ContactsCollection.create(payload);
  return contact;
};

export const deleteContact = async (contactId, userId) => {
  const contact = await ContactsCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return contact;
};

export const updateContact = async (contactId, payload, userId) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    {
      _id: contactId,
      userId,
    },
    payload,
    {
      new: true,
      upsert: true,
    },
  );

  if (!rawResult) return null;

  return {
    contact: rawResult,
    isNew: rawResult.upserted ? true : false,
  };
};
export const patchContact = async (contactId, payload, userId) => {
  const rawResult = await ContactsCollection.findOneAndUpdate(
    {
      _id: contactId,
      userId,
    },
    { $set: payload },
    {
      new: true,
      upsert: false,
    },
  );

  return rawResult;
};
