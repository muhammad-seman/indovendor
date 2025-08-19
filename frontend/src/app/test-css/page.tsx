'use client';

export default function TestCSSPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FEFEFE', padding: '2rem' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#222831', marginBottom: '2rem' }}>
          Test Layout & CSS - Elegant IndoVendor Theme  
        </h1>
        
        {/* Test Basic Layout */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2D3339', marginBottom: '1rem' }}>Basic Layout Test</h2>
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginBottom: '1rem',
            padding: '1rem',
            backgroundColor: '#F9F8F6',
            borderRadius: '8px'
          }}>
            <div style={{ flex: 1, padding: '1rem', backgroundColor: '#EEEBE5', borderRadius: '4px' }}>Flex Item 1</div>
            <div style={{ flex: 1, padding: '1rem', backgroundColor: '#E7E3DA', borderRadius: '4px' }}>Flex Item 2</div>
            <div style={{ flex: 1, padding: '1rem', backgroundColor: '#DFD0B8', borderRadius: '4px' }}>Flex Item 3</div>
          </div>
        </div>
        
        {/* Test Grid */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2D3339', marginBottom: '1rem' }}>Grid Test</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{ padding: '1rem', backgroundColor: '#222831', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
              Primary #222831
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#393E46', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
              Primary #393E46
            </div>
            <div style={{ padding: '1rem', backgroundColor: '#948979', color: 'white', borderRadius: '8px', textAlign: 'center' }}>
              Secondary #948979  
            </div>
          </div>
        </div>
        
        {/* Color Palette Test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary-700">Color Palette</h2>
          <div className="grid grid-cols-4 gap-4">
            {/* Primary Colors */}
            <div className="space-y-2">
              <h3 className="font-medium text-neutral-700">Primary</h3>
              <div className="h-12 bg-primary-800 rounded flex items-center justify-center text-white text-sm">#222831</div>
              <div className="h-12 bg-primary-600 rounded flex items-center justify-center text-white text-sm">#393E46</div>
            </div>
            
            {/* Secondary Colors */}
            <div className="space-y-2">
              <h3 className="font-medium text-neutral-700">Secondary</h3>
              <div className="h-12 bg-secondary-600 rounded flex items-center justify-center text-white text-sm">#948979</div>
              <div className="h-12 bg-secondary-500 rounded flex items-center justify-center text-white text-sm">Sage</div>
            </div>
            
            {/* Accent Colors */}
            <div className="space-y-2">
              <h3 className="font-medium text-neutral-700">Accent</h3>
              <div className="h-12 bg-accent-500 rounded flex items-center justify-center text-primary-800 text-sm">#DFD0B8</div>
              <div className="h-12 bg-accent-100 rounded flex items-center justify-center text-primary-800 text-sm border">Light</div>
            </div>
            
            {/* Neutral Colors */}
            <div className="space-y-2">
              <h3 className="font-medium text-neutral-700">Neutral</h3>
              <div className="h-12 bg-neutral-800 rounded flex items-center justify-center text-white text-sm">Dark</div>
              <div className="h-12 bg-neutral-200 rounded flex items-center justify-center text-neutral-800 text-sm">Light</div>
            </div>
          </div>
        </div>
        
        {/* Button Tests */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary-700">Buttons</h2>
          <div className="flex gap-4 flex-wrap">
            <button className="btn-elegant">Primary Button</button>
            <button className="btn-secondary">Secondary Button</button>
            <button className="bg-accent-500 text-primary-800 px-6 py-3 rounded-xl font-semibold hover:bg-accent-600 transition-colors">
              Accent Button
            </button>
            <button className="border border-primary-600 text-primary-600 px-6 py-3 rounded-xl font-semibold hover:bg-primary-600 hover:text-white transition-all">
              Outline Button
            </button>
          </div>
        </div>
        
        {/* Card Tests */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary-700">Cards</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card-elegant p-6">
              <h3 className="text-lg font-semibold text-primary-800 mb-2">Elegant Card</h3>
              <p className="text-neutral-600">This is a card with elegant styling using clean single colors.</p>
            </div>
            
            <div className="bg-accent-100 border border-accent-300 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-semibold text-secondary-700 mb-2">Custom Card</h3>
              <p className="text-neutral-600">This card uses custom Tailwind classes.</p>
            </div>
            
            <div className="bg-secondary-100 border border-secondary-300 rounded-2xl p-6 hover:-translate-y-1 hover:shadow-lg transition-all">
              <h3 className="text-lg font-semibold text-primary-800 mb-2">Hover Card</h3>
              <p className="text-neutral-600">This card has hover effects applied.</p>
            </div>
          </div>
        </div>
        
        {/* Typography Test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary-700">Typography</h2>
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-primary-800">Heading 1</h1>
            <h2 className="text-3xl font-bold text-primary-700">Heading 2</h2>
            <h3 className="text-2xl font-semibold text-secondary-700">Heading 3</h3>
            <h4 className="text-xl font-semibold text-secondary-600">Heading 4</h4>
            <p className="text-neutral-700 leading-relaxed">
              This is a paragraph with regular text. The elegant IndoVendor theme uses clean, single colors 
              instead of gradients for a more professional and sophisticated appearance.
            </p>
            <p className="elegant-text">This text uses the elegant-text class.</p>
          </div>
        </div>
        
        {/* Background Pattern Test */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-primary-700">Background Pattern</h2>
          <div className="bg-accent-50 rounded-2xl p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                 style={{
                   background: `
                     radial-gradient(circle at 20% 20%, #F4F2EE 0%, transparent 40%),
                     radial-gradient(circle at 80% 20%, #EEEBE5 0%, transparent 40%),
                     radial-gradient(circle at 40% 40%, #F4F2EE 0%, transparent 30%),
                     radial-gradient(circle at 60% 80%, #EEEBE5 0%, transparent 40%),
                     radial-gradient(circle at 20% 80%, #F4F2EE 0%, transparent 30%)
                   `
                 }}>
            </div>
            <div className="relative">
              <h3 className="text-xl font-semibold text-primary-800 mb-2">Batik Pattern Preview</h3>
              <p className="text-neutral-600">This shows the elegant batik pattern background.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}