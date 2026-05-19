import { shopifyFetchServer } from '@/lib/shopify-server';
import { FEATURED_COLLECTIONS_QUERY } from '@/lib/queries';
import { ShopifyCollection } from '@/lib/types';
import { MOCK_COLLECTIONS } from '@/lib/mock-data';
import CollectionCard from '@/components/collection/CollectionCard';

async function getCollections(): Promise<ShopifyCollection[]> {
  try {
    const response = await shopifyFetchServer({
      query: FEATURED_COLLECTIONS_QUERY,
      variables: { first: 12 },
    });
    const edges = response.data?.collections?.edges || [];
    if (edges.length === 0) return MOCK_COLLECTIONS;
    return edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error('Error fetching collections (using mock data):', error);
    return MOCK_COLLECTIONS;
  }
}

export default async function CollectionsPage() {
  const collections = await getCollections();
  const isMock = collections.length > 0 && collections[0].id.startsWith('mock-');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Collections
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Explore our carefully curated collections, each thoughtfully designed to bring you products that combine quality, style, and functionality.
          </p>
        </div>

        {/* Mock data notice */}
        {isMock && (
          <div className="mb-8 text-center text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            ⚠️ Shopify store is unavailable — showing preview data
          </div>
        )}

        {/* Collections Grid */}
        {collections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection) => (
              <CollectionCard key={collection.id} collection={collection} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-gray-400 text-2xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Collections Found</h3>
            <p className="text-gray-600">
              We're working on adding new collections. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
