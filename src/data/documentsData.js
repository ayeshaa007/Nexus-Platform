export const chamberDocuments = [
  {
    id: 'doc1',
    name: 'TechWave AI – Term Sheet v2.pdf',
    type: 'PDF',
    size: '1.2 MB',
    status: 'in_review',
    uploadedBy: 'i1',
    uploaderName: 'Michael Rodriguez',
    uploadedAt: '2026-05-20T10:00:00Z',
    dealId: 'deal1',
    signatures: [
      { userId: 'i1', name: 'Michael Rodriguez', signedAt: '2026-05-20T11:00:00Z' },
    ],
    requiredSignatures: ['i1', 'e1'],
    previewUrl: null,
  },
  {
    id: 'doc2',
    name: 'GreenLife – Investment Agreement.pdf',
    type: 'PDF',
    size: '2.8 MB',
    status: 'signed',
    uploadedBy: 'i2',
    uploaderName: 'Jennifer Lee',
    uploadedAt: '2026-05-15T09:00:00Z',
    dealId: 'deal2',
    signatures: [
      { userId: 'i2', name: 'Jennifer Lee', signedAt: '2026-05-15T10:00:00Z' },
      { userId: 'e2', name: 'David Chen', signedAt: '2026-05-16T09:30:00Z' },
    ],
    requiredSignatures: ['i2', 'e2'],
    previewUrl: null,
  },
  {
    id: 'doc3',
    name: 'HealthPulse – NDA.pdf',
    type: 'PDF',
    size: '0.5 MB',
    status: 'draft',
    uploadedBy: 'e3',
    uploaderName: 'Maya Patel',
    uploadedAt: '2026-06-01T14:00:00Z',
    dealId: 'deal3',
    signatures: [],
    requiredSignatures: ['i3', 'e3'],
    previewUrl: null,
  },
  {
    id: 'doc4',
    name: 'UrbanFarm – Pitch Deck.pdf',
    type: 'PDF',
    size: '3.4 MB',
    status: 'draft',
    uploadedBy: 'e4',
    uploaderName: 'James Wilson',
    uploadedAt: '2026-06-02T11:30:00Z',
    dealId: null,
    signatures: [],
    requiredSignatures: [],
    previewUrl: null,
  },
];

export const addChamberDocument = (doc) => {
  const newDoc = {
    ...doc,
    id: `doc${chamberDocuments.length + 1}`,
    uploadedAt: new Date().toISOString(),
    signatures: [],
    status: 'draft',
  };
  chamberDocuments.push(newDoc);
  return newDoc;
};

export const signDocument = (docId, userId, userName) => {
  const doc = chamberDocuments.find((d) => d.id === docId);
  if (!doc) return null;
  const alreadySigned = doc.signatures.some((s) => s.userId === userId);
  if (!alreadySigned) {
    doc.signatures.push({ userId, name: userName, signedAt: new Date().toISOString() });
  }
  const allSigned = doc.requiredSignatures.every((uid) =>
    doc.signatures.some((s) => s.userId === uid)
  );
  if (allSigned) doc.status = 'signed';
  else if (doc.signatures.length > 0) doc.status = 'in_review';
  return doc;
};

export const updateDocumentStatus = (docId, status) => {
  const doc = chamberDocuments.find((d) => d.id === docId);
  if (doc) doc.status = status;
  return doc;
};
