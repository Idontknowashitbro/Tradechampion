
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-forex-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="text-2xl font-bold text-white flex items-center">
              <span className="mr-2">📈</span>
              TradeChampionX
            </Link>
            <p className="mt-4 text-gray-300 max-w-md">
              Join thousands of traders competing in our daily, weekly, and monthly forex challenges.
              Test your skills, earn recognition, and build your trading portfolio.
            </p>

            <div className="mt-6 flex space-x-4">
              <a href="https://discord.gg/tradechampionx" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#5865F2]/20 flex items-center justify-center hover:bg-[#5865F2]/40 transition-colors">
                <svg className="h-5 w-5 text-[#5865F2]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.222 0c1.406 0 2.54 1.137 2.607 2.475v19.05c0 1.338-1.134 2.475-2.607 2.475H3.778C2.371 24 1.238 22.863 1.238 21.525v-19.05C1.238 1.137 2.371 0 3.778 0h16.444zm-4.084 5.63c-.58 0-1.108.298-1.415.791-.306.493-.464 1.136-.464 1.86 0 .724.158 1.367.464 1.86.307.493.835.791 1.415.791s1.108-.298 1.415-.79c.306-.494.464-1.137.464-1.86 0-.725-.158-1.368-.464-1.861-.307-.493-.835-.79-1.415-.79zm-8.185 0c-.58 0-1.108.298-1.415.791-.307.493-.464 1.136-.464 1.86 0 .724.157 1.367.464 1.86.307.493.835.791 1.415.791s1.108-.298 1.415-.79c.306-.494.464-1.137.464-1.86 0-.725-.158-1.368-.464-1.861-.307-.493-.835-.79-1.415-.79zm4.094 7.226c-3.21-3.21 5.13-1.052 0 0zm0 0c-3.195-3.195 5.154-1.056 0 0zm0 0c-3.17-3.17 5.083-1.036 0 0zm0 0c-3.17-3.169 5.083-1.036 0 0z" />
                </svg>
              </a>

              <a href="https://twitter.com/tradechampionx" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#1DA1F2]/20 flex items-center justify-center hover:bg-[#1DA1F2]/40 transition-colors">
                <svg className="h-5 w-5 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>

              <a href="https://t.me/tradechampionx" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-[#0088cc]/20 flex items-center justify-center hover:bg-[#0088cc]/40 transition-colors">
                <svg className="h-5 w-5 text-[#0088cc]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.858-.921 4.177-1.302 5.533-.16.056-.118.2-.53.41-.412.205-1.184.589-1.926.936-.263.122-.485.229-.662.31-.484.222-1.925.917-1.925-.296v-1.19c0-.691.19-1.304 1.043-2.149 1.125-1.114 2.368-2.06 2.368-2.06s.526-.52.224-.8c-.122-.12-.304-.064-.304-.064L11.812 9.25s-.367.096-.55.192c-.182.096-.457.448-.457.448s-.182.352-.6 1.376c-.779 1.919-1.09 2.335-1.09 2.335s-.09.24-.367.255c-.277.016-.61-.289-.61-.289L7.7 11.677s-.166-.17-.089-.288c.077-.12.23-.192.23-.192l3.086-2.511s.305-.223.61-.351c.305-.128.61-.112.61-.112s3.086-.048 3.086.016c0 .064.228.112.228.112s.306-.016.7.192c.457.223.47.703.147 1.618z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/challenges" className="text-gray-300 hover:text-white transition-colors">Challenges</Link></li>
              <li><Link to="/leaderboard" className="text-gray-300 hover:text-white transition-colors">Leaderboard</Link></li>
              <li><a href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#rules" className="text-gray-300 hover:text-white transition-colors">Rules</a></li>
              <li><a href="https://discord.gg/tradechampionx" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">Discord Community</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Help & Support</h3>
            <ul className="space-y-3">
              <li><a href="#faq" className="text-gray-300 hover:text-white transition-colors">FAQ</a></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/challenge-rules" className="text-gray-300 hover:text-white transition-colors">Challenge Rules</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">
            &copy; {currentYear} TradeChampionX. All rights reserved.
            <Link to="/admin-login" className="ml-2 text-gray-500 hover:text-gray-400 text-xs">Admin</Link>
          </p>
          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">Powered by</span>
              <span className="text-xs bg-forex-primary/20 text-forex-primary px-2 py-1 rounded">cTrader API</span>
              <span className="text-xs bg-forex-secondary/20 text-forex-secondary px-2 py-1 rounded">NOWPayments</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
