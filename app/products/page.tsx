import { shopifyFetchServer } from '@/lib/shopify-server';
import { ALL_PRODUCTS_QUERY } from '@/lib/queries';
import { ShopifyProduct } from '@/lib/types';
import { MOCK_PRODUCTS } from '@/lib/mock-data';
import ProductGrid from '@/components/product/ProductGrid';

async function getAllProducts(): Promise<ShopifyProduct[]> {
  try {
    const response = await shopifyFetchServer({
      query: ALL_PRODUCTS_QUERY,
      variables: { first: 24 },
    });
    const edges = response.data?.products?.edges || [];
    if (edges.length === 0) return MOCK_PRODUCTS;
    return edges.map((edge: any) => edge.node);
  } catch (error) {
    console.error('Error fetching products (using mock data):', error);
    return MOCK_PRODUCTS;
  }
}

export default async function ProductsPage() {
  const products = await getAllProducts();
  const isMock = products.length > 0 && products[0].id.startsWith('mock-');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            All Products
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover our complete collection of premium products, carefully curated for quality and style.
          </p>
          <div className="mt-6">
            <span className="inline-flex items-center px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200">
              {products.length} {products.length === 1 ? 'Product' : 'Products'}
            </span>
          </div>
        </div>

        {/* Mock data notice */}
        {isMock && (
          <div className="mb-8 text-center text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            ⚠️ Shopify store is unavailable — showing preview data
          </div>
        )}

        {/* Products Grid */}
        {products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-gray-400 text-2xl">📦</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
            <p className="text-gray-600">
              We're working on adding new products. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
