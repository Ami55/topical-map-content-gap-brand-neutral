import React, { useState } from 'react';
import { 
  FileCode2, 
  Search, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  Trash2,
  Download
} from 'lucide-react';
import { DiscoveredPage } from '../types';

interface WebsiteInventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: DiscoveredPage[];
  onAddPage: (page: DiscoveredPage) => void;
  domain: string;
}

export const WebsiteInventoryModal: React.FC<WebsiteInventoryModalProps> = ({
  isOpen,
  onClose,
  pages,
  onAddPage,
  domain,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newH1, setNewH1] = useState('');
  const [newPageType, setNewPageType] = useState('Tour category');

  if (!isOpen) return null;

  const filteredPages = pages.filter(p => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return p.url.toLowerCase().includes(term) || p.title.toLowerCase().includes(term);
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim() || !newTitle.trim()) return;

    let formattedUrl = newUrl.trim();
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const page: DiscoveredPage = {
      id: `page_${Date.now()}`,
      url: formattedUrl,
      title: newTitle.trim(),
      h1: newH1.trim() || newTitle.trim(),
      metaDescription: '',
      canonicalUrl: formattedUrl,
      pageType: newPageType,
      mainTopic: newTitle.trim(),
      likelySearchIntent: 'Commercial investigation',
      mainEntities: [],
      parentSection: 'Website',
      indexability: 'Indexable',
      httpStatus: 200,
      source: 'manual',
    };

    onAddPage(page);
    setIsAddOpen(false);
    setNewUrl('');
    setNewTitle('');
    setNewH1('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <FileCode2 className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Website Inventory & Page Discovery
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {pages.length} crawled and cataloged pages from <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{domain}</span>.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAddOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Page URL</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg text-lg"
            >
              ×
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search pages by URL or title..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-y-auto p-4">
          {isAddOpen && (
            <form onSubmit={handleCreate} className="mb-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 dark:text-white">Add Website URL</span>
                <button type="button" onClick={() => setIsAddOpen(false)} className="text-slate-400">Cancel</button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Page URL *</label>
                  <input
                    type="text"
                    required
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://www.example.com/category/page-slug"
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Page Title *</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Private Tokyo Tours & Local Guides"
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Main H1 Heading</label>
                  <input
                    type="text"
                    value={newH1}
                    onChange={(e) => setNewH1(e.target.value)}
                    placeholder="Tokyo Private Tours"
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1">Page Archetype</label>
                  <input
                    type="text"
                    value={newPageType}
                    onChange={(e) => setNewPageType(e.target.value)}
                    placeholder="Tour category"
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg text-xs"
              >
                Save Page to Inventory
              </button>
            </form>
          )}

          <div className="space-y-2">
            {filteredPages.map((page) => (
              <div
                key={page.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:bg-white dark:hover:bg-slate-900 transition flex items-start justify-between gap-4 text-xs"
              >
                <div className="space-y-1 max-w-2xl">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">
                      {page.title}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {page.pageType}
                    </span>
                  </div>

                  <a
                    href={page.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>{page.url}</span>
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>

                  {page.metaDescription && (
                    <p className="text-[11px] text-slate-500 line-clamp-1">
                      {page.metaDescription}
                    </p>
                  )}
                </div>

                <div className="text-right flex-shrink-0">
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800 font-bold">
                    HTTP {page.httpStatus || 200}
                  </span>
                </div>
              </div>
            ))}

            {filteredPages.length === 0 && (
              <div className="py-12 text-center text-slate-400 text-xs">
                No crawled pages match your query.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
