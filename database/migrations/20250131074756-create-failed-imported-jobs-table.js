'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('failed_imported_jobs', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      fetch_batch_id: {
        type: Sequelize.BIGINT,
        references: { model: 'job_fetch_batches', key: 'id' },
        onDelete: 'SET NULL',
      },
      job_details: {
        type: Sequelize.JSON,
      },
      error: {
        type: Sequelize.TEXT,
      },
      failed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('failed_imported_jobs');
  },
};
