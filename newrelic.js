'use strict'

/**
 * New Relic agent configuration.
 *
 * See lib/config.default.js in the agent distribution for a more complete
 * description of configuration variables and their potential values.
 */
exports.config = {
  /**
   * Array of application names.
   */
  app_name: ['Gong Fu Tea'],
  /**
   * Your New Relic license key.
   */
  license_key: '2de24d1192d07be965b1be176c4a4287d1d58c75',
  logging: {
    /**
     * Level at which to log. 'trace' is most useful to New Relic when diagnosing
     * issues with the agent, 'info' and higher will impose the least overhead on
     * production applications.
     */
    level: 'info'
  }
}
