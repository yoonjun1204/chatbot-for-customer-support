import "./App.css";
import ChatWidget from "./components/ChatWidget";

const App = () => {
  return (
    <div className="page">
      {/* Top navigation */}
      <header className="nav">
        <div className="nav-logo">Shirtify</div>
        <nav className="nav-links">
          <a href="#products">Products</a>
          <a href="#about">About</a>
          <a href="#support">Support</a>
        </nav>
      </header>

      {/* Hero section */}
      <section className="hero">
        <div className="hero-text">
          <h1>Crisp, Comfortable Shirts for Every Day</h1>
          <p>
            Discover premium cotton shirts designed for comfort, style, and
            versatility. Work, weekend, or special occasions – we’ve got you
            covered.
          </p>
          <a href="#products" className="hero-cta">
            Browse Shirts
          </a>
        </div>
        <div className="hero-image">
          <div className="hero-card">
            <h2>New Arrival</h2>
            <p>Oxford Slim Fit Shirt</p>
            <span className="hero-price">$49.90</span>
          </div>
        </div>
      </section>

      {/* Product grid */}
      <section id="products" className="products-section">
        <h2>Featured Shirts</h2>
        <p className="section-subtitle">
          A few of our most popular picks. Ask the chatbot for size or material recommendations.
        </p>
        <div className="product-grid">
          <div className="product-card">
            <div className="product-image product-image-1" />
            <h3>Classic White Oxford</h3>
            <p>Cotton-rich fabric, perfect for office and events.</p>
            <span className="product-price">$45.00</span>
          </div>

          <div className="product-card">
            <div className="product-image product-image-2" />
            <h3>Casual Denim Shirt</h3>
            <p>Soft-washed denim for relaxed weekends.</p>
            <span className="product-price">$59.00</span>
          </div>

          <div className="product-card">
            <div className="product-image product-image-3" />
            <h3>Black Slim Fit</h3>
            <p>Minimalist, modern, and easy to pair with anything.</p>
            <span className="product-price">$52.00</span>
          </div>
        </div>
      </section>

      {/* About section */}
      <section id="about" className="info-section">
        <h2>Why Shop with Shirtify?</h2>
        <div className="info-grid">
          <div className="info-card">
            <h3>Premium Materials</h3>
            <p>
              Our shirts use cotton and cotton blends carefully selected for
              comfort, durability, and breathability.
            </p>
          </div>
          <div className="info-card">
            <h3>Easy Exchanges</h3>
            <p>
              Not the right size? Our 30-day return and exchange policy keeps
              things easy and stress-free.
            </p>
          </div>
          <div className="info-card">
            <h3>Smart Chat Support</h3>
            <p>
              The built-in chatbot helps you with product questions, order
              status, and return policy anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="support" className="footer">
        <p>Need help? Click the chat button at the bottom right to talk to Shirt Support.</p>
        <p className="footer-muted">© {new Date().getFullYear()} Shirtify. All rights reserved.</p>
      </footer>

      {/* Chat widget floating on top */}
      <ChatWidget />
    </div>
  );
};

export default App;
