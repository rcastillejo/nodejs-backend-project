require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  mlab_host: process.env.MLAB_HOST || 'https://api.mlab.com/api/1/databases/',
  mlab_db: process.env.MLAB_DB || 'techu22db/',
  mlab_key: 'apiKey=' + process.env.API_KEY,
  mlab_collection_account_movements: 'account_movements',
  mlab_collection_users: 'users',
  URLbase: process.env.URL_BASE || '/apitechu/v0/',
  SECRET_TOKEN:'TechU2017'
}
