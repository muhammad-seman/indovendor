'use client';

export default function TestLayoutPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FEFEFE', padding: '2rem' }}>
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#222831', marginBottom: '2rem' }}>
          🧪 Layout & CSS Test - IndoVendor  
        </h1>
        
        {/* Test Basic Layout */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2D3339', marginBottom: '1rem' }}>✅ Basic Layout (Inline Styles)</h2>
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginBottom: '1rem',
            padding: '1rem',
            backgroundColor: '#F9F8F6',
            borderRadius: '8px'
          }}>
            <div style={{ flex: 1, padding: '1rem', backgroundColor: '#EEEBE5', borderRadius: '4px', textAlign: 'center' }}>
              Flex Item 1
            </div>
            <div style={{ flex: 1, padding: '1rem', backgroundColor: '#E7E3DA', borderRadius: '4px', textAlign: 'center' }}>
              Flex Item 2
            </div>
            <div style={{ flex: 1, padding: '1rem', backgroundColor: '#DFD0B8', borderRadius: '4px', textAlign: 'center' }}>
              Flex Item 3
            </div>
          </div>
        </div>
        
        {/* Test Tailwind Classes */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2D3339', marginBottom: '1rem' }}>🎨 Tailwind Classes Test</h2>
          <div className="flex gap-4 p-4 bg-accent-100 rounded-lg">
            <div className="flex-1 p-4 bg-primary-800 text-white rounded text-center">
              Primary Color
            </div>
            <div className="flex-1 p-4 bg-secondary-600 text-white rounded text-center">
              Secondary Color  
            </div>
            <div className="flex-1 p-4 bg-accent-500 text-primary-800 rounded text-center">
              Accent Color
            </div>
          </div>
        </div>
        
        {/* Test Custom Button Classes */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2D3339', marginBottom: '1rem' }}>🔘 Button Styles Test</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn-elegant">
              Elegant Button
            </button>
            <button className="btn-secondary">
              Secondary Button
            </button>
            <button style={{
              backgroundColor: '#DFD0B8',
              color: '#222831',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              Inline Button
            </button>
          </div>
        </div>
        
        {/* Test Card Styles */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2D3339', marginBottom: '1rem' }}>📄 Card Styles Test</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            <div className="card-elegant" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#222831', marginBottom: '0.5rem' }}>
                Custom Card Class
              </h3>
              <p style={{ color: '#525252' }}>
                This card uses the .card-elegant class with custom styling.
              </p>
            </div>
            
            <div style={{ 
              backgroundColor: '#F9F8F6',
              border: '1px solid #E5E5E5',
              borderRadius: '16px',
              padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#948979', marginBottom: '0.5rem' }}>
                Inline Styled Card
              </h3>
              <p style={{ color: '#525252' }}>
                This card uses inline styles for comparison.
              </p>
            </div>
          </div>
        </div>
        
        {/* Test Typography */}
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#2D3339', marginBottom: '1rem' }}>📝 Typography Test</h2>
          <div style={{ padding: '1.5rem', backgroundColor: '#F9F8F6', borderRadius: '8px' }}>
            <h1 className="elegant-text" style={{ marginBottom: '1rem' }}>
              H1 with Elegant Text Class
            </h1>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#393E46', marginBottom: '0.5rem' }}>
              H2 with Inline Styles
            </h2>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#948979', marginBottom: '0.5rem' }}>
              H3 Secondary Color
            </h3>
            <p style={{ color: '#404040', lineHeight: '1.6' }}>
              This is a paragraph with regular text using the elegant IndoVendor theme colors. 
              The design focuses on clean, single colors instead of gradients for a professional look.
            </p>
          </div>
        </div>
        
        {/* Status Report */}
        <div style={{ 
          marginTop: '3rem',
          padding: '1.5rem',
          backgroundColor: '#EDEEE9',
          border: '1px solid #948979',
          borderRadius: '8px'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#222831', marginBottom: '1rem' }}>
            📊 Test Results
          </h2>
          <ul style={{ color: '#404040', lineHeight: '1.8' }}>
            <li>✅ <strong>Inline Styles</strong>: Working perfectly</li>
            <li>🎨 <strong>Tailwind Classes</strong>: Check if colors appear correctly</li>
            <li>🔘 <strong>Custom Button Classes</strong>: Check hover effects</li>
            <li>📄 <strong>Card Styles</strong>: Check hover animations</li>
            <li>📝 <strong>Typography</strong>: Check font weights and colors</li>
          </ul>
        </div>
      </div>
    </div>
  );
}