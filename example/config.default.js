
'use strict';

var config = {

  // Your site title (format: page_title - site_title)
  site_title: 'Wee-Kee',

  // The base URL of your site (can use %base_url% in Markdown files)
  base_url: 'http://localhost:3000',
  base_suburl: 'wiki',
  proxy_reverse_url: 'http://localhost',

  // Used for the "Get in touch" page footer link
  support_email: '',

  // Footer Text / Copyright
  copyright: 'Copyright &copy; '+ new Date().getFullYear() +' - <a href="http://raneto.com">Powered by Raneto</a>',

  // Excerpt length (used in search)
  excerpt_length: 400,

  // The meta value by which to sort pages (value should be an integer)
  // If this option is blank pages will be sorted alphabetically
  page_sort_meta: 'sort',

  // Should categories be sorted numerically (true) or alphabetically (false)
  // If true category folders need to contain a "sort" file with an integer value
  category_sort: true,

  // Which Theme to Use?
  theme_dir  : __dirname + '/../themes/',
  theme_name : 'default',

  // Specify the path of your content folder where all your '.md' files are located
  // Fix: Needs trailing slash for now!
  // Fix: Cannot be an absolute path
  content_dir : __dirname + '/../../content/',

  // Where is the public directory or document root?
  public_dir  : __dirname + '/../themes/default/public/',

  // homepage dir
  home_dir: '/contributing',

  // The base URL of your images folder,
  // Relative to config.public_dir
  // (can use %image_url% in Markdown files)
  image_url: '/images',

  // Add your analytics tracking code (including script tags)
  analytics: '',

  // Set to true to enable the web editor
  allow_editing : true,

  // Set to true to enable HTTP Basic Authentication
  authentication : true,

  // If editing is enabled, set this to true to only authenticate for editing, not for viewing
  authentication_for_edit: true,

  // If authentication is enabled, set this to true to enable authentication for reading too
  authentication_for_read: false,

  // Google OAuth
  googleoauth: false,
  oauth2 : {
    client_id: 'GOOGLE_CLIENT_ID',
    client_secret: 'GOOGLE_CLIENT_SECRET',
    callback: 'http://localhost:3000/auth/google/callback',
    hostedDomain: 'google.com'
  },
  secret: 'someCoolSecretRightHere',

  credentials    : [
    {
      username : 'admin',
      password : 'password'
    },
    {
      username : 'admin2',
      password : 'password'
    }
  ],

  locale: 'en',

  // Sets the format for datetime's
  datetime_format: 'Do MMM YYYY',

  // Set to true to render suitable layout for RTL languages
  rtl_layout: false,

  // Edit Home Page title, description, etc.
  home_meta : {
    //title       : 'Custom Home Title',
    //description : 'Custom Home Description'
  },

  //variables: [
  //  {
  //    name: 'test_variable',
  //    content: 'test variable'
  //  },
  //  {
  //    name: 'test_variable_2',
  //    content: 'test variable 2'
  //  }
  //]

  table_of_contents: false,

  // Database Settings
  db_host: '127.0.0.1',
  db_port: '3306',
  db_user: 'root',
  db_pass: 'Dnss1234',

  db_account_name: 'test',
  table_account_name: 'account',
  db_comment_name: 'test',
  table_comment_name: 'comment',
  table_articlewatch_name: 'watch',

  // Git Settings
  git_path: 'http://localhost:5000/root/test',

  // mail
  mail_address: '578044856@qq.com',
  mail_server: 'smtp.qq.com',
  mail_port: 465,
  mail_password: 'Dnss1234'

};

// Exports
module.exports = config;
