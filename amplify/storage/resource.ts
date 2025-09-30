import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'vehicleDocuments',
  access: (allow) => ({
    'public/vehicle-documents/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read'])
    ],
    'vehicle-documents/*': [
      allow.authenticated.to(['read', 'write', 'delete']),
      allow.guest.to(['read'])
    ],
  })
});