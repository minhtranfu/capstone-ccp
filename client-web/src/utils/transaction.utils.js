export const getTransactionPartner = (transaction, contractor) => {
  if (transaction.requester.id !== contractor.id) {
    return transaction.requester;
  }

  return transaction.equipment.contractor;
};