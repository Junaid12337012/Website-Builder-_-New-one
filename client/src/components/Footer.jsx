import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiYoutube, FiLinkedin, FiMail } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const navigation = {
    main: [
      { name: 'Features', href: '/#features' },
      { name: 'Templates', href: '/templates' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Blog', href: '/blog' },
      { name: 'Documentation', href: '/docs' },
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
    ],
    social: [
      {
        name: 'GitHub',
        href: 'https://github.com',
        icon: FiGithub,
      },
      {
        name: 'Twitter',
        href: 'https://twitter.com',
        icon: FiTwitter,
      },
      {
        name: 'YouTube',
        href: 'https://youtube.com',
        icon: FiYoutube,
      },
      {
        name: 'LinkedIn',
        href: 'https://linkedin.com',
        icon: FiLinkedin,
      },
      {
        name: 'Email',
        href: 'mailto:hello@webcraft.com',
        icon: FiMail,
      },
    ],
  };

  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <nav className="flex flex-wrap justify-center gap-8 md:gap-12 lg:gap-16 mb-12">
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Product</h3>
            <ul className="space-y-3">
              {navigation.main.slice(0, 4).map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-3">
              {navigation.main.slice(4, 7).map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Legal</h3>
            <ul className="space-y-3">
              {navigation.main.slice(7).map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-300 tracking-wider uppercase mb-4">Subscribe</h3>
            <p className="text-gray-400 mb-4 max-w-xs">Get the latest news and updates to your inbox.</p>
            <div className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="min-w-0 flex-auto rounded-l-lg border-0 bg-gray-800 px-4 py-2 text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 sm:text-sm"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-r-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 text-sm font-medium text-white hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Subscribe
              </button>
            </div>
          </div>
        </nav>
        
        <div className="mt-8 pt-8 border-t border-gray-800 md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2">
            {navigation.social.map((item) => (
              <a
                key={item.name}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
          <div className="mt-8 md:mt-0 md:order-1">
            <p className="text-center text-base text-gray-400">
              &copy; {currentYear} WebCraft. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
