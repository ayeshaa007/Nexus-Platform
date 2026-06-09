import React, { useState, useRef, useEffect } from 'react';
import {
  FileText, Upload, Eye, PenLine, CheckCircle, Clock, AlertCircle,
  Download, Trash2, X, Check,
} from 'lucide-react';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Avatar } from '../../components/ui/Avatar';
import { useAuth } from '../../context/AuthContext';
import {
  chamberDocuments,
  addChamberDocument,
  signDocument,
  updateDocumentStatus,
} from '../../data/documentsData';
import { findUserById } from '../../data/users';

const statusMeta = {
  draft: { label: 'Draft', variant: 'gray', icon: <AlertCircle size={14} /> },
  in_review: { label: 'In Review', variant: 'warning', icon: <Clock size={14} /> },
  signed: { label: 'Signed', variant: 'success', icon: <CheckCircle size={14} /> },
};

// Signature Pad component
const SignaturePad = ({ onSave, onCancel }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setDrawing(true);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!drawing) return;
    const ctx = canvasRef.current.getContext('2d');
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDraw = () => setDrawing(false);

  const clear = () => {
    const canvas = canvasRef.current;
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const save = () => {
    if (!hasDrawn) return;
    const dataUrl = canvasRef.current.toDataURL();
    onSave(dataUrl);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <PenLine size={18} className="text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900">Sign Document</h3>
          </div>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-gray-600">
            Draw your signature below. This will be applied to the document.
          </p>
          <div className="border-2 border-dashed border-gray-300 rounded-xl overflow-hidden bg-gray-50">
            <canvas
              ref={canvasRef}
              width={460}
              height={160}
              className="w-full touch-none cursor-crosshair"
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={stopDraw}
              onMouseLeave={stopDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={stopDraw}
            />
          </div>
          <p className="text-xs text-gray-400 text-center">Sign above using mouse or touch</p>
        </div>
        <div className="flex justify-between px-5 pb-5 gap-3">
          <Button variant="outline" size="sm" onClick={clear}>Clear</Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
            <Button size="sm" disabled={!hasDrawn} onClick={save}
              leftIcon={<Check size={14} />}>
              Apply Signature
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Document preview modal
const DocumentPreview = ({ doc, onClose }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <FileText size={18} className="text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900 truncate">{doc.name}</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
          <X size={20} />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {/* Mock document content */}
        <div className="bg-white rounded-xl shadow p-8 max-w-xl mx-auto space-y-4 text-sm text-gray-700">
          <div className="text-center border-b pb-4">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Business Nexus Platform</p>
            <h2 className="text-xl font-bold text-gray-900">{doc.name.replace('.pdf', '')}</h2>
            <p className="text-xs text-gray-400 mt-1">
              Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
            </p>
          </div>
          <p>
            This document constitutes a legally binding agreement between the parties as listed below.
            All terms are subject to applicable law.
          </p>
          <p>
            <strong>Party A:</strong> {doc.uploaderName}<br />
            <strong>Status:</strong>{' '}
            <span className="capitalize">{doc.status.replace('_', ' ')}</span><br />
            <strong>Document ID:</strong> {doc.id.toUpperCase()}-2026
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
            fugiat nulla pariatur.
          </p>
          <p>
            Both parties agree to the terms and conditions as stipulated within this agreement
            and any associated schedules or annexures appended hereto.
          </p>
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <p className="font-semibold text-gray-800">Signatures:</p>
            {doc.signatures.length > 0 ? (
              doc.signatures.map((sig) => (
                <div key={sig.userId} className="flex items-center gap-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle size={16} className="text-green-600" />
                  <div>
                    <p className="text-sm font-medium">{sig.name}</p>
                    <p className="text-xs text-gray-500">
                      Signed: {new Date(sig.signedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 italic">No signatures yet</p>
            )}
          </div>
        </div>
      </div>
      <div className="px-5 py-4 border-t border-gray-200 flex justify-end gap-2">
        <Button variant="outline" leftIcon={<Download size={14} />}>Download</Button>
        <Button variant="outline" onClick={onClose}>Close</Button>
      </div>
    </div>
  </div>
);

export const DocumentChamberPage = () => {
  const { user } = useAuth();
  const [docs, setDocs] = useState([...chamberDocuments]);
  const [signingDoc, setSigningDoc] = useState(null);
  const [previewDoc, setPreviewDoc] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ name: '', type: 'PDF' });
  const fileInputRef = useRef(null);

  const handleSign = (dataUrl) => {
    if (!signingDoc || !user) return;
    const updated = signDocument(signingDoc.id, user.id, user.name);
    if (updated) {
      setDocs((prev) => prev.map((d) => (d.id === updated.id ? { ...updated } : d)));
    }
    setSigningDoc(null);
  };

  const handleUpload = () => {
    if (!uploadForm.name.trim() || !user) return;
    const newDoc = addChamberDocument({
      name: uploadForm.name.endsWith('.pdf') ? uploadForm.name : uploadForm.name + '.pdf',
      type: uploadForm.type,
      size: '0.8 MB',
      uploadedBy: user.id,
      uploaderName: user.name,
      requiredSignatures: [user.id],
      dealId: null,
    });
    setDocs((prev) => [...prev, newDoc]);
    setUploadForm({ name: '', type: 'PDF' });
    setUploading(false);
  };

  const canSign = (doc) =>
    user &&
    doc.requiredSignatures.includes(user.id) &&
    !doc.signatures.some((s) => s.userId === user.id);

  const stats = {
    total: docs.length,
    draft: docs.filter((d) => d.status === 'draft').length,
    in_review: docs.filter((d) => d.status === 'in_review').length,
    signed: docs.filter((d) => d.status === 'signed').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Chamber</h1>
          <p className="text-gray-600">
            Upload, review, and sign deal documents and contracts
          </p>
        </div>
        <Button leftIcon={<Upload size={16} />} onClick={() => setUploading(true)}>
          Upload Document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'text-gray-900', bg: 'bg-gray-50' },
          { label: 'Draft', value: stats.draft, color: 'text-gray-600', bg: 'bg-gray-50' },
          { label: 'In Review', value: stats.in_review, color: 'text-yellow-700', bg: 'bg-yellow-50' },
          { label: 'Signed', value: stats.signed, color: 'text-green-700', bg: 'bg-green-50' },
        ].map((s) => (
          <Card key={s.label} className={s.bg}>
            <CardBody>
              <p className="text-sm text-gray-500">{s.label}</p>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Upload form */}
      {uploading && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Upload size={18} className="text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900">Upload New Document</h2>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                  placeholder="e.g. Investment Agreement v1.pdf"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm((p) => ({ ...p, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary-500"
                  value={uploadForm.type}
                  onChange={(e) => setUploadForm((p) => ({ ...p, type: e.target.value }))}
                >
                  {['PDF', 'DOCX', 'XLSX'].map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>
            {/* Drag-and-drop zone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors"
            >
              <Upload size={32} className="mx-auto text-gray-300 mb-2" />
              <p className="text-sm font-medium text-gray-600">Click to select a file</p>
              <p className="text-xs text-gray-400 mt-1">PDF, DOCX, XLSX up to 10 MB</p>
              <input ref={fileInputRef} type="file" accept=".pdf,.docx,.xlsx" className="hidden" />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleUpload} disabled={!uploadForm.name.trim()}>
                Upload Document
              </Button>
              <Button variant="outline" onClick={() => setUploading(false)}>Cancel</Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Document list */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            {docs.map((doc) => {
              const meta = statusMeta[doc.status];
              const uploader = findUserById(doc.uploadedBy);
              const allRequired = doc.requiredSignatures.length;
              const signed = doc.signatures.length;

              return (
                <div
                  key={doc.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {/* Icon */}
                  <div className="p-3 bg-primary-50 rounded-xl flex-shrink-0 self-start sm:self-center">
                    <FileText size={22} className="text-primary-600" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">{doc.name}</p>
                      <Badge variant={meta.variant} size="sm">
                        <span className="flex items-center gap-1">
                          {meta.icon} {meta.label}
                        </span>
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                      <span>{doc.type} · {doc.size}</span>
                      <span>By {doc.uploaderName}</span>
                      <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                    </div>
                    {/* Signature progress */}
                    {allRequired > 0 && (
                      <div className="flex items-center gap-2 pt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-[120px]">
                          <div
                            className="bg-green-500 h-1.5 rounded-full"
                            style={{ width: `${(signed / allRequired) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">
                          {signed}/{allRequired} signed
                        </span>
                      </div>
                    )}
                    {/* Signatures list */}
                    {doc.signatures.length > 0 && (
                      <div className="flex items-center gap-1 pt-1">
                        {doc.signatures.map((sig) => (
                          <div key={sig.userId} className="flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                            <CheckCircle size={10} />
                            {sig.name}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      leftIcon={<Eye size={14} />}
                      onClick={() => setPreviewDoc(doc)}
                    >
                      Preview
                    </Button>
                    {canSign(doc) && (
                      <Button
                        size="sm"
                        leftIcon={<PenLine size={14} />}
                        onClick={() => setSigningDoc(doc)}
                      >
                        Sign
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="text-error-500 hover:bg-error-50">
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Signature pad modal */}
      {signingDoc && (
        <SignaturePad
          onSave={handleSign}
          onCancel={() => setSigningDoc(null)}
        />
      )}

      {/* Preview modal */}
      {previewDoc && (
        <DocumentPreview doc={previewDoc} onClose={() => setPreviewDoc(null)} />
      )}
    </div>
  );
};
